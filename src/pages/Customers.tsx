import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer, getSales } from '../lib/store';
import { Customer, Sale } from '../types';
import { Plus, Search, Edit, Trash2, X, Users, Phone, Mail } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [form, setForm] = useState<Partial<Customer>>({
    name: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', taxNumber: '', openingBalance: 0
  });

  useEffect(() => {
    const loadData = async () => {
      const [customersData, salesData] = await Promise.all([getCustomers(), getSales()]);
      setCustomers(customersData);
      setSales(salesData);
    };
    loadData();
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm)) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCustomerDue = (customerId: string) => {
    return sales
      .filter(s => s.customerId === customerId && s.dueAmount > 0)
      .reduce((sum, s) => sum + s.dueAmount, 0);
  };

  const getCustomerTotalPurchases = (customerId: string) => {
    return sales
      .filter(s => s.customerId === customerId && s.status === 'completed')
      .reduce((sum, s) => sum + s.grandTotal, 0);
  };

  const openNewForm = () => {
    setEditingCustomer(null);
    setForm({ name: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', taxNumber: '', openingBalance: 0 });
    setShowForm(true);
  };

  const openEditForm = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm(customer);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingCustomer) {
      const updated = { ...editingCustomer, ...form } as Customer;
      await updateCustomer(updated);
    } else {
      const newCustomer: Customer = {
        id: uuidv4(),
        name: form.name || '',
        email: form.email || '',
        phone: form.phone || '',
        address: form.address || '',
        city: form.city || '',
        state: form.state || '',
        zipCode: form.zipCode || '',
        taxNumber: form.taxNumber || '',
        openingBalance: Number(form.openingBalance) || 0,
        createdAt: new Date().toISOString(),
      };
      await addCustomer(newCustomer);
    }
    const updatedCustomers = await getCustomers();
    setCustomers(updatedCustomers);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
      const updatedCustomers = await getCustomers();
      setCustomers(updatedCustomers);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">{customers.length} customers registered</p>
        </div>
        <button onClick={openNewForm} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => {
          const due = getCustomerDue(customer.id);
          const totalPurchases = getCustomerTotalPurchases(customer.id);
          return (
            <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">{customer.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    {customer.phone && <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10} /> {customer.phone}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditForm(customer)} className="text-indigo-600 hover:text-indigo-800 p-1">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(customer.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-500">Purchases</p>
                  <p className="font-bold text-gray-900">${totalPurchases.toFixed(2)}</p>
                </div>
                <div className={`p-2 rounded ${due > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className="text-gray-500">Due</p>
                  <p className={`font-bold ${due > 0 ? 'text-red-600' : 'text-green-600'}`}>${due.toFixed(2)}</p>
                </div>
              </div>
              {customer.email && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Mail size={10} /> {customer.email}</p>
              )}
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl">
          <Users className="mx-auto mb-3" size={40} />
          <p>No customers found</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" value={form.state || ''} onChange={(e) => setForm({ ...form, state: e.target.value })}
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
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{editingCustomer ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
