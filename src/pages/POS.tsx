import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getProducts, getCustomers, getSales, addSale, updateProductStock, getSettings } from '../lib/store';
import { Product, Customer, Sale, SaleItem, StoreSettings } from '../types';
import { Search, Plus, Minus, Trash2, ShoppingCart, User, CreditCard, DollarSign, X, Check, Package } from 'lucide-react';

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('cash');
  const [paidAmount, setPaidAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'My Store', storeAddress: '', storePhone: '', storeEmail: '',
    currency: 'USD', currencySymbol: '$', taxNumber: '', invoicePrefix: 'INV-', receiptFooter: ''
  });
  const [salesCount, setSalesCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const [productsData, customersData, salesData, settingsData] = await Promise.all([
        getProducts(), getCustomers(), getSales(), getSettings()
      ]);
      setProducts(productsData);
      setCustomers(customersData);
      setSettings(settingsData);
      setSalesCount(salesData.length);
    };
    loadData();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory && p.quantity > 0;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) return;
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice - item.discount }
          : item
      ));
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.sellingPrice,
        discount: 0,
        taxRate: product.taxRate,
        total: product.sellingPrice,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        const product = products.find(p => p.id === productId);
        if (product && newQty > product.quantity) return item;
        return { ...item, quantity: newQty, total: newQty * item.unitPrice - item.discount };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalDiscount = discount + cart.reduce((sum, item) => sum + item.discount, 0);
  const taxAmount = cart.reduce((sum, item) => sum + ((item.quantity * item.unitPrice - item.discount) * item.taxRate / 100), 0);
  const grandTotal = subtotal - totalDiscount + taxAmount + shippingCost;

  const completeSale = async () => {
    if (cart.length === 0) return;

    const invoiceNumber = `${settings.invoicePrefix}${String(salesCount + 1).padStart(4, '0')}`;

    const newSale: Sale = {
      id: uuidv4(),
      invoiceNumber,
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      items: cart,
      subtotal,
      discount: totalDiscount,
      taxAmount,
      shippingCost,
      grandTotal,
      paidAmount,
      dueAmount: grandTotal - paidAmount,
      paymentStatus: paidAmount >= grandTotal ? 'paid' : paidAmount > 0 ? 'partial' : 'due',
      paymentMethod,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    await addSale(newSale);

    // Update product quantities
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        await updateProductStock(product.id, product.quantity - item.quantity);
      }
    }

    setShowSuccess(true);
    setTimeout(async () => {
      setShowSuccess(false);
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
      setShippingCost(0);
      setPaidAmount(0);
      setShowPayment(false);
      const [updatedProducts, updatedSales] = await Promise.all([getProducts(), getSales()]);
      setProducts(updatedProducts);
      setSalesCount(updatedSales.length);
    }, 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)]">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Sale Completed!</h3>
            <p className="text-gray-500 mt-2">Invoice has been generated</p>
          </div>
        </div>
      )}

      {/* Products Panel */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search products, SKU, barcode..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
              {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map(product => (
              <button key={product.id} onClick={() => addToCart(product)}
                className="p-3 border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{product.sku}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${product.quantity <= product.alertQuantity ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {product.quantity}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 line-clamp-2">{product.name}</p>
                <p className="text-sm font-bold text-indigo-600 mt-1">${product.sellingPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-400">{product.unit}</p>
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Package className="mx-auto mb-3" size={40} />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <select value={selectedCustomer?.id || ''}
              onChange={(e) => { const customer = customers.find(c => c.id === e.target.value); setSelectedCustomer(customer || null); }}
              className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500">
              <option value="">Walk-in Customer</option>
              {customers.filter(c => c.name !== 'Walk-in Customer').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart className="mx-auto mb-3" size={40} />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs mt-1">Click products to add them</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.productId} className="p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                      <p className="text-xs text-gray-500">${item.unitPrice.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.productId, -1)}
                        className="w-6 h-6 flex items-center justify-center bg-white border rounded text-xs hover:bg-gray-100">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white border rounded text-xs hover:bg-gray-100">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">${item.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Discount</span>
              <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-20 text-right text-sm border border-gray-200 rounded px-2 py-0.5" min="0" step="0.01" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Shipping</span>
              <input type="number" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-20 text-right text-sm border border-gray-200 rounded px-2 py-0.5" min="0" step="0.01" />
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span className="text-indigo-600">${grandTotal.toFixed(2)}</span>
            </div>
            <button onClick={() => { setShowPayment(true); setPaidAmount(grandTotal); }}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              <CreditCard size={18} />
              Pay ${grandTotal.toFixed(2)}
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Payment</h3>
              <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-sm text-indigo-600">Grand Total</p>
                <p className="text-3xl font-bold text-indigo-700">${grandTotal.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['cash', 'card', 'bank_transfer'] as const).map(method => (
                    <button key={method} onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${paymentMethod === method ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400'}`}>
                      {method === 'bank_transfer' ? 'Bank' : method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Paid Amount</label>
                <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full text-2xl font-bold text-center border-2 border-gray-200 rounded-lg py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" min="0" step="0.01" />
              </div>
              {paidAmount < grandTotal && (
                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-sm text-amber-700">Due Amount: <span className="font-bold">${(grandTotal - paidAmount).toFixed(2)}</span></p>
                </div>
              )}
              {paidAmount > grandTotal && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-700">Change: <span className="font-bold">${(paidAmount - grandTotal).toFixed(2)}</span></p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowPayment(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={completeSale} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2">
                  <DollarSign size={18} /> Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
