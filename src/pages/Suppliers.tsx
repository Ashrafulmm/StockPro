import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier, getPurchases } from '../lib/store';
import { Supplier, Purchase } from '../types';
import { Plus, Search, Edit, Trash2, X, Truck, Phone, Mail } from 'lucide-react';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState<Partial<Supplier>>({
    name: '', email: '', phone: '', address: '', city: '', company: '', taxNumber: '', openingBalance: 0
  });

  useEffect(() => {
    setSuppliers(getSuppliers());
    setPurchases(getPurchases());
  }, []);

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.company && s.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.phone && s.phone.includes(searchTerm))
  );

  const getSupplierDue = (supplierId: string) => {
    return purchases
      .filter(p => p.supplierId === supplierId && p.dueAmount > 0)
      .reduce((sum, p) => sum + p.dueAmount, 0);
  };

  const openNewForm = () => {
    setEditingSupplier(null);
    setForm({ name: '', email: '', phone: '', address: '', city: '', company: '', taxNumber: '', openingBalance: 0 });
    setShowForm(true);
  };

  const openEditForm = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setForm(supplier);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingSupplier) {
      const updated = { ...editingSupplier, ...form } as Supplier;
      updateSupplier(updated);
    } else {
      const newSupplier: Supplier = {
        id: uuidv4(),
        name: form.name || '',
        email: form.email || '',
        phone: form.phone || '',
        address: form.address || '',
        city: form.city || '',
        company: form.company || '',
        taxNumber: form.taxNumber || '',
        openingBalance: Number(form.openingBalance) || 0,
        createdAt: new Date().toISOString(),
      };
      addSupplier(newSupplier);
    }
    setSuppliers(getSuppliers());
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      deleteSupplier(id);
      setSuppliers(getSuppliers());
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-500">{suppliers.length} suppliers</p>
        </div>
        <button onClick={openNewForm} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={18} /> Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search suppliers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(supplier => {
          const due = getSupplierDue(supplier.id);
          return (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Truck className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                    {supplier.company && <p className="text-xs text-gray-500">{supplier.company}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditForm(supplier)} className="text-indigo-600 hover:text-indigo-800 p-1"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(supplier.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                {supplier.phone && <p className="flex items-center gap-1"><Phone size={10} /> {supplier.phone}</p>}
                {supplier.email && <p className="flex items-center gap-1"><Mail size={10} /> {supplier.email}</p>}
                {supplier.city && <p>{supplier.address}, {supplier.city}</p>}
              </div>
              <div className="mt-3">
                <div className={`p-2 rounded text-xs ${due > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <span className="text-gray-500">Payable: </span>
                  <span className={`font-bold ${due > 0 ? 'text-red-600' : 'text-green-600'}`}>${due.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl">
          <Truck className="mx-auto mb-3" size={40} />
          <p>No suppliers found</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Number</label>
                  <input type="text" value={form.taxNumber || ''} onChange={(e) => setForm({ ...form, taxNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
                  <input type="number" value={form.openingBalance || ''} onChange={(e) => setForm({ ...form, openingBalance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" step="0.01" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{editingSupplier ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
