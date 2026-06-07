'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, MessageSquare, Search } from 'lucide-react';
import { MOCK_COMMENTS } from '../../data/mockData';

const STATUS_CONFIG = {
  approved: { label: 'Approved', icon: CheckCircle, classes: 'text-emerald-400 bg-emerald-400/10' },
  pending: { label: 'Pending', icon: AlertTriangle, classes: 'text-amber-400 bg-amber-400/10' },
  spam: { label: 'Spam', icon: XCircle, classes: 'text-red-400 bg-red-400/10' },
};

export default function CommentsView() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_COMMENTS.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter;
    const matchSearch = c.author.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: MOCK_COMMENTS.length,
    approved: MOCK_COMMENTS.filter(c => c.status === 'approved').length,
    pending: MOCK_COMMENTS.filter(c => c.status === 'pending').length,
    spam: MOCK_COMMENTS.filter(c => c.status === 'spam').length,
  };

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-white">Comments</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Manage reader engagement</p>
      </div>

      {/* Tabs + search */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800/60 rounded-xl p-1">
          {['all', 'approved', 'pending', 'spam'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-all ${
                filter === s
                  ? 'bg-zinc-700 text-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s} <span className={`ml-1 ${filter === s ? 'text-zinc-400' : 'text-zinc-700'}`}>({counts[s]})</span>
            </button>
          ))}
        </div>

        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search comments…"
            className="h-9 w-56 bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
          />
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No comments found</p>
          </div>
        ) : (
          filtered.map(comment => {
            const sc = STATUS_CONFIG[comment.status];
            const Icon = sc.icon;
            return (
              <div key={comment.id} className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 hover:bg-zinc-900/70 transition-colors group">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center text-xs font-bold text-zinc-300 flex-shrink-0">
                    {comment.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-sm font-medium text-zinc-200">{comment.author}</span>
                      <span className="text-xs text-zinc-600">on</span>
                      <span className="text-xs text-zinc-400 underline underline-offset-2 decoration-zinc-700 hover:decoration-zinc-500 cursor-pointer truncate max-w-[200px]">{comment.postTitle}</span>
                      <span className="text-xs text-zinc-700 ml-auto">{comment.createdAt}</span>
                    </div>

                    <p className={`text-sm leading-relaxed ${comment.status === 'spam' ? 'text-zinc-600 line-through' : 'text-zinc-400'}`}>
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.classes}`}>
                        <Icon size={11} />
                        {sc.label}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        {comment.status !== 'approved' && (
                          <button className="text-xs text-emerald-400 hover:bg-emerald-400/10 px-2.5 py-1 rounded-lg transition-colors">Approve</button>
                        )}
                        {comment.status !== 'spam' && (
                          <button className="text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 px-2.5 py-1 rounded-lg transition-colors">Mark spam</button>
                        )}
                        <button className="text-xs text-red-400 hover:bg-red-400/10 px-2.5 py-1 rounded-lg transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}