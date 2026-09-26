import { Product, Category, Customer, Supplier, Sale, Payment, Purchase, Expense, StoreSettings } from '../types';

const STORAGE_KEYS = {
  products: 'pos_products',
  categories: 'pos_categories',
  customers: 'pos_customers',
  suppliers: 'pos_suppliers',
  sales: 'pos_sales',
  payments: 'pos_payments',
  purchases: 'pos_purchases',
  expenses: 'pos_expenses',
  settings: 'pos_settings',
};

function getItem<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Products
export function getProducts(): Product[] {
  return getItem<Product[]>(STORAGE_KEYS.products, []);
}

export function saveProducts(products: Product[]): void {
  setItem(STORAGE_KEYS.products, products);
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(product: Product): void {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
    saveProducts(products);
  }
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
}

// Categories
export function getCategories(): Category[] {
  return getItem<Category[]>(STORAGE_KEYS.categories, [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Groceries' },
    { id: '3', name: 'Clothing' },
    { id: '4', name: 'Hardware' },
    { id: '5', name: 'General' },
  ]);
}

export function saveCategories(categories: Category[]): void {
  setItem(STORAGE_KEYS.categories, categories);
}

// Customers
export function getCustomers(): Customer[] {
  return getItem<Customer[]>(STORAGE_KEYS.customers, []);
}

export function saveCustomers(customers: Customer[]): void {
  setItem(STORAGE_KEYS.customers, customers);
}

export function addCustomer(customer: Customer): void {
  const customers = getCustomers();
  customers.push(customer);
  saveCustomers(customers);
}

export function updateCustomer(customer: Customer): void {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === customer.id);
  if (index !== -1) {
    customers[index] = customer;
    saveCustomers(customers);
  }
}

export function deleteCustomer(id: string): void {
  const customers = getCustomers().filter(c => c.id !== id);
  saveCustomers(customers);
}

// Suppliers
export function getSuppliers(): Supplier[] {
  return getItem<Supplier[]>(STORAGE_KEYS.suppliers, []);
}

export function saveSuppliers(suppliers: Supplier[]): void {
  setItem(STORAGE_KEYS.suppliers, suppliers);
}

export function addSupplier(supplier: Supplier): void {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  saveSuppliers(suppliers);
}

export function updateSupplier(supplier: Supplier): void {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(s => s.id === supplier.id);
  if (index !== -1) {
    suppliers[index] = supplier;
    saveSuppliers(suppliers);
  }
}

export function deleteSupplier(id: string): void {
  const suppliers = getSuppliers().filter(s => s.id !== id);
  saveSuppliers(suppliers);
}

// Sales
export function getSales(): Sale[] {
  return getItem<Sale[]>(STORAGE_KEYS.sales, []);
}

export function saveSales(sales: Sale[]): void {
  setItem(STORAGE_KEYS.sales, sales);
}

export function addSale(sale: Sale): void {
  const sales = getSales();
  sales.push(sale);
  saveSales(sales);
}

export function updateSale(sale: Sale): void {
  const sales = getSales();
  const index = sales.findIndex(s => s.id === sale.id);
  if (index !== -1) {
    sales[index] = sale;
    saveSales(sales);
  }
}

// Payments
export function getPayments(): Payment[] {
  return getItem<Payment[]>(STORAGE_KEYS.payments, []);
}

export function savePayments(payments: Payment[]): void {
  setItem(STORAGE_KEYS.payments, payments);
}

export function addPayment(payment: Payment): void {
  const payments = getPayments();
  payments.push(payment);
  savePayments(payments);
}

// Purchases
export function getPurchases(): Purchase[] {
  return getItem<Purchase[]>(STORAGE_KEYS.purchases, []);
}

export function savePurchases(purchases: Purchase[]): void {
  setItem(STORAGE_KEYS.purchases, purchases);
}

export function addPurchase(purchase: Purchase): void {
  const purchases = getPurchases();
  purchases.push(purchase);
  savePurchases(purchases);
}

// Expenses
export function getExpenses(): Expense[] {
  return getItem<Expense[]>(STORAGE_KEYS.expenses, []);
}

export function saveExpenses(expenses: Expense[]): void {
  setItem(STORAGE_KEYS.expenses, expenses);
}

export function addExpense(expense: Expense): void {
  const expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
}

// Settings
export function getSettings(): StoreSettings {
  return getItem<StoreSettings>(STORAGE_KEYS.settings, {
    storeName: 'My Store',
    storeAddress: '123 Main Street',
    storePhone: '+1 234 567 890',
    storeEmail: 'store@example.com',
    currency: 'USD',
    currencySymbol: '$',
    taxNumber: '',
    invoicePrefix: 'INV-',
    receiptFooter: 'Thank you for your purchase!',
  });
}

export function saveSettings(settings: StoreSettings): void {
  setItem(STORAGE_KEYS.settings, settings);
}

// Seed demo data
export function seedDemoData(): void {
  if (getProducts().length === 0) {
    const demoProducts: Product[] = [
      { id: '1', name: 'Laptop Pro 15"', sku: 'LP-001', barcode: '1000000001', category: 'Electronics', brand: 'TechBrand', costPrice: 800, sellingPrice: 1200, quantity: 25, alertQuantity: 5, unit: 'pcs', taxRate: 10, description: 'High performance laptop', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: 'Wireless Mouse', sku: 'WM-002', barcode: '1000000002', category: 'Electronics', brand: 'TechBrand', costPrice: 15, sellingPrice: 29.99, quantity: 150, alertQuantity: 20, unit: 'pcs', taxRate: 10, description: 'Ergonomic wireless mouse', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3', name: 'USB-C Cable', sku: 'UC-003', barcode: '1000000003', category: 'Electronics', costPrice: 3, sellingPrice: 9.99, quantity: 500, alertQuantity: 50, unit: 'pcs', taxRate: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '4', name: 'Rice 5kg', sku: 'RC-004', barcode: '1000000004', category: 'Groceries', costPrice: 8, sellingPrice: 12.50, quantity: 200, alertQuantity: 30, unit: 'bags', taxRate: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '5', name: 'Olive Oil 1L', sku: 'OO-005', barcode: '1000000005', category: 'Groceries', costPrice: 6, sellingPrice: 11.99, quantity: 80, alertQuantity: 15, unit: 'bottles', taxRate: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '6', name: 'Cotton T-Shirt', sku: 'CT-006', barcode: '1000000006', category: 'Clothing', brand: 'FashionCo', costPrice: 8, sellingPrice: 19.99, quantity: 100, alertQuantity: 10, unit: 'pcs', taxRate: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '7', name: 'Hammer', sku: 'HM-007', barcode: '1000000007', category: 'Hardware', costPrice: 5, sellingPrice: 14.99, quantity: 45, alertQuantity: 10, unit: 'pcs', taxRate: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '8', name: 'Screwdriver Set', sku: 'SD-008', barcode: '1000000008', category: 'Hardware', costPrice: 12, sellingPrice: 24.99, quantity: 60, alertQuantity: 10, unit: 'sets', taxRate: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '9', name: 'Notebook A5', sku: 'NB-009', barcode: '1000000009', category: 'General', costPrice: 1.5, sellingPrice: 4.99, quantity: 300, alertQuantity: 50, unit: 'pcs', taxRate: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '10', name: 'Bluetooth Speaker', sku: 'BS-010', barcode: '1000000010', category: 'Electronics', brand: 'SoundMax', costPrice: 25, sellingPrice: 49.99, quantity: 3, alertQuantity: 5, unit: 'pcs', taxRate: 10, description: 'Portable bluetooth speaker', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    saveProducts(demoProducts);
  }

  if (getCustomers().length === 0) {
    const demoCustomers: Customer[] = [
      { id: '1', name: 'Walk-in Customer', phone: '', openingBalance: 0, createdAt: new Date().toISOString() },
      { id: '2', name: 'John Smith', email: 'john@email.com', phone: '+1 555 0101', address: '456 Oak Ave', city: 'New York', state: 'NY', openingBalance: 0, createdAt: new Date().toISOString() },
      { id: '3', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555 0102', address: '789 Pine St', city: 'Los Angeles', state: 'CA', openingBalance: 500, createdAt: new Date().toISOString() },
      { id: '4', name: 'Mike Wilson', email: 'mike@email.com', phone: '+1 555 0103', address: '321 Elm Dr', city: 'Chicago', state: 'IL', openingBalance: 0, createdAt: new Date().toISOString() },
    ];
    saveCustomers(demoCustomers);
  }

  if (getSuppliers().length === 0) {
    const demoSuppliers: Supplier[] = [
      { id: '1', name: 'TechDistributors Inc', email: 'sales@techdist.com', phone: '+1 555 0201', address: '100 Industrial Blvd', city: 'Houston', company: 'TechDistributors', openingBalance: 0, createdAt: new Date().toISOString() },
      { id: '2', name: 'Global Foods Ltd', email: 'orders@globalfoods.com', phone: '+1 555 0202', address: '200 Market St', city: 'Miami', company: 'Global Foods', openingBalance: 2000, createdAt: new Date().toISOString() },
      { id: '3', name: 'Fashion Wholesale Co', email: 'wholesale@fashionco.com', phone: '+1 555 0203', address: '300 Garment District', city: 'New York', company: 'Fashion Wholesale', openingBalance: 0, createdAt: new Date().toISOString() },
    ];
    saveSuppliers(demoSuppliers);
  }

  if (getSales().length === 0) {
    const now = new Date();
    const demoSales: Sale[] = [
      {
        id: '1', invoiceNumber: 'INV-0001', customerId: '2', customerName: 'John Smith',
        items: [{ productId: '1', productName: 'Laptop Pro 15"', quantity: 1, unitPrice: 1200, discount: 0, taxRate: 10, total: 1320 }],
        subtotal: 1200, discount: 0, taxAmount: 120, shippingCost: 0, grandTotal: 1320, paidAmount: 1320, dueAmount: 0,
        paymentStatus: 'paid', paymentMethod: 'card', status: 'completed', createdAt: new Date(now.getTime() - 86400000 * 5).toISOString()
      },
      {
        id: '2', invoiceNumber: 'INV-0002', customerId: '3', customerName: 'Sarah Johnson',
        items: [{ productId: '2', productName: 'Wireless Mouse', quantity: 3, unitPrice: 29.99, discount: 5, taxRate: 10, total: 85.47 }, { productId: '3', productName: 'USB-C Cable', quantity: 5, unitPrice: 9.99, discount: 0, taxRate: 10, total: 54.95 }],
        subtotal: 134.92, discount: 5, taxAmount: 13.04, shippingCost: 0, grandTotal: 142.96, paidAmount: 100, dueAmount: 42.96,
        paymentStatus: 'partial', paymentMethod: 'cash', status: 'completed', createdAt: new Date(now.getTime() - 86400000 * 3).toISOString()
      },
      {
        id: '3', invoiceNumber: 'INV-0003', customerId: '1', customerName: 'Walk-in Customer',
        items: [{ productId: '7', productName: 'Hammer', quantity: 2, unitPrice: 14.99, discount: 0, taxRate: 10, total: 32.98 }, { productId: '8', productName: 'Screwdriver Set', quantity: 1, unitPrice: 24.99, discount: 0, taxRate: 10, total: 27.49 }],
        subtotal: 54.97, discount: 0, taxAmount: 5.50, shippingCost: 0, grandTotal: 60.47, paidAmount: 60.47, dueAmount: 0,
        paymentStatus: 'paid', paymentMethod: 'cash', status: 'completed', createdAt: new Date(now.getTime() - 86400000 * 1).toISOString()
      },
      {
        id: '4', invoiceNumber: 'INV-0004', customerId: '4', customerName: 'Mike Wilson',
        items: [{ productId: '6', productName: 'Cotton T-Shirt', quantity: 5, unitPrice: 19.99, discount: 10, taxRate: 10, total: 95.95 }],
        subtotal: 99.95, discount: 10, taxAmount: 9.00, shippingCost: 5, grandTotal: 103.95, paidAmount: 103.95, dueAmount: 0,
        paymentStatus: 'paid', paymentMethod: 'bank_transfer', status: 'completed', createdAt: new Date(now.getTime() - 3600000).toISOString()
      },
    ];
    saveSales(demoSales);
  }
}
