export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  brand?: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  alertQuantity: number;
  unit: string;
  taxRate: number;
  description?: string;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  taxNumber?: string;
  openingBalance: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  company?: string;
  taxNumber?: string;
  openingBalance: number;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  taxAmount: number;
  shippingCost: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: 'paid' | 'partial' | 'due';
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'cheque' | 'other';
  status: 'completed' | 'pending' | 'cancelled' | 'returned';
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  saleId?: string;
  customerId?: string;
  supplierId?: string;
  type: 'received' | 'paid';
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer' | 'cheque' | 'other';
  reference?: string;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  referenceNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: 'paid' | 'partial' | 'due';
  status: 'completed' | 'pending' | 'ordered';
  notes?: string;
  createdAt: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  currency: string;
  currencySymbol: string;
  taxNumber: string;
  invoicePrefix: string;
  receiptFooter: string;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  totalDue: number;
  todaySales: number;
  todayRevenue: number;
}
