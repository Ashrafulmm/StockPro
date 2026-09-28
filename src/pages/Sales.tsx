import { useState, useEffect } from 'react';
import { getSales, updateSale, getSettings } from '../lib/store';
import { Sale } from '../types';
import { Search, Eye, X, Printer, CreditCard, DollarSign, Calendar } from 'lucide-react';

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [collectingSale, setCollectingSale] = useState<Sale | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('cash');
  const settings = getSettings();

  useEffect(() => {
    setSales(getSales());
  }, []);

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || s.paymentStatus === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const collectPayment = () => {
    if (!collectingSale || paymentAmount <= 0) return;

    const updatedSale = {
      ...collectingSale,
      paidAmount: collectingSale.paidAmount + paymentAmount,
      dueAmount: collectingSale.dueAmount - paymentAmount,
      paymentStatus: (collectingSale.paidAmount + paymentAmount >= collectingSale.grandTotal ? 'paid' : 'partial') as Sale['paymentStatus'],
      paymentMethod,
    };

    updateSale(updatedSale);
    setSales(getSales());
    setShowPaymentModal(false);
    setCollectingSale(null);
    setPaymentAmount(0);
  };

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalPaid = filteredSales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalDue = filteredSales.reduce((sum, s) => sum + s.dueAmount, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="text-sm text-gray-500">{sales.length} total sales</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="bg-green-50 px-3 py-2 rounded-lg">
            <span className="text-green-600 font-medium">Revenue: ${totalRevenue.toFixed(2)}</span>
          </div>
          <div className="bg-amber-50 px-3 py-2 rounded-lg">
            <span className="text-amber-600 font-medium">Due: ${totalDue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search invoice or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
          <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="due">Due</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Invoice</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Paid</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Due</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Payment</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-indigo-600">{sale.invoiceNumber}</td>
                  <td className="px-4 py-3 text-gray-700">{sale.customerName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">${sale.grandTotal.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-green-600">${sale.paidAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-red-600">${sale.dueAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                      sale.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {sale.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      sale.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      sale.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setSelectedSale(sale)} className="text-indigo-600 hover:text-indigo-800" title="View">
                        <Eye size={16} />
                      </button>
                      {sale.dueAmount > 0 && (
                        <button
                          onClick={() => { setCollectingSale(sale); setPaymentAmount(sale.dueAmount); setShowPaymentModal(true); }}
                          className="text-green-600 hover:text-green-800" title="Collect Payment"
                        >
                          <DollarSign size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSales.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <CreditCard className="mx-auto mb-3" size={40} />
            <p>No sales found</p>
          </div>
        )}
      </div>

      {/* Sale Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-gray-900">Invoice {selectedSale.invoiceNumber}</h3>
              <button onClick={() => setSelectedSale(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{selectedSale.customerName}</span></div>
                <div><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(selectedSale.createdAt).toLocaleString()}</span></div>
                <div><span className="text-gray-500">Payment:</span> <span className="font-medium capitalize">{selectedSale.paymentMethod.replace('_', ' ')}</span></div>
                <div><span className="text-gray-500">Status:</span> <span className="font-medium capitalize">{selectedSale.status}</span></div>
              </div>

              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2">Item</th>
                    <th className="text-right px-3 py-2">Qty</th>
                    <th className="text-right px-3 py-2">Price</th>
                    <th className="text-right px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{item.productName}</td>
                      <td className="px-3 py-2 text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${selectedSale.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>-${selectedSale.discount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>${selectedSale.taxAmount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>${selectedSale.shippingCost.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Grand Total</span><span className="text-indigo-600">${selectedSale.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600"><span>Paid</span><span>${selectedSale.paidAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-red-600"><span>Due</span><span>${selectedSale.dueAmount.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Collection Modal */}
      {showPaymentModal && collectingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Collect Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p>Invoice: <span className="font-medium">{collectingSale.invoiceNumber}</span></p>
                <p>Total: <span className="font-medium">${collectingSale.grandTotal.toFixed(2)}</span></p>
                <p>Already Paid: <span className="font-medium text-green-600">${collectingSale.paidAmount.toFixed(2)}</span></p>
                <p>Due: <span className="font-bold text-red-600">${collectingSale.dueAmount.toFixed(2)}</span></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full text-xl font-bold text-center border-2 border-gray-200 rounded-lg py-3 focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  max={collectingSale.dueAmount}
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as Sale['paymentMethod'])}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                onClick={collectPayment}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700"
              >
                Collect Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
