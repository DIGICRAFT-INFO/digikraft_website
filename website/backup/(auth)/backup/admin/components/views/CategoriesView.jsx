'use client';

import { useState } from 'react';
import { Search, ChevronDown, Edit3, Trash2, MoreHorizontal, Plus, Eye, MessageSquare } from 'lucide-react';
import { MOCK_POSTS, MOCK_CATEGORIES } from '../../data/mockData';

const STATUS_CONFIG = {
  published: { label: 'Published', classes: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' },
  draft: { label: 'Draft', classes: 'bg-zinc-700/60 text-zinc-400 border border-zinc-700' },
  scheduled: { label: 'Scheduled', classes: 'bg-amber-400/10 text-amber-400 border border-amber-400/20' },
};

export default function AllPostsView({ onNewPost, onEditPost }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  const filtered = MOCK_POSTS.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const allSelected = filtered.length > 0 && filtered.every(p => selected.includes(p.id));

  const toggleAll = () => {
    setAllSelected(!allSelected);
  };

  const setAllSelected = (val) => {
    if (val) setSelected(filtered.map(p => p.id));
    else setSelected([]);
  };

  const toggleRow = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">All Posts</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{MOCK_POSTS.length} posts total</p>
        </div>
        <button
          onClick={onNewPost}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-all duration-150 shadow-lg shadow-violet-900/30 active:scale-95"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="h-9 bg-zinc-900 border border-zinc-800 rounded-xl pl-3 pr-8 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-all appearance-none cursor-pointer"
          >
            <option>All</option>
            {MOCK_CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-9 bg-zinc-900 border border-zinc-800 rounded-xl pl-3 pr-8 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-all appearance-none cursor-pointer"
          >
            <option>All</option>
            <option>published</option>
            <option>draft</option>
            <option>scheduled</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-zinc-500">{selected.length} selected</span>
            <button className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
              Delete selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[auto,1fr,120px,130px,100px,90px] gap-4 px-5 py-3 border-b border-zinc-800/60 bg-zinc-900/80">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="rounded border-zinc-700 bg-zinc-800 text-violet-500 focus:ring-violet-500/30 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Title</span>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</span>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Category</span>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Stats</span>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</span>
        </div>

        {/* Table rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-zinc-600 text-sm">No posts match your filters.</div>
        ) : (
          <div className="divide-y divide-zinc-800/40">
            {filtered.map(post => {
              const isSelected = selected.includes(post.id);
              const statusStyle = STATUS_CONFIG[post.status];
              return (
                <div
                  key={post.id}
                  className={`grid grid-cols-[auto,1fr,120px,130px,100px,90px] gap-4 px-5 py-4 items-center group transition-colors duration-100 hover:bg-zinc-800/30 ${isSelected ? 'bg-violet-500/5' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRow(post.id)}
                    className="rounded border-zinc-700 bg-zinc-800 text-violet-500 focus:ring-violet-500/30 focus:ring-offset-0 cursor-pointer"
                  />

                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">{post.title}</p>
                    <p className="text-xs text-zinc-600 mt-0.5 truncate">/{post.slug} · {post.author}</p>
                  </div>

                  {/* Status badge */}
                  <div>
                    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle.classes}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${post.status === 'published' ? 'bg-emerald-400' : post.status === 'scheduled' ? 'bg-amber-400' : 'bg-zinc-500'}`} />
                      {statusStyle.label}
                    </span>
                  </div>

                  {/* Category */}
                  <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg inline-block">{post.category}</span>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-zinc-600">
                    <span className="flex items-center gap-1">
                      <Eye size={11} />{post.views > 0 ? (post.views / 1000).toFixed(1) + 'k' : '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={11} />{post.comments || '—'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 relative">
                    <button
                      onClick={() => onEditPost(post)}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700 transition-all opacity-0 group-hover:opacity-100"
                      title="Edit post"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete post"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700 transition-all"
                    >
                      <MoreHorizontal size={13} />
                    </button>

                    {openMenu === post.id && (
                      <div className="absolute right-0 top-8 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 z-10 py-1 overflow-hidden">
                        {['View Live', 'Duplicate', 'Copy Link', 'Archive'].map(action => (
                          <button
                            key={action}
                            onClick={() => setOpenMenu(null)}
                            className="w-full text-left px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                          >
                            {action}
                          </button>
                        ))}
                        <div className="border-t border-zinc-800 mt-1 pt-1">
                          <button
                            onClick={() => setOpenMenu(null)}
                            className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-400/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800/60 bg-zinc-900/80">
          <span className="text-xs text-zinc-600">Showing {filtered.length} of {MOCK_POSTS.length} posts</span>
          <div className="flex items-center gap-1">
            {['1', '2', '3'].map(p => (
              <button key={p} className={`w-7 h-7 text-xs rounded-lg transition-colors ${p === '1' ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}