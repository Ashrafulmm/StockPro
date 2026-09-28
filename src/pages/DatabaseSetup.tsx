import { Database, Server, Cloud, CheckCircle, ArrowRight, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function DatabaseSetup() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const CodeBlock = ({ code, index, language = 'sql' }: { code: string; index: number; language?: string }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto">
      <button
        onClick={() => copyToClipboard(code, index)}
        className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded bg-gray-800"
      >
        {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{code}</pre>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Database Setup Guide</h1>
        <p className="text-gray-600">Complete guide to set up your database for StockPro POS system</p>
      </div>

      {/* Options Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-green-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 p-2 rounded-lg"><Cloud className="text-green-600" size={20} /></div>
            <h3 className="font-bold text-gray-900">Option A: Supabase (Recommended)</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">Best for Vercel deployment. Free tier available. PostgreSQL database with auto-generated API.</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>✓ Free tier: 500MB database</li>
            <li>✓ Auto-generated REST API</li>
            <li>✓ Built-in authentication</li>
            <li>✓ Real-time subscriptions</li>
            <li>✓ Works perfectly with Vercel</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg"><Server className="text-blue-600" size={20} /></div>
            <h3 className="font-bold text-gray-900">Option B: Hetzner Self-Hosted</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">Best for full control. Install PostgreSQL on your Hetzner server.</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>✓ Full control over data</li>
            <li>✓ No usage limits</li>
            <li>✓ Custom configurations</li>
            <li>✓ Lower latency (if local)</li>
            <li>✓ One-time setup cost</li>
          </ul>
        </div>
      </div>

      {/* Option A: Supabase Setup */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-2 rounded-lg"><Cloud className="text-emerald-600" size={24} /></div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Option A: Supabase Setup (Recommended for Vercel)</h2>
            <p className="text-sm text-gray-500">Step-by-step guide for cloud database</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="border-l-4 border-emerald-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Create Supabase Account
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Go to <a href="https://supabase.com" target="_blank" className="text-emerald-600 underline inline-flex items-center gap-1">supabase.com <ExternalLink size={12} /></a> and sign up for free.
              Create a new project. Note your project URL and API key (found in Settings → API).
            </p>
          </div>

          {/* Step 2 */}
          <div className="border-l-4 border-emerald-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Create Database Tables
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              In your Supabase dashboard, go to SQL Editor and run the following SQL to create all tables:
            </p>
            <CodeBlock index={0} code={`-- Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(100),
  category VARCHAR(100),
  brand VARCHAR(100),
  cost_price DECIMAL(10,2) DEFAULT 0,
  selling_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  alert_quantity INTEGER DEFAULT 5,
  unit VARCHAR(50) DEFAULT 'pcs',
  tax_rate DECIMAL(5,2) DEFAULT 0,
  description TEXT,
  supplier_id UUID REFERENCES suppliers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Customers Table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  tax_number VARCHAR(100),
  opening_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Suppliers Table
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  company VARCHAR(255),
  tax_number VARCHAR(100),
  opening_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sales Table
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_name VARCHAR(255),
  subtotal DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  due_amount DECIMAL(10,2) DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'due',
  payment_method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sale Items Table
CREATE TABLE sale_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL
);

-- Payments Table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES sales(id),
  customer_id UUID REFERENCES customers(id),
  supplier_id UUID REFERENCES suppliers(id),
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50),
  reference VARCHAR(255),
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Purchases Table
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  supplier_name VARCHAR(255),
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  due_amount DECIMAL(10,2) DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'due',
  status VARCHAR(20) DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Purchase Items Table
CREATE TABLE purchase_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

-- Expenses Table
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);`} />
          </div>

          {/* Step 3 */}
          <div className="border-l-4 border-emerald-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
              Enable Row Level Security (RLS)
            </h3>
            <p className="text-sm text-gray-600 mt-2">For production, enable RLS policies. For now, you can allow all operations:</p>
            <CodeBlock index={1} code={`-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Allow all operations (for development)
CREATE POLICY "Allow all" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON sale_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON purchases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON purchase_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON expenses FOR ALL USING (true) WITH CHECK (true);`} />
          </div>

          {/* Step 4 */}
          <div className="border-l-4 border-emerald-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
              Connect to Your App
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Create a <code className="bg-gray-100 px-1 rounded">.env</code> file in your project root:
            </p>
            <CodeBlock index={2} code={`# .env file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`} />
            <p className="text-sm text-gray-600 mt-2">Then create <code className="bg-gray-100 px-1 rounded">src/lib/supabase.ts</code>:</p>
            <CodeBlock index={3} code={`import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Example: Get all products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

// Example: Add a sale
export async function createSale(sale: any) {
  const { data, error } = await supabase
    .from('sales')
    .insert([sale])
    .select()
  return { data, error }
}`} />
          </div>

          {/* Step 5 */}
          <div className="border-l-4 border-emerald-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
              Deploy to Vercel
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              In Vercel, add your environment variables:
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-amber-800">
                <strong>Vercel Dashboard → Settings → Environment Variables</strong><br/>
                Add: <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Option B: Hetzner Self-Hosted */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg"><Server className="text-blue-600" size={24} /></div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Option B: Hetzner Server Setup</h2>
            <p className="text-sm text-gray-500">Self-hosted PostgreSQL on your Hetzner server</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              SSH into Your Hetzner Server
            </h3>
            <CodeBlock index={4} code={`ssh root@your-server-ip`} />
          </div>

          {/* Step 2 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Install PostgreSQL
            </h3>
            <CodeBlock index={5} code={`# Update system
apt update && apt upgrade -y

# Install PostgreSQL
apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Verify installation
sudo -u postgres psql -c "SELECT version();"`} />
          </div>

          {/* Step 3 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
              Create Database & User
            </h3>
            <CodeBlock index={6} code={`# Access PostgreSQL
sudo -u postgres psql

# Inside psql:
CREATE DATABASE stockpro;
CREATE USER stockpro_user WITH ENCRYPTED PASSWORD 'your-strong-password';
GRANT ALL PRIVILEGES ON DATABASE stockpro TO stockpro_user;
\\q

# Edit PostgreSQL config to allow connections
nano /etc/postgresql/15/main/postgresql.conf
# Set: listen_addresses = '*'

nano /etc/postgresql/15/main/pg_hba.conf
# Add line: host all all 0.0.0.0/0 md5

# Restart PostgreSQL
systemctl restart postgresql`} />
          </div>

          {/* Step 4 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
              Create Tables
            </h3>
            <CodeBlock index={7} code={`# Connect to your database
psql -U stockpro_user -d stockpro -h localhost

# Then run the same SQL from Option A Step 2
# (Copy the CREATE TABLE statements above)`} />
          </div>

          {/* Step 5 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
              Install & Configure Backend API
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              You need a backend API to connect your frontend to PostgreSQL. Recommended options:
            </p>
            <div className="mt-3 space-y-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm">Option 1: PostgREST (Easiest - Auto-generates API from DB)</p>
                <CodeBlock index={8} code={`# Install PostgREST
apt install postgrest -y

# Create config file: /etc/postgrest.conf
cat > /etc/postgrest.conf << EOF
db-uri = "postgres://stockpro_user:your-password@localhost:5432/stockpro"
db-schema = "public"
db-anon-role = "anon"
server-host = "0.0.0.0"
server-port = 3000
EOF

# Create anon role in PostgreSQL
psql -U stockpro_user -d stockpro -c "CREATE ROLE anon NOLOGIN;"
psql -U stockpro_user -d stockpro -c "GRANT USAGE ON SCHEMA public TO anon;"
psql -U stockpro_user -d stockpro -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;"

# Start PostgREST
postgrest /etc/postgrest.conf`} />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-sm">Option 2: Use Supabase Self-Hosted (Docker)</p>
                <CodeBlock index={9} code={`# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone Supabase self-hosted
git clone https://github.com/supabase/supabase.git
cd supabase/docker

# Copy env file
cp .env.example .env

# Edit .env with your passwords
nano .env

# Start all services
docker compose up -d`} />
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">6</span>
              Configure Firewall
            </h3>
            <CodeBlock index={10} code={`# Allow PostgreSQL (only if needed externally)
ufw allow 5432/tcp

# Allow your API port
ufw allow 3000/tcp

# Enable firewall
ufw enable`} />
          </div>
        </div>
      </div>

      {/* Deployment Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-500" size={24} />
          Deployment Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Setup</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Frontend</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Database</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Cost</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-medium">Vercel + Supabase</td>
                <td className="px-4 py-3">Vercel (free)</td>
                <td className="px-4 py-3">Supabase (free 500MB)</td>
                <td className="px-4 py-3 text-green-600 font-medium">$0/month</td>
                <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Easy</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Hetzner + PostgREST</td>
                <td className="px-4 py-3">Hetzner server</td>
                <td className="px-4 py-3">PostgreSQL (self-hosted)</td>
                <td className="px-4 py-3 text-blue-600 font-medium">~€4/month</td>
                <td className="px-4 py-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Medium</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Hetzner + Supabase Docker</td>
                <td className="px-4 py-3">Hetzner server</td>
                <td className="px-4 py-3">Supabase (Docker)</td>
                <td className="px-4 py-3 text-blue-600 font-medium">~€7/month</td>
                <td className="px-4 py-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Medium</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Vercel + Hetzner DB</td>
                <td className="px-4 py-3">Vercel (free)</td>
                <td className="px-4 py-3">Hetzner PostgreSQL</td>
                <td className="px-4 py-3 text-blue-600 font-medium">~€4/month</td>
                <td className="px-4 py-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Medium</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* My Recommendation */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-3">💡 My Recommendation</h2>
        <p className="text-indigo-100 mb-4">
          For your use case, I recommend <strong>Option A: Vercel + Supabase</strong>. Here's why:
        </p>
        <ul className="space-y-2 text-sm text-indigo-100">
          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-300" /> Free to start - no server management needed</li>
          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-300" /> Auto-generated REST API - no backend code needed</li>
          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-300" /> Deploy frontend to Vercel in minutes</li>
          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-300" /> Easy to migrate to Hetzner later if needed</li>
          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-300" /> Built-in authentication for multi-user access</li>
          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-300" /> Automatic backups included</li>
        </ul>
        <p className="text-indigo-100 mt-4 text-sm">
          <strong>Note:</strong> The current version of this app uses localStorage for demo purposes.
          To connect to Supabase, replace the <code className="bg-indigo-700 px-1 rounded">src/lib/store.ts</code> functions
          with Supabase client calls (shown in Step 4 above).
        </p>
      </div>
    </div>
  );
}
