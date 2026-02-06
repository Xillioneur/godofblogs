import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

const AdminDashboard = ({ blogs, onBack }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [appStats, setAppStats] = useState({ subscribers: [], likes: {} });
  const [view, setView] = useState('archives'); // 'archives' or 'subscribers'

  // Form Fields
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    author: 'Willie Liwa Johnson',
    category: 'GOD',
    summary: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
    previewImageUrl: '/assets/covers/faith-math.svg',
    socialImage: '/assets/covers/main-cover.png'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        fetchStats();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      setStatus("Login failed. Check your Firebase console.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onBack();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const subSnapshot = await getDocs(collection(db, "subscribers"));
      const subscribers = subSnapshot.docs.map(doc => doc.data());
      
      const likeSnapshot = await getDocs(collection(db, "likes"));
      const likes = {};
      likeSnapshot.forEach(doc => {
        likes[doc.id] = doc.data().count;
      });

      setAppStats({ subscribers, likes });
    } catch (e) {
      console.error("Failed to fetch stats from Firestore");
    }
  };

  const startNew = () => {
    setView('archives');
    setEditingBlog(null);
    setFormData({
      id: '',
      title: '',
      author: 'Willie Liwa Johnson',
      category: 'GOD',
      summary: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
      previewImageUrl: '/assets/covers/faith-math.svg',
      socialImage: '/assets/covers/main-cover.png'
    });
    setContent(`# New Reflection

Begin your journey here...`);
  };

  const editPost = async (blog) => {
    setView('archives');
    setEditingBlog(blog);
    setFormData({
      ...blog,
      author: blog.author || 'Willie Liwa Johnson'
    });
    try {
      const res = await fetch(`http://localhost:3001/api/get-markdown/${blog.id}`);
      const text = await res.text();
      setContent(text);
    } catch (e) {
      console.error("Failed to load markdown");
    }
  };

  const handleCommit = async () => {
    setStatus('Committing to the firmament...');
    try {
      const res = await fetch('http://localhost:3001/api/save-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blog: formData,
          content: content
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Archived successfully.');
        fetchStats();
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('Error: ' + data.message);
      }
    } catch (e) {
      setStatus('Connection to Admin API failed.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you certain you wish to purge "${editingBlog.title}" from the archives?`)) return;
    setStatus('Purging...');
    try {
      const res = await fetch(`http://localhost:3001/api/delete-blog/${editingBlog.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatus('Purged.');
        window.location.reload();
      }
    } catch (e) { setStatus('Failed to purge.'); }
  };

  const handleGitCommit = async () => {
    const msg = window.prompt("Enter a message for the archive history:", "Reflection committed: " + (editingBlog?.title || "New Entry"));
    if (!msg) return;

    setStatus('Merging with the firmament...');
    try {
      const res = await fetch('http://localhost:3001/api/admin/git-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Successfully merged into the archives.');
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('Error: ' + data.message);
      }
    } catch (e) {
      setStatus('Git operation failed.');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard animate-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p className="loading-text">Verifying Authority...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-dashboard animate-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
        <div className="admin-header">
          <button className="article-back" onClick={onBack}>← RETURN TO SANCTUARY</button>
          <h1>ADMIN PORTAL</h1>
        </div>
        <p className="hero-description" style={{ marginBottom: '40px' }}>This area is restricted to the guardian of the archives.</p>
        <button className="cta-primary" onClick={handleLogin}>LOG IN WITH GOOGLE</button>
        {status && <p className="status-msg" style={{ marginTop: '20px' }}>{status}</p>}
      </div>
    );
  }

  return (
    <div className="admin-dashboard animate-in">
      <div className="admin-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="article-back" onClick={onBack}>← RETURN TO SANCTUARY</button>
          <button className="clear-search" onClick={handleLogout} style={{ fontSize: '0.6rem' }}>LOGOUT</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
          <div>
            <h1>ADMIN PORTAL</h1>
            <button className="cta-secondary" style={{ marginTop: '10px', fontSize: '0.6rem', padding: '10px 20px' }} onClick={handleGitCommit}>
              COMMIT TO FIRMAMENT (GIT)
            </button>
          </div>
          <div className="admin-nav-tabs">
            <button className={`admin-tab ${view === 'archives' ? 'active' : ''}`} onClick={() => setView('archives')}>ARCHIVES</button>
            <button className={`admin-tab ${view === 'subscribers' ? 'active' : ''}`} onClick={() => setView('subscribers')}>SUBSCRIBERS</button>
          </div>
        </div>
      </div>

      <div className="admin-layout">
        {/* Sidebar */}
        <div className="admin-sidebar-list">
          <button className="cta-primary" style={{ width: '100%', marginBottom: '30px' }} onClick={startNew}>
            NEW REFLECTION
          </button>
          
          <div className="admin-stats-box">
            <h3>SANCTUARY STATS</h3>
            <div className="stat-item">
              <span className="stat-count">{appStats.subscribers.length}</span>
              <span className="stat-label">SOULS JOINED</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{Object.values(appStats.likes).reduce((a, b) => a + b, 0)}</span>
              <span className="stat-label">TOTAL APPRECIATION</span>
            </div>
          </div>

          <h3>EXISTING REFLECTIONS</h3>
          <div className="admin-posts-grid">
            {blogs.map(blog => (
              <div key={blog.id} className={`admin-post-item ${editingBlog?.id === blog.id ? 'active' : ''}`} onClick={() => editPost(blog)}>
                <span>{blog.category}</span>
                <h4>{blog.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Main Area */}
        <div className="admin-editor-area">
          {view === 'subscribers' ? (
            <div className="subscribers-view animate-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                  <h2>Mailing List</h2>
                  <p style={{ opacity: 0.6 }}>The following souls have requested to receive the Divine Letter.</p>
                </div>
                <button className="cta-secondary" onClick={() => {
                  const csv = [
                    ['Email', 'Date Joined'],
                    ...appStats.subscribers.map(s => [s.email, s.date])
                  ].map(e => e.join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sanctuary-subscribers.csv';
                  a.click();
                }}>
                  EXPORT CSV
                </button>
              </div>
              <div className="subscribers-table">
                <div className="table-header">
                  <span>EMAIL ADDRESS</span>
                  <span>DATE JOINED</span>
                </div>
                {appStats.subscribers.map((sub, i) => (
                  <div key={i} className="table-row">
                    <span className="sub-email">{sub.email}</span>
                    <span className="sub-date">{new Date(sub.date).toLocaleDateString()}</span>
                  </div>
                ))}
                {appStats.subscribers.length === 0 && <p style={{ padding: '40px', textAlign: 'center', opacity: 0.3 }}>No subscribers yet.</p>}
              </div>
            </div>
          ) : (
            <>
              <div className="admin-form-grid">
                <div className="form-group">
                  <label>Unique ID (no spaces)</label>
                  <input type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} disabled={editingBlog} />
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="GOD">GOD</option>
                    <option value="LOVE">LOVE</option>
                    <option value="LIFE">LIFE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date String</label>
                  <input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Summary</label>
                  <textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} rows="2" />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Preview Image URL (SVG/PNG)</label>
                  <input type="text" value={formData.previewImageUrl} onChange={e => setFormData({...formData, previewImageUrl: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Social Share Image URL (PNG required for X/Reddit)</label>
                  <input type="text" value={formData.socialImage} onChange={e => setFormData({...formData, socialImage: e.target.value})} />
                </div>
              </div>

              <div className="markdown-editor-container">
                <label>Markdown Content</label>
                <textarea 
                  className="markdown-textarea" 
                  value={content} 
                  onChange={e => setContent(e.target.value)} 
                  placeholder="# Write your reflection..."
                />
              </div>

              <div className="admin-actions">
                <div className="status-msg">{status}</div>
                <div className="admin-action-buttons">
                  {editingBlog && (
                    <button className="cta-delete" onClick={handleDelete}>
                      PURGE REFLECTION
                    </button>
                  )}
                  <button className="cta-primary commit-btn" onClick={handleCommit}>
                    COMMIT CHANGES TO ARCHIVE
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
