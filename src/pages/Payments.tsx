import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getPayments, addPayment, getCustomers, getSales, updateSale } from '../lib/store';
import { Payment, Customer, Sale } from '../types';
import { Plus, Search, X, CreditCard, ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'received' | 'paid'>('all');

  const [form, setForm] = useState<Partial<Payment>>({
    type: 'received', amount: 0, method: 'cash', reference: '', notes: '', customerId: '', saleId: '', date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setPayments(getPayments());
    setCustomers(getCustomers());
    setSales(getSales());
  }, []);

  const filteredPayments = payments.filter(p => {
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesType;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalReceived = filteredPayments.filter(p => p.type === 'received').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = filteredPayments.filter(p => p.type === 'paid').reduce((sum, p) => sum + p.amount, 0);

  const customerSales = form.customerId ? sales.filter(s => s.customerId === form.customerId && s.dueAmount > 0) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || form.amount <= 0) return;

    const newPayment: Payment = {
      id: uuidv4(),
      saleId: form.saleId || undefined,
      customerId: form.customerId || undefined,
      type: form.type as 'received' | 'paid',
      amount: Number(form.amount),
      method: form.method as Payment['method'],
      reference: form.reference || '',
      notes: form.notes || '',
      date: form.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    addPayment(newPayment);

    // Update sale if payment is linked to a sale
    if (form.saleId && form.type === 'received') {
      const sale = sales.find(s => s.id === form.saleId);
      if (sale) {
        const updatedSale = {
          ...sale,
          paidAmount: sale.paidAmount + Number(form.amount),
          dueAmount: sale.dueAmount - Number(form.amount),
          paymentStatus: (sale.paidAmount + Number(form.amount) >= sale.grandTotal ? 'paid' : 'partial') as Sale['paymentStatus'],
        };
        updateSale(updatedSale);
      }
    }

    setPayments(getPayments());
    setSales(getSales());
    setShowForm(false);
    setForm({ type: 'received', amount: 0, method: 'cash', reference: '', notes: '', customerId: '', saleId: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500">Track all payment transactions</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={18} /> Record Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg"><ArrowDownCircle className="text-green-600" size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Total Received</p>
              <p className="text-xl font-bold text-green-600">${totalReceived.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg"><ArrowUpCircle className="text-red-600" size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Total Paid Out</p>
              <p className="text-xl font-bold text-red-600">${totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg"><DollarSign className="text-blue-600" size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Net Balance</p>
              <p className="text-xl font-bold text-blue-600">${(totalReceived - totalPaid).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex gap-3">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="all">All Types</option>
            <option value="received">Received</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer/Supplier</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Method</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      payment.type === 'received' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {payment.type === 'received' ? '↓ Received' : '↑ Paid'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {payment.customerId ? customers.find(c => c.id === payment.customerId)?.name || '-' : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">${payment.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{payment.method.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-gray-500">{payment.reference || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{payment.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <CreditCard className="mx-auto mb-3" size={40} />
            <p>No payments recorded</p>
          </div>
        )}
      </div>

      {/* Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-gray-900">Record Payment</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="received">Payment Received</option>
                    <option value="paid">Payment Made</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select value={form.customerId || ''} onChange={(e) => setForm({ ...form, customerId: e.target.value, saleId: '' })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">Select Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {customerSales.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Against Invoice</label>
                  <select value={form.saleId || ''} onChange={(e) => {
                    const sale = sales.find(s => s.id === e.target.value);
                    setForm({ ...form, saleId: e.target.value, amount: sale?.dueAmount || 0 });
                  }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Select Invoice</option>
                    {customerSales.map(s => (
                      <option key={s.id} value={s.id}>{s.invoiceNumber} - Due: ${s.dueAmount.toFixed(2)}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input type="number" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" min="0" step="0.01" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                <input type="text" value={form.reference || ''} onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Transaction reference" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
