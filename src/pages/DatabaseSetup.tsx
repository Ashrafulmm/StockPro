import { Database, CheckCircle, AlertTriangle, ExternalLink, Copy, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function DatabaseSetup() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [step, setStep] = useState(1);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const CodeBlock = ({ code, index }: { code: string; index: number }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
      <button onClick={() => copyToClipboard(code, index)}
        className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded bg-gray-800">
        {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{code}</pre>
    </div>
  );

  const sqlSchema = `-- StockPro POS Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql)

-- Products Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  category TEXT,
  brand TEXT,
  cost_price DECIMAL(10,2) DEFAULT 0,
  selling_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  alert_quantity INTEGER DEFAULT 5,
  unit TEXT DEFAULT 'pcs',
  tax_rate DECIMAL(5,2) DEFAULT 0,
  description TEXT,
  supplier_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- Customers Table
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  tax_number TEXT,
  opening_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers Table
CREATE TABLE suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  company TEXT,
  tax_number TEXT,
  opening_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales Table
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id TEXT,
  customer_name TEXT,
  items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  due_amount DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'due',
  payment_method TEXT,
  status TEXT DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  sale_id TEXT,
  customer_id TEXT,
  supplier_id TEXT,
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT,
  reference TEXT,
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases Table
CREATE TABLE purchases (
  id TEXT PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  supplier_id TEXT,
  supplier_name TEXT,
  items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  due_amount DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'due',
  status TEXT DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses Table
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  category TEXT,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings Table
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  store_name TEXT DEFAULT 'My Store',
  store_address TEXT DEFAULT '',
  store_phone TEXT DEFAULT '',
  store_email TEXT DEFAULT '',
  currency TEXT DEFAULT 'USD',
  currency_symbol TEXT DEFAULT '$',
  tax_number TEXT DEFAULT '',
  invoice_prefix TEXT DEFAULT 'INV-',
  receipt_footer TEXT DEFAULT 'Thank you for your purchase!'
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations (for development)
CREATE POLICY "allow_select_products" ON products FOR SELECT USING (true);
CREATE POLICY "allow_insert_products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_products" ON products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "allow_delete_products" ON products FOR DELETE USING (true);

CREATE POLICY "allow_all_categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_sales" ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_payments" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_purchases" ON purchases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_settings" ON settings FOR ALL USING (true) WITH CHECK (true);`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Database Setup</h1>
        <p className="text-gray-600">Complete your Supabase database setup in 3 simple steps</p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database size={20} className="text-indigo-600" />
          Connection Status
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={18} />
              <span className="text-sm font-medium text-green-800">Supabase URL Configured</span>
            </div>
            <code className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">eomtttakkpgvvhblwimr.supabase.co</code>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={18} />
              <span className="text-sm font-medium text-green-800">API Key Configured</span>
            </div>
            <code className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">sb_publishable_****</code>
          </div>
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-600" size={18} />
              <span className="text-sm font-medium text-amber-800">Database Tables</span>
            </div>
            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">Needs setup (Step 2 below)</span>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
          <h2 className="text-lg font-bold text-gray-900">Create Tables in Supabase</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Go to your Supabase dashboard → SQL Editor → New Query, then paste and run the following SQL:
        </p>
        <div className="mb-4">
          <a href="https://supabase.com/dashboard/project/eomtttakkpgvvhblwimr/sql" target="_blank"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            Open Supabase SQL Editor <ExternalLink size={14} />
          </a>
        </div>
        <div className="relative">
          <button onClick={() => copyToClipboard(sqlSchema, 99)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white p-2 rounded bg-gray-800 z-10">
            {copiedIndex === 99 ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{sqlSchema}</pre>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button onClick={() => setStep(2)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            I've run the SQL <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold`}>2</span>
          <h2 className="text-lg font-bold text-gray-900">Verify Connection</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          After running the SQL, refresh this app. The demo data will be automatically seeded into your Supabase database.
          You should see products, customers, suppliers, and sample sales data.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 text-sm mb-2">What happens on first load:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 10 demo products are created</li>
            <li>• 4 demo customers are created</li>
            <li>• 3 demo suppliers are created</li>
            <li>• 4 sample sales are created</li>
            <li>• Default store settings are saved</li>
          </ul>
        </div>
        <div className="mt-4">
          <button onClick={() => setStep(3)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            Data is loading <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold`}>3</span>
          <h2 className="text-lg font-bold text-gray-900">Deploy to Vercel</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Your app is ready to deploy. Since the Supabase URL and key are already hardcoded in the app,
          you just need to push to Vercel.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <p className="font-medium text-gray-800">Deployment steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            <li>Push your code to GitHub</li>
            <li>Go to <a href="https://vercel.com" target="_blank" className="text-indigo-600 underline">vercel.com</a> → New Project</li>
            <li>Import your GitHub repository</li>
            <li>Click Deploy (no env variables needed - they're in the code)</li>
          </ol>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} />
          Important Notes
        </h3>
        <ul className="text-sm text-amber-700 space-y-2">
          <li><strong>API Key:</strong> If you get authentication errors, go to Supabase Dashboard → Settings → API → copy the "anon public" key and update it in <code className="bg-amber-100 px-1 rounded">src/lib/supabase.ts</code></li>
          <li><strong>Security:</strong> The current RLS policies allow all operations. For production, set up proper authentication and restrict access.</li>
          <li><strong>Backup:</strong> Supabase free tier includes daily backups. You can also export data anytime from the dashboard.</li>
          <li><strong>Limits:</strong> Free tier has 500MB database, 2GB bandwidth, and 50,000 monthly active users.</li>
        </ul>
      </div>

      {/* Quick Reference */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-700 mb-1">Supabase Dashboard</p>
            <a href="https://supabase.com/dashboard/project/eomtttakkpgvvhblwimr" target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
              Open Dashboard <ExternalLink size={12} />
            </a>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-700 mb-1">Table Editor</p>
            <a href="https://supabase.com/dashboard/project/eomtttakkpgvvhblwimr/editor" target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
              View/Edit Tables <ExternalLink size={12} />
            </a>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-700 mb-1">SQL Editor</p>
            <a href="https://supabase.com/dashboard/project/eomtttakkpgvvhblwimr/sql" target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
              Run SQL Queries <ExternalLink size={12} />
            </a>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-700 mb-1">API Docs</p>
            <a href="https://supabase.com/dashboard/project/eomtttakkpgvvhblwimr/api" target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
              View API Reference <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
