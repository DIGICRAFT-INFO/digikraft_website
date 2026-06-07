
export const MOCK_POSTS = [
  { id: '1', title: 'Building Scalable APIs with Next.js 15', slug: 'scalable-apis-nextjs-15', status: 'published', category: 'Engineering', author: 'Alex Chen', views: 12400, comments: 34, createdAt: '2025-05-20', excerpt: 'A deep dive into architecting robust API layers using Next.js App Router and Route Handlers.' },
  { id: '2', title: 'The Future of CSS: Container Queries Explained', slug: 'css-container-queries', status: 'published', category: 'Design', author: 'Mia Torres', views: 8900, comments: 21, createdAt: '2025-05-15', excerpt: 'Container queries are redefining responsive design. Here\'s how to use them today.' },
  { id: '3', title: 'TypeScript 5.5 New Features Deep Dive', slug: 'typescript-5-5-features', status: 'draft', category: 'Engineering', author: 'Alex Chen', views: 0, comments: 0, createdAt: '2025-05-22', excerpt: 'Exploring the latest improvements in TypeScript with real-world examples.' },
  { id: '4', title: 'Designing with Intent: A UX Philosophy', slug: 'designing-with-intent', status: 'scheduled', category: 'Design', author: 'Mia Torres', views: 0, comments: 0, createdAt: '2025-05-23', excerpt: 'Intentional design goes beyond aesthetics — it\'s about creating meaningful experiences.' },
  { id: '5', title: 'PostgreSQL Performance Tuning Guide', slug: 'postgresql-performance', status: 'published', category: 'Database', author: 'Sam Okafor', views: 6700, comments: 15, createdAt: '2025-05-10', excerpt: 'Optimize your PostgreSQL queries and indexes for production-grade performance.' },
  { id: '6', title: 'React Server Components in Practice', slug: 'rsc-in-practice', status: 'published', category: 'Engineering', author: 'Alex Chen', views: 19200, comments: 67, createdAt: '2025-05-01', excerpt: 'A practical guide to adopting RSC in your existing Next.js applications.' },
  { id: '7', title: 'Motion Design Principles for Developers', slug: 'motion-design-principles', status: 'draft', category: 'Design', author: 'Mia Torres', views: 0, comments: 0, createdAt: '2025-05-24', excerpt: 'How to bring interfaces to life with purposeful animation and transitions.' },
  { id: '8', title: 'Redis Caching Strategies for Web Apps', slug: 'redis-caching-strategies', status: 'scheduled', category: 'Database', author: 'Sam Okafor', views: 0, comments: 0, createdAt: '2025-05-25', excerpt: 'Cache invalidation made clear: patterns and strategies for production Redis usage.' },
];

export const MOCK_CATEGORIES = [
  { id: '1', name: 'Engineering', count: 18, color: 'blue' },
  { id: '2', name: 'Design', count: 12, color: 'purple' },
  { id: '3', name: 'Database', count: 7, color: 'green' },
  { id: '4', name: 'Product', count: 5, color: 'amber' },
  { id: '5', name: 'Career', count: 4, color: 'red' },
];

export const MOCK_COMMENTS = [
  { id: '1', author: 'Jordan Lee', postTitle: 'Building Scalable APIs with Next.js 15', content: 'This is exactly what I needed. The section on middleware is gold!', createdAt: '2025-05-21', status: 'approved' },
  { id: '2', author: 'Priya Nair', postTitle: 'React Server Components in Practice', content: 'Great explanation. Could you cover Suspense boundaries in a follow-up?', createdAt: '2025-05-20', status: 'pending' },
  { id: '3', author: 'Marcus Webb', postTitle: 'PostgreSQL Performance Tuning Guide', content: 'The index tips saved us hours. Bookmarked for the team.', createdAt: '2025-05-18', status: 'approved' },
  { id: '4', author: 'spam-bot-99', postTitle: 'Building Scalable APIs with Next.js 15', content: 'Buy cheap meds online!!', createdAt: '2025-05-17', status: 'spam' },
  { id: '5', author: 'Lena Vogel', postTitle: 'The Future of CSS: Container Queries', content: 'Finally someone wrote about this properly. Sharing with my team.', createdAt: '2025-05-16', status: 'approved' },
];

export const ACTIVITY = [
  { id: 1, type: 'post', action: 'New post published', detail: 'React Server Components in Practice', time: '2 hours ago', icon: '📝' },
  { id: 2, type: 'comment', action: 'New comment received', detail: 'on "Building Scalable APIs"', time: '4 hours ago', icon: '💬' },
  { id: 3, type: 'subscriber', action: '23 new subscribers', detail: 'from organic search', time: '6 hours ago', icon: '✨' },
  { id: 4, type: 'post', action: 'Post scheduled', detail: 'Designing with Intent: A UX Philosophy', time: '1 day ago', icon: '🗓️' },
  { id: 5, type: 'milestone', action: 'Milestone reached', detail: '50,000 total post views', time: '2 days ago', icon: '🏆' },
];