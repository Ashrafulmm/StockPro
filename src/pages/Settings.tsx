import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../lib/store';
import { StoreSettings } from '../types';
import { Save, Store } from 'lucide-react';

export default function Settings() {
  const [settings, setSettingsState] = useState<StoreSettings>({
    storeName: 'My Store', storeAddress: '123 Main Street', storePhone: '+1 234 567 890',
    storeEmail: 'store@example.com', currency: 'USD', currencySymbol: '$',
    taxNumber: '', invoicePrefix: 'INV-', receiptFooter: 'Thank you for your purchase!',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getSettings();
      setSettingsState(data);
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500">Configure your store settings</p></div>
      </div>
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="bg-indigo-100 p-2 rounded-lg"><Store className="text-indigo-600" size={20} /></div>
            <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label><input type="text" value={settings.storeName} onChange={(e) => setSettingsState({ ...settings, storeName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label><textarea value={settings.storeAddress} onChange={(e) => setSettingsState({ ...settings, storeAddress: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" rows={2} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="text" value={settings.storePhone} onChange={(e) => setSettingsState({ ...settings, storePhone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={settings.storeEmail} onChange={(e) => setSettingsState({ ...settings, storeEmail: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tax Number</label><input type="text" value={settings.taxNumber} onChange={(e) => setSettingsState({ ...settings, taxNumber: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" /></div>
          </div>
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice & Currency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select value={settings.currency} onChange={(e) => setSettingsState({ ...settings, currency: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"><option value="USD">USD - US Dollar</option><option value="EUR">EUR - Euro</option><option value="GBP">GBP - British Pound</option><option value="INR">INR - Indian Rupee</option><option value="PKR">PKR - Pakistani Rupee</option><option value="BDT">BDT - Bangladeshi Taka</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label><input type="text" value={settings.currencySymbol} onChange={(e) => setSettingsState({ ...settings, currencySymbol: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Invoice Prefix</label><input type="text" value={settings.invoicePrefix} onChange={(e) => setSettingsState({ ...settings, invoicePrefix: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Receipt Footer Text</label><input type="text" value={settings.receiptFooter} onChange={(e) => setSettingsState({ ...settings, receiptFooter: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            {saved && <span className="text-green-600 text-sm font-medium">✓ Settings saved!</span>}
            <button type="submit" className="ml-auto bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"><Save size={18} /> Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  );
}
