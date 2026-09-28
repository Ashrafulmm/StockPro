import { useEffect, useState } from 'react';
import { getProducts, getSales, getCustomers, getPayments } from '../lib/store';
import { Product, Sale, Customer, Payment } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Package, Users, AlertTriangle, TrendingUp, ShoppingCart } from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
    setSales(getSales());
    setCustomers(getCustomers());
    setPayments(getPayments());
    setMounted(true);
  }, []);

  const today = new Date().toDateString();
  const todaySales = sales.filter(s => new Date(s.createdAt).toDateString() === today);
  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.grandTotal, 0);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalDue = sales.reduce((sum, s) => sum + s.dueAmount, 0);
  const lowStockProducts = products.filter(p => p.quantity <= p.alertQuantity);
  const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0);

  // Last 7 days sales data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const salesByDay = last7Days.map(date => {
    const dayStr = date.toDateString();
    const daySales = sales.filter(s => new Date(s.createdAt).toDateString() === dayStr);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sales: daySales.reduce((sum, s) => sum + s.grandTotal, 0),
      count: daySales.length,
    };
  });

  // Category distribution
  const categoryData = products.reduce((acc, p) => {
    const existing = acc.find(a => a.name === p.category);
    if (existing) {
      existing.value += p.quantity;
    } else {
      acc.push({ name: p.category, value: p.quantity });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  // Payment methods
  const paymentMethods = sales.reduce((acc, s) => {
    if (s.status === 'completed') {
      const existing = acc.find(a => a.name === s.paymentMethod);
      if (existing) {
        existing.value += s.paidAmount;
      } else {
        acc.push({ name: s.paymentMethod, value: s.paidAmount });
      }
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">${todayRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{todaySales.length} transactions</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{sales.length} total sales</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              <p className="text-xs text-gray-400 mt-1">{products.length} products</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Due</p>
              <p className="text-2xl font-bold text-red-600">${totalDue.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Pending payments</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      {mounted && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales - Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="text-amber-500 mr-2" size={20} />
            Low Stock Alert
          </h3>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-500">All products are well stocked!</p>
            ) : (
              lowStockProducts.slice(0, 5).map(product => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600">{product.quantity} left</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShoppingCart className="text-indigo-500 mr-2" size={20} />
            Recent Sales
          </h3>
          <div className="space-y-3">
            {sales.slice(-5).reverse().map(sale => (
              <div key={sale.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{sale.invoiceNumber}</p>
                  <p className="text-xs text-gray-500">{sale.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${sale.grandTotal.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                    sale.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {sale.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Customers</span>
              <span className="text-sm font-bold text-gray-900">{customers.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Products</span>
              <span className="text-sm font-bold text-gray-900">{products.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Sales</span>
              <span className="text-sm font-bold text-gray-900">{sales.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Paid Invoices</span>
              <span className="text-sm font-bold text-green-600">{sales.filter(s => s.paymentStatus === 'paid').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Partial Payments</span>
              <span className="text-sm font-bold text-amber-600">{sales.filter(s => s.paymentStatus === 'partial').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Due Invoices</span>
              <span className="text-sm font-bold text-red-600">{sales.filter(s => s.paymentStatus === 'due').length}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Sale Value</span>
              <span className="text-sm font-bold text-gray-900">
                ${sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
