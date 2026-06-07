'use client';

import { useState } from 'react';
import { Globe, Bell, Shield, Palette, Database, Save } from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data & Export', icon: Database },
];

function Toggle({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${on ? 'bg-violet-600' : 'bg-zinc-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-5' : ''}`} />
    </button>
  );
}

function Field({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-zinc-800/40 last:border-0">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Manage your blog configuration</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar tabs */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                  activeTab === id
                    ? 'bg-zinc-800 text-zinc-200 font-medium'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <Icon size={15} className={activeTab === id ? 'text-violet-400' : ''} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content panel */}
        <div className="flex-1 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-300 mb-4">Blog Settings</h2>
              <div>
                <Field label="Blog Name" sub="Displayed in the browser tab and header">
                  <input defaultValue="Quill Blog" className="w-52 h-8 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-all text-right" />
                </Field>
                <Field label="Blog URL" sub="Your public-facing blog address">
                  <input defaultValue="quill.dev/blog" className="w-52 h-8 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-all text-right" />
                </Field>
                <Field label="Posts per page" sub="Number of posts shown in listing">
                  <input defaultValue="10" type="number" className="w-20 h-8 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-all text-right" />
                </Field>
                <Field label="Allow comments" sub="Enable reader comments on posts">
                  <Toggle defaultChecked={true} />
                </Field>
                <Field label="Require approval" sub="Manually approve all new comments">
                  <Toggle defaultChecked={true} />
                </Field>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-300 mb-4">Notification Preferences</h2>
              <div>
                <Field label="New comment" sub="Notify when a new comment is posted">
                  <Toggle defaultChecked={true} />
                </Field>
                <Field label="New subscriber" sub="Notify when someone subscribes">
                  <Toggle defaultChecked={true} />
                </Field>
                <Field label="Weekly digest" sub="Receive a weekly analytics summary">
                  <Toggle />
                </Field>
                <Field label="Spam alerts" sub="Get notified about spam comments">
                  <Toggle defaultChecked={true} />
                </Field>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-300 mb-4">Security</h2>
              <div>
                <Field label="Two-factor auth" sub="Add an extra layer of sign-in security">
                  <Toggle />
                </Field>
                <Field label="Session timeout" sub="Auto-logout after inactivity">
                  <select className="h-8 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-sm text-zinc-300 focus:outline-none appearance-none">
                    <option>1 hour</option>
                    <option>4 hours</option>
                    <option>24 hours</option>
                    <option>Never</option>
                  </select>
                </Field>
                <Field label="Current password" sub="Required to change your password">
                  <input type="password" placeholder="••••••••" className="w-44 h-8 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-all" />
                </Field>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-300 mb-4">Appearance</h2>
              <div>
                <Field label="Blog theme" sub="Choose your public-facing theme">
                  <select className="h-8 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-sm text-zinc-300 focus:outline-none appearance-none">
                    <option>Minimal Dark</option>
                    <option>Clean Light</option>
                    <option>Editorial</option>
                  </select>
                </Field>
                <Field label="Code highlight" sub="Syntax highlighting style">
                  <select className="h-8 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-sm text-zinc-300 focus:outline-none appearance-none">
                    <option>Dracula</option>
                    <option>One Dark</option>
                    <option>Github</option>
                  </select>
                </Field>
                <Field label="Show reading time" sub="Display estimated read time on posts">
                  <Toggle defaultChecked={true} />
                </Field>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-300 mb-4">Data & Export</h2>
              <p className="text-xs text-zinc-600 mb-4">Export your content at any time.</p>
              <div className="space-y-3">
                {[
                  { label: 'Export all posts', desc: 'JSON or Markdown format', format: '.json' },
                  { label: 'Export comments', desc: 'CSV format', format: '.csv' },
                  { label: 'Export subscribers', desc: 'CSV format', format: '.csv' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800/60">
                    <div>
                      <p className="text-sm text-zinc-300 font-medium">{item.label}</p>
                      <p className="text-xs text-zinc-600">{item.desc}</p>
                    </div>
                    <button className="text-xs text-violet-400 hover:text-violet-300 font-medium border border-violet-500/30 hover:border-violet-500/60 px-3 py-1.5 rounded-lg transition-all">
                      Export {item.format}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save button */}
          {activeTab !== 'data' && (
            <div className="mt-6 pt-5 border-t border-zinc-800/60">
              <button className="flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-all active:scale-95 shadow-lg shadow-violet-900/20">
                <Save size={14} />
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}