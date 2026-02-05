import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ blogs, onBack }) => {
  const [editingBlog, setEditingBlog] = useState(null);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'GOD',
    summary: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
    previewImageUrl: 'https://images.unsplash.com/photo-1438109491414-7198515b166b?q=80&w=1200&auto=format&fit=crop'
  });

  const startNew = () => {
    setEditingBlog(null);
    setFormData({
      id: '',
      title: '',
      category: 'GOD',
      summary: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
      previewImageUrl: 'https://images.unsplash.com/photo-1438109491414-7198515b166b?q=80&w=1200&auto=format&fit=crop'
    });
    setContent(`# New Reflection

Begin your journey here...`);
  };

  const editPost = async (blog) => {
    setEditingBlog(blog);
    setFormData(blog);
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
        setStatus('Archived successfully. Please restart dev server if changes do not appear.');
        setTimeout(() => {
          window.location.reload(); // Reload to pick up new blogsData.js
        }, 1500);
      } else {
        setStatus('Error: ' + data.message);
      }
    } catch (e) {
      setStatus('Connection to Admin API failed. Ensure "node admin-api.js" is running.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you certain you wish to purge "${editingBlog.title}" from the archives? This action is irreversible.`)) {
      return;
    }

    setStatus('Purging from the archives...');
    try {
      const res = await fetch(`http://localhost:3001/api/delete-blog/${editingBlog.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Purged successfully.');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setStatus('Error: ' + data.message);
      }
    } catch (e) {
      setStatus('Connection to Admin API failed.');
    }
  };

  return (
    <div className="admin-dashboard animate-in">
      <div className="admin-header">
        <button className="article-back" onClick={onBack}>← RETURN TO SANCTUARY</button>
        <h1>ADMIN PORTAL</h1>
      </div>

      <div className="admin-layout">
        {/* Sidebar: List */}
        <div className="admin-sidebar-list">
          <button className="cta-primary" style={{ width: '100%', marginBottom: '30px' }} onClick={startNew}>
            NEW REFLECTION
          </button>
          <h3>EXISTING ARCHIVES</h3>
          <div className="admin-posts-grid">
            {blogs.map(blog => (
              <div key={blog.id} className={`admin-post-item ${editingBlog?.id === blog.id ? 'active' : ''}`} onClick={() => editPost(blog)}>
                <span>{blog.category}</span>
                <h4>{blog.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Main: Editor */}
        <div className="admin-editor-area">
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
              <label>Preview Image URL</label>
              <input type="text" value={formData.previewImageUrl} onChange={e => setFormData({...formData, previewImageUrl: e.target.value})} />
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
