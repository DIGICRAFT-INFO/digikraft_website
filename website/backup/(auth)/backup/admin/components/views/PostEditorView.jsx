'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Bold, Italic, Link2, List, Code, ImageIcon, Hash, Tag, ChevronDown, X } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../data/mockData';

const TOOLBAR_ITEMS = [
  { icon: Bold, label: 'Bold' },
  { icon: Italic, label: 'Italic' },
  { icon: Link2, label: 'Link' },
  { icon: Hash, label: 'Heading' },
  { icon: List, label: 'List' },
  { icon: Code, label: 'Code' },
  { icon: ImageIcon, label: 'Image' },
];

export default function PostEditorView({ editPost, onBack }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [saved, setSaved] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Populate form if editing existing post
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setSlug(editPost.slug);
      setCategory(editPost.category);
      setStatus(editPost.status);
      setContent(editPost.excerpt);
    }
  }, [editPost]);

  // Auto-generate slug from title
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editPost) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  // Track word count
  const handleContentChange = (val) => {
    setContent(val);
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
  };

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags(prev => [...prev, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isEditing = !!editPost;

  return (
    <div className="flex flex-col h-full">
      {/* Editor top bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-zinc-800/60 bg-zinc-950/60 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
        <div className="w-px h-4 bg-zinc-800" />
        <span className="text-sm text-zinc-400">{isEditing ? 'Editing post' : 'New post'}</span>
        {title && <span className="text-sm text-zinc-600 truncate max-w-xs">— {title}</span>}

        <div className="ml-auto flex items-center gap-2">
          <div className="text-xs text-zinc-600 hidden sm:block">{wordCount} words</div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all">
            <Eye size={14} />
            Preview
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 ${
              saved
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30'
            }`}
          >
            <Save size={14} />
            {saved ? 'Saved!' : (isEditing ? 'Update' : 'Save Draft')}
          </button>
        </div>
      </div>

      {/* Main editor workspace */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left: main content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 max-w-3xl mx-auto w-full">
          {/* Title */}
          <textarea
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Post title…"
            rows={2}
            className="w-full bg-transparent text-3xl font-bold text-white placeholder:text-zinc-700 resize-none focus:outline-none leading-tight mb-4"
          />

          {/* Slug */}
          <div className="flex items-center gap-2 mb-6 pb-5 border-b border-zinc-800/60">
            <span className="text-xs text-zinc-600 font-mono">quill.dev/blog/</span>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="post-slug"
              className="flex-1 bg-transparent text-xs font-mono text-zinc-400 placeholder:text-zinc-700 focus:outline-none hover:text-zinc-200 transition-colors border-b border-dashed border-zinc-800 focus:border-zinc-600 pb-0.5"
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-0.5 mb-4 p-1 bg-zinc-900/60 border border-zinc-800/60 rounded-xl w-fit">
            {TOOLBAR_ITEMS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                title={label}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
              >
                <Icon size={15} />
              </button>
            ))}
            <div className="w-px h-5 bg-zinc-800 mx-1" />
            <button className="px-2.5 h-8 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all font-mono">H1</button>
            <button className="px-2.5 h-8 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all font-mono">H2</button>
          </div>

          {/* Rich text area */}
          <textarea
            value={content}
            onChange={e => handleContentChange(e.target.value)}
            placeholder="Start writing your post…

Use the toolbar above to format your content. You can add headings, bold text, links, code blocks, and images.

💡 Tip: Press Tab to indent, Shift+Tab to outdent."
            className="w-full min-h-[420px] bg-transparent text-zinc-300 text-base leading-relaxed placeholder:text-zinc-700 resize-none focus:outline-none font-[system-ui]"
          />
        </div>

        {/* Right: sidebar settings */}
        <aside className="w-72 flex-shrink-0 border-l border-zinc-800/60 bg-zinc-950/40 overflow-y-auto">
          <div className="sticky top-0 p-5 space-y-5">

            {/* Status */}
            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-xl px-3 pr-8 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-all appearance-none cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
              </div>
              <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg w-fit ${
                status === 'published' ? 'text-emerald-400 bg-emerald-400/10' :
                status === 'scheduled' ? 'text-amber-400 bg-amber-400/10' :
                'text-zinc-400 bg-zinc-800/60'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status === 'published' ? 'bg-emerald-400' : status === 'scheduled' ? 'bg-amber-400' : 'bg-zinc-500'}`} />
                {status === 'draft' ? 'Saved as draft' : status === 'published' ? 'Publicly visible' : 'Will publish later'}
              </div>
            </div>

            <div className="border-t border-zinc-800/60" />

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-xl px-3 pr-8 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-all appearance-none cursor-pointer"
                >
                  {MOCK_CATEGORIES.map(c => (
                    <option key={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
              </div>
            </div>

            <div className="border-t border-zinc-800/60" />

            {/* Tags */}
            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Tags</label>
              <div className="min-h-[38px] bg-zinc-900 border border-zinc-800 rounded-xl p-2 flex flex-wrap gap-1.5 focus-within:border-zinc-600 transition-all">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-lg">
                    <Tag size={10} className="text-zinc-600" />
                    {tag}
                    <button onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="text-zinc-600 hover:text-red-400 transition-colors ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={tags.length === 0 ? 'Add tag, press Enter…' : ''}
                  className="flex-1 min-w-20 bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-zinc-600 mt-1">Press Enter or comma to add a tag</p>
            </div>

            <div className="border-t border-zinc-800/60" />

            {/* Featured image */}
            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Featured Image</label>
              {featuredImage ? (
                <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-900">
                  <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" onError={() => setFeaturedImage('')} />
                  <button
                    onClick={() => setFeaturedImage('')}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-center hover:border-zinc-600 transition-colors group cursor-pointer">
                  <ImageIcon size={20} className="text-zinc-700 group-hover:text-zinc-500 transition-colors mx-auto mb-2" />
                  <p className="text-xs text-zinc-600">Drop image or paste URL</p>
                </div>
              )}
              <input
                value={featuredImage}
                onChange={e => setFeaturedImage(e.target.value)}
                placeholder="https://image-url.com/photo.jpg"
                className="w-full h-8 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-400 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
              />
            </div>

            <div className="border-t border-zinc-800/60" />

            {/* Publish button */}
            <button
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-all duration-150 active:scale-95 shadow-lg shadow-violet-900/30"
              onClick={handleSave}
            >
              {status === 'draft' ? 'Save Draft' : status === 'published' ? 'Publish Now' : 'Schedule Post'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}