import { supabase } from './supabase';
import { Product, Category, Customer, Supplier, Sale, Payment, Purchase, Expense, StoreSettings } from '../types';

// ============ PRODUCTS ============
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}

export async function addProduct(product: Product): Promise<void> {
  const { error } = await supabase.from('products').insert([product]);
  if (error) console.error('Error adding product:', error);
}

export async function updateProduct(product: Product): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update(product)
    .eq('id', product.id);
  if (error) console.error('Error updating product:', error);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) console.error('Error deleting product:', error);
}

export async function updateProductStock(productId: string, quantity: number): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', productId);
  if (error) console.error('Error updating product stock:', error);
}

// ============ CATEGORIES ============
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [
      { id: '1', name: 'Electronics' },
      { id: '2', name: 'Groceries' },
      { id: '3', name: 'Clothing' },
      { id: '4', name: 'Hardware' },
      { id: '5', name: 'General' },
    ];
  }
  return data || [];
}

export async function addCategory(category: Category): Promise<void> {
  const { error } = await supabase.from('categories').insert([category]);
  if (error) console.error('Error adding category:', error);
}

// ============ CUSTOMERS ============
export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
  return data || [];
}

export async function addCustomer(customer: Customer): Promise<void> {
  const { error } = await supabase.from('customers').insert([customer]);
  if (error) console.error('Error adding customer:', error);
}

export async function updateCustomer(customer: Customer): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .update(customer)
    .eq('id', customer.id);
  if (error) console.error('Error updating customer:', error);
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) console.error('Error deleting customer:', error);
}

// ============ SUPPLIERS ============
export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
  return data || [];
}

export async function addSupplier(supplier: Supplier): Promise<void> {
  const { error } = await supabase.from('suppliers').insert([supplier]);
  if (error) console.error('Error adding supplier:', error);
}

export async function updateSupplier(supplier: Supplier): Promise<void> {
  const { error } = await supabase
    .from('suppliers')
    .update(supplier)
    .eq('id', supplier.id);
  if (error) console.error('Error updating supplier:', error);
}

export async function deleteSupplier(id: string): Promise<void> {
  const { error } = await supabase.from('suppliers').delete().eq('id', id);
  if (error) console.error('Error deleting supplier:', error);
}

// ============ SALES ============
export async function getSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
  return data || [];
}

export async function addSale(sale: Sale): Promise<void> {
  const { error } = await supabase.from('sales').insert([sale]);
  if (error) console.error('Error adding sale:', error);
}

export async function updateSale(sale: Sale): Promise<void> {
  const { error } = await supabase
    .from('sales')
    .update(sale)
    .eq('id', sale.id);
  if (error) console.error('Error updating sale:', error);
}

// ============ PAYMENTS ============
export async function getPayments(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
  return data || [];
}

export async function addPayment(payment: Payment): Promise<void> {
  const { error } = await supabase.from('payments').insert([payment]);
  if (error) console.error('Error adding payment:', error);
}

// ============ PURCHASES ============
export async function getPurchases(): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching purchases:', error);
    return [];
  }
  return data || [];
}

export async function addPurchase(purchase: Purchase): Promise<void> {
  const { error } = await supabase.from('purchases').insert([purchase]);
  if (error) console.error('Error adding purchase:', error);
}

// ============ EXPENSES ============
export async function getExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
  return data || [];
}

export async function addExpense(expense: Expense): Promise<void> {
  const { error } = await supabase.from('expenses').insert([expense]);
  if (error) console.error('Error adding expense:', error);
}

// ============ SETTINGS ============
export async function getSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();
  
  if (error || !data) {
    return {
      storeName: 'My Store',
      storeAddress: '123 Main Street',
      storePhone: '+1 234 567 890',
      storeEmail: 'store@example.com',
      currency: 'USD',
      currencySymbol: '$',
      taxNumber: '',
      invoicePrefix: 'INV-',
      receiptFooter: 'Thank you for your purchase!',
    };
  }
  return data as StoreSettings;
}

export async function saveSettings(settings: StoreSettings): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, ...settings });
  if (error) console.error('Error saving settings:', error);
}

// ============ SEED DATA ============
export async function seedDemoData(): Promise<void> {
  // Check if products exist
  const { data: existingProducts } = await supabase
    .from('products')
    .select('id')
    .limit(1);
  
  if (existingProducts && existingProducts.length > 0) return;

  const now = new Date().toISOString();
  
  // Seed categories
  await supabase.from('categories').insert([
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Groceries' },
    { id: '3', name: 'Clothing' },
    { id: '4', name: 'Hardware' },
    { id: '5', name: 'General' },
  ]);

  // Seed products
  await supabase.from('products').insert([
    { id: '1', name: 'Laptop Pro 15"', sku: 'LP-001', barcode: '1000000001', category: 'Electronics', brand: 'TechBrand', cost_price: 800, selling_price: 1200, quantity: 25, alert_quantity: 5, unit: 'pcs', tax_rate: 10, description: 'High performance laptop', created_at: now, updated_at: now },
    { id: '2', name: 'Wireless Mouse', sku: 'WM-002', barcode: '1000000002', category: 'Electronics', brand: 'TechBrand', cost_price: 15, selling_price: 29.99, quantity: 150, alert_quantity: 20, unit: 'pcs', tax_rate: 10, description: 'Ergonomic wireless mouse', created_at: now, updated_at: now },
    { id: '3', name: 'USB-C Cable', sku: 'UC-003', barcode: '1000000003', category: 'Electronics', cost_price: 3, selling_price: 9.99, quantity: 500, alert_quantity: 50, unit: 'pcs', tax_rate: 10, created_at: now, updated_at: now },
    { id: '4', name: 'Rice 5kg', sku: 'RC-004', barcode: '1000000004', category: 'Groceries', cost_price: 8, selling_price: 12.50, quantity: 200, alert_quantity: 30, unit: 'bags', tax_rate: 5, created_at: now, updated_at: now },
    { id: '5', name: 'Olive Oil 1L', sku: 'OO-005', barcode: '1000000005', category: 'Groceries', cost_price: 6, selling_price: 11.99, quantity: 80, alert_quantity: 15, unit: 'bottles', tax_rate: 5, created_at: now, updated_at: now },
    { id: '6', name: 'Cotton T-Shirt', sku: 'CT-006', barcode: '1000000006', category: 'Clothing', brand: 'FashionCo', cost_price: 8, selling_price: 19.99, quantity: 100, alert_quantity: 10, unit: 'pcs', tax_rate: 10, created_at: now, updated_at: now },
    { id: '7', name: 'Hammer', sku: 'HM-007', barcode: '1000000007', category: 'Hardware', cost_price: 5, selling_price: 14.99, quantity: 45, alert_quantity: 10, unit: 'pcs', tax_rate: 10, created_at: now, updated_at: now },
    { id: '8', name: 'Screwdriver Set', sku: 'SD-008', barcode: '1000000008', category: 'Hardware', cost_price: 12, selling_price: 24.99, quantity: 60, alert_quantity: 10, unit: 'sets', tax_rate: 10, created_at: now, updated_at: now },
    { id: '9', name: 'Notebook A5', sku: 'NB-009', barcode: '1000000009', category: 'General', cost_price: 1.5, selling_price: 4.99, quantity: 300, alert_quantity: 50, unit: 'pcs', tax_rate: 5, created_at: now, updated_at: now },
    { id: '10', name: 'Bluetooth Speaker', sku: 'BS-010', barcode: '1000000010', category: 'Electronics', brand: 'SoundMax', cost_price: 25, selling_price: 49.99, quantity: 3, alert_quantity: 5, unit: 'pcs', tax_rate: 10, description: 'Portable bluetooth speaker', created_at: now, updated_at: now },
  ]);

  // Seed customers
  await supabase.from('customers').insert([
    { id: '1', name: 'Walk-in Customer', phone: '', opening_balance: 0, created_at: now },
    { id: '2', name: 'John Smith', email: 'john@email.com', phone: '+1 555 0101', address: '456 Oak Ave', city: 'New York', state: 'NY', opening_balance: 0, created_at: now },
    { id: '3', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555 0102', address: '789 Pine St', city: 'Los Angeles', state: 'CA', opening_balance: 500, created_at: now },
    { id: '4', name: 'Mike Wilson', email: 'mike@email.com', phone: '+1 555 0103', address: '321 Elm Dr', city: 'Chicago', state: 'IL', opening_balance: 0, created_at: now },
  ]);

  // Seed suppliers
  await supabase.from('suppliers').insert([
    { id: '1', name: 'TechDistributors Inc', email: 'sales@techdist.com', phone: '+1 555 0201', address: '100 Industrial Blvd', city: 'Houston', company: 'TechDistributors', opening_balance: 0, created_at: now },
    { id: '2', name: 'Global Foods Ltd', email: 'orders@globalfoods.com', phone: '+1 555 0202', address: '200 Market St', city: 'Miami', company: 'Global Foods', opening_balance: 2000, created_at: now },
    { id: '3', name: 'Fashion Wholesale Co', email: 'wholesale@fashionco.com', phone: '+1 555 0203', address: '300 Garment District', city: 'New York', company: 'Fashion Wholesale', opening_balance: 0, created_at: now },
  ]);

  // Seed sales
  const fiveDaysAgo = new Date(Date.now() - 86400000 * 5).toISOString();
  const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString();
  const oneDayAgo = new Date(Date.now() - 86400000 * 1).toISOString();
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString();

  await supabase.from('sales').insert([
    {
      id: '1', invoice_number: 'INV-0001', customer_id: '2', customer_name: 'John Smith',
      subtotal: 1200, discount: 0, tax_amount: 120, shipping_cost: 0, grand_total: 1320, paid_amount: 1320, due_amount: 0,
      payment_status: 'paid', payment_method: 'card', status: 'completed', created_at: fiveDaysAgo
    },
    {
      id: '2', invoice_number: 'INV-0002', customer_id: '3', customer_name: 'Sarah Johnson',
      subtotal: 134.92, discount: 5, tax_amount: 13.04, shipping_cost: 0, grand_total: 142.96, paid_amount: 100, due_amount: 42.96,
      payment_status: 'partial', payment_method: 'cash', status: 'completed', created_at: threeDaysAgo
    },
    {
      id: '3', invoice_number: 'INV-0003', customer_id: '1', customer_name: 'Walk-in Customer',
      subtotal: 54.97, discount: 0, tax_amount: 5.50, shipping_cost: 0, grand_total: 60.47, paid_amount: 60.47, due_amount: 0,
      payment_status: 'paid', payment_method: 'cash', status: 'completed', created_at: oneDayAgo
    },
    {
      id: '4', invoice_number: 'INV-0004', customer_id: '4', customer_name: 'Mike Wilson',
      subtotal: 99.95, discount: 10, tax_amount: 9.00, shipping_cost: 5, grand_total: 103.95, paid_amount: 103.95, due_amount: 0,
      payment_status: 'paid', payment_method: 'bank_transfer', status: 'completed', created_at: oneHourAgo
    },
  ]);

  // Seed default settings
  await supabase.from('settings').upsert({
    id: 1,
    store_name: 'My Store',
    store_address: '123 Main Street',
    store_phone: '+1 234 567 890',
    store_email: 'store@example.com',
    currency: 'USD',
    currency_symbol: '$',
    tax_number: '',
    invoice_prefix: 'INV-',
    receipt_footer: 'Thank you for your purchase!',
  });
}
