import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getPurchases, addPurchase, getProducts, getSuppliers, updateProductStock } from '../lib/store';
import { Purchase, PurchaseItem, Product, Supplier } from '../types';
import { Plus, X, Trash2, Package } from 'lucide-react';

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ supplierId: '', items: [] as PurchaseItem[], notes: '', paidAmount: 0 });

  useEffect(() => {
    const loadData = async () => {
      const [purchasesData, productsData, suppliersData] = await Promise.all([getPurchases(), getProducts(), getSuppliers()]);
      setPurchases(purchasesData);
      setProducts(productsData);
      setSuppliers(suppliersData);
    };
    loadData();
  }, []);

  const addItem = () => { setForm({ ...form, items: [...form.items, { productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0 }] }); };
  const updateItem = (index: number, field: string, value: any) => {
    const items = [...form.items];
    if (field === 'productId') { const product = products.find(p => p.id === value); items[index] = { ...items[index], productId: value, productName: product?.name || '', unitPrice: product?.costPrice || 0 }; }
    else { items[index] = { ...items[index], [field]: value }; }
    items[index].total = items[index].quantity * items[index].unitPrice;
    setForm({ ...form, items });
  };
  const removeItem = (index: number) => { setForm({ ...form, items: form.items.filter((_, i) => i !== index) }); };
  const subtotal = form.items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplierId || form.items.length === 0) return;
    const supplier = suppliers.find(s => s.id === form.supplierId);
    const newPurchase: Purchase = {
      id: uuidv4(), referenceNumber: `PO-${String(purchases.length + 1).padStart(4, '0')}`, supplierId: form.supplierId, supplierName: supplier?.name || '',
      items: form.items, subtotal, taxAmount: 0, grandTotal: subtotal, paidAmount: Number(form.paidAmount) || 0, dueAmount: subtotal - (Number(form.paidAmount) || 0),
      paymentStatus: (Number(form.paidAmount) || 0) >= subtotal ? 'paid' : (Number(form.paidAmount) || 0) > 0 ? 'partial' : 'due', status: 'completed', notes: form.notes, createdAt: new Date().toISOString(),
    };
    await addPurchase(newPurchase);
    for (const item of form.items) {
      const product = products.find(p => p.id === item.productId);
      if (product) await updateProductStock(product.id, product.quantity + item.quantity);
    }
    const [updatedPurchases, updatedProducts] = await Promise.all([getPurchases(), getProducts()]);
    setPurchases(updatedPurchases);
    setProducts(updatedProducts);
    setShowForm(false);
    setForm({ supplierId: '', items: [], notes: '', paidAmount: 0 });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Purchases</h1><p className="text-sm text-gray-500">{purchases.length} purchase orders</p></div>
        <button onClick={() => { setShowForm(true); addItem(); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"><Plus size={18} /> New Purchase</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th><th className="text-left px-4 py-3 font-medium text-gray-600">Supplier</th><th className="text-left px-4 py-3 font-medium text-gray-600">Date</th><th className="text-right px-4 py-3 font-medium text-gray-600">Total</th><th className="text-right px-4 py-3 font-medium text-gray-600">Paid</th><th className="text-right px-4 py-3 font-medium text-gray-600">Due</th><th className="text-center px-4 py-3 font-medium text-gray-600">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {purchases.map(purchase => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-indigo-600">{purchase.referenceNumber}</td>
                  <td className="px-4 py-3 text-gray-700">{purchase.supplierName}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right font-medium">${purchase.grandTotal.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-green-600">${purchase.paidAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-red-600">${purchase.dueAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${purchase.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : purchase.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{purchase.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {purchases.length === 0 && (<div className="text-center py-12 text-gray-400"><Package className="mx-auto mb-3" size={40} /><p>No purchases recorded</p></div>)}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b"><h3 className="text-lg font-bold text-gray-900">New Purchase Order</h3><button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label><select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required><option value="">Select Supplier</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label><input type="number" value={form.paidAmount || ''} onChange={(e) => setForm({ ...form, paidAmount: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" min="0" step="0.01" /></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-gray-700">Items</label><button type="button" onClick={addItem} className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center gap-1"><Plus size={14} /> Add Item</button></div>
                <div className="space-y-2">
                  {form.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1"><label className="text-xs text-gray-500">Product</label><select value={item.productId} onChange={(e) => updateItem(index, 'productId', e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"><option value="">Select</option>{products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.costPrice})</option>)}</select></div>
                      <div className="w-20"><label className="text-xs text-gray-500">Qty</label><input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" min="1" /></div>
                      <div className="w-24"><label className="text-xs text-gray-500">Price</label><input type="number" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" min="0" step="0.01" /></div>
                      <div className="w-24"><label className="text-xs text-gray-500">Total</label><p className="px-2 py-1.5 text-sm font-medium">${item.total.toFixed(2)}</p></div>
                      <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-lg font-bold"><span>Grand Total</span><span className="text-indigo-600">${subtotal.toFixed(2)}</span></div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Create Purchase</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
