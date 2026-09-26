import { useState, useEffect } from 'react';
import { getProducts, getSales, getCustomers, getPayments, getExpenses } from '../lib/store';
import { Product, Sale, Customer, Payment, Expense } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar } from 'lucide-react';

export default function Reports() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState('sales');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
    setSales(getSales());
    setCustomers(getCustomers());
    setPayments(getPayments());
    setExpenses(getExpenses());
    setMounted(true);
  }, []);

  const filteredSales = sales.filter(s => {
    if (!dateFrom && !dateTo) return true;
    const saleDate = new Date(s.createdAt).toISOString().split('T')[0];
    if (dateFrom && saleDate < dateFrom) return false;
    if (dateTo && saleDate > dateTo) return false;
    return true;
  });

  // Sales Report Data
  const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalSalesTax = filteredSales.reduce((sum, s) => sum + s.taxAmount, 0);
  const totalSalesDiscount = filteredSales.reduce((sum, s) => sum + s.discount, 0);
  const totalSalesPaid = filteredSales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalSalesDue = filteredSales.reduce((sum, s) => sum + s.dueAmount, 0);

  // Product stock value
  const totalStockValue = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
  const totalRetailValue = products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);

  // Top selling products
  const productSalesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
  filteredSales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
      }
      productSalesMap[item.productId].quantity += item.quantity;
      productSalesMap[item.productId].revenue += item.total;
    });
  });
  const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // Monthly sales data
  const monthlyData: Record<string, { month: string; sales: number; revenue: number }> = {};
  filteredSales.forEach(sale => {
    const month = new Date(sale.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    if (!monthlyData[month]) {
      monthlyData[month] = { month, sales: 0, revenue: 0 };
    }
    monthlyData[month].sales += 1;
    monthlyData[month].revenue += sale.grandTotal;
  });
  const monthlyChartData = Object.values(monthlyData);

  // Payment method breakdown
  const paymentBreakdown = filteredSales.reduce((acc, s) => {
    if (s.status === 'completed') {
      const existing = acc.find(a => a.name === s.paymentMethod);
      if (existing) existing.value += s.paidAmount;
      else acc.push({ name: s.paymentMethod, value: s.paidAmount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Customer-wise sales
  const customerSales = filteredSales.reduce((acc, s) => {
    if (s.customerId) {
      const existing = acc.find(a => a.id === s.customerId);
      if (existing) {
        existing.total += s.grandTotal;
        existing.count += 1;
      } else {
        acc.push({ id: s.customerId, name: s.customerName, total: s.grandTotal, count: 1 });
      }
    }
    return acc;
  }, [] as { id: string; name: string; total: number; count: number }[]).sort((a, b) => b.total - a.total);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

  const tabs = [
    { id: 'sales', label: 'Sales Report' },
    { id: 'products', label: 'Stock Report' },
    { id: 'customers', label: 'Customer Report' },
    { id: 'profit', label: 'Profit & Loss' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">Business analytics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm" />
          <span className="text-gray-400">to</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sales Report */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{filteredSales.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalSalesRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Tax Collected</p>
              <p className="text-2xl font-bold text-blue-600">${totalSalesTax.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">${totalSalesDue.toFixed(2)}</p>
            </div>
          </div>

          {mounted && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={paymentBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {paymentBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">#</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Product</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">Qty Sold</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-500">{index + 1}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-2 text-right">{product.quantity}</td>
                      <td className="px-4 py-2 text-right font-medium text-green-600">${product.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stock Report */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Stock Value (Cost)</p>
              <p className="text-2xl font-bold text-blue-600">${totalStockValue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Retail Value</p>
              <p className="text-2xl font-bold text-green-600">${totalRetailValue.toFixed(2)}</p>
            </div>
          </div>

          {mounted && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={products.reduce((acc, p) => {
                const existing = acc.find(a => a.category === p.category);
                if (existing) existing.quantity += p.quantity;
                else acc.push({ category: p.category, quantity: p.quantity });
                return acc;
              }, [] as { category: string; quantity: number }[])}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Inventory Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Product</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">SKU</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Category</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">Qty</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">Cost</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-2 text-gray-500">{p.sku}</td>
                      <td className="px-4 py-2"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">{p.category}</span></td>
                      <td className="px-4 py-2 text-right">{p.quantity} {p.unit}</td>
                      <td className="px-4 py-2 text-right">${p.costPrice.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right font-medium">${(p.costPrice * p.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Report */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Total Sales to Customers</p>
              <p className="text-2xl font-bold text-green-600">${filteredSales.reduce((sum, s) => sum + s.grandTotal, 0).toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Customer Receivables</p>
              <p className="text-2xl font-bold text-red-600">${totalSalesDue.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Customer-wise Sales</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">#</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Customer</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">Orders</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {customerSales.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-500">{index + 1}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">{customer.name}</td>
                      <td className="px-4 py-2 text-right">{customer.count}</td>
                      <td className="px-4 py-2 text-right font-medium text-green-600">${customer.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Profit & Loss */}
      {activeTab === 'profit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit & Loss Statement</h3>
            <div className="space-y-3">
              <div className="border-b pb-3">
                <h4 className="text-sm font-semibold text-green-700 mb-2">REVENUE</h4>
                <div className="flex justify-between text-sm pl-4">
                  <span className="text-gray-600">Sales Revenue</span>
                  <span className="font-medium">${totalSalesRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pl-4 mt-1">
                  <span className="text-gray-600">Less: Discounts</span>
                  <span className="font-medium text-red-500">-${totalSalesDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pl-4 mt-1 font-bold border-t pt-2">
                  <span className="text-gray-700">Net Revenue</span>
                  <span className="text-green-700">${(totalSalesRevenue - totalSalesDiscount).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-b pb-3">
                <h4 className="text-sm font-semibold text-red-700 mb-2">COST OF GOODS SOLD</h4>
                <div className="flex justify-between text-sm pl-4">
                  <span className="text-gray-600">Cost of Items Sold</span>
                  <span className="font-medium">
                    ${filteredSales.reduce((sum, s) => sum + s.items.reduce((itemSum, item) => {
                      const product = products.find(p => p.id === item.productId);
                      return itemSum + (product ? product.costPrice * item.quantity : 0);
                    }, 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-b pb-3">
                <h4 className="text-sm font-semibold text-blue-700 mb-2">GROSS PROFIT</h4>
                <div className="flex justify-between text-sm pl-4 font-bold text-lg">
                  <span>Gross Profit</span>
                  <span className="text-blue-700">
                    ${(totalSalesRevenue - totalSalesDiscount - filteredSales.reduce((sum, s) => sum + s.items.reduce((itemSum, item) => {
                      const product = products.find(p => p.id === item.productId);
                      return itemSum + (product ? product.costPrice * item.quantity : 0);
                    }, 0), 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-b pb-3">
                <h4 className="text-sm font-semibold text-amber-700 mb-2">EXPENSES</h4>
                <div className="flex justify-between text-sm pl-4">
                  <span className="text-gray-600">Total Expenses</span>
                  <span className="font-medium">${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-indigo-900">Net Profit</span>
                  <span className="text-indigo-700">
                    ${(totalSalesRevenue - totalSalesDiscount - filteredSales.reduce((sum, s) => sum + s.items.reduce((itemSum, item) => {
                      const product = products.find(p => p.id === item.productId);
                      return itemSum + (product ? product.costPrice * item.quantity : 0);
                    }, 0), 0) - expenses.reduce((sum, e) => sum + e.amount, 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
