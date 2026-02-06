import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const BLOGS_DATA_PATH = path.join(__dirname, 'src', 'blogsData.js');
const BLOGS_DIR = path.join(__dirname, 'public', 'blogs');
const APP_DATA_PATH = path.join(__dirname, 'src', 'appData.json');

// Ensure appData.json exists
if (!fs.existsSync(APP_DATA_PATH)) {
  fs.writeFileSync(APP_DATA_PATH, JSON.stringify({ subscribers: [], likes: {} }, null, 2));
}

// Helper to update blogsData.js
const updateBlogsDataJS = (blogs) => {
  const content = `export const blogs = ${JSON.stringify(blogs, null, 2)};
`;
  fs.writeFileSync(BLOGS_DATA_PATH, content, 'utf8');
};

// API: Subscribe to Newsletter
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  try {
    const data = JSON.parse(fs.readFileSync(APP_DATA_PATH, 'utf8'));
    if (!data.subscribers.some(s => s.email === email)) {
      data.subscribers.push({ email, date: new Date().toISOString() });
      fs.writeFileSync(APP_DATA_PATH, JSON.stringify(data, null, 2));
    }
    res.json({ success: true, message: 'Welcome to the sanctuary.' });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// API: Like a Post
app.post('/api/like', (req, res) => {
  const { id } = req.body;
  try {
    const data = JSON.parse(fs.readFileSync(APP_DATA_PATH, 'utf8'));
    data.likes[id] = (data.likes[id] || 0) + 1;
    fs.writeFileSync(APP_DATA_PATH, JSON.stringify(data, null, 2));
    res.json({ success: true, count: data.likes[id] });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// API: Get App Stats (Subscribers & Likes)
app.get('/api/admin/stats', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(APP_DATA_PATH, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// API: Public Stats (Just Likes)
app.get('/api/stats', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(APP_DATA_PATH, 'utf8'));
    res.json({ likes: data.likes });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// API: Git Commit
app.post('/api/admin/git-commit', (req, res) => {
  const { message } = req.body;
  const commitMsg = message || 'Divine Reflection committed to archives';
  
  exec(`git add . && git commit -m "${commitMsg}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Git Error: ${error}`);
      return res.status(500).json({ success: false, message: 'Git commit failed.' });
    }
    res.json({ success: true, message: 'Reflection successfully merged into the firmament.' });
  });
});

// API: Save or Update Blog
app.post('/api/save-blog', (req, res) => {
  const { blog, content } = req.body;
  
  try {
    // 1. Save Markdown File
    const mdPath = path.join(BLOGS_DIR, `${blog.id}.md`);
    fs.writeFileSync(mdPath, content, 'utf8');

    // 2. Update blogsData.js
    const currentData = fs.readFileSync(BLOGS_DATA_PATH, 'utf8');
    // Simple extraction of the array since it's a JS file
    const match = currentData.match(/export const blogs = (\[[\s\S]*?\]);/);
    let blogs = match ? JSON.parse(match[1]) : [];

    const index = blogs.findIndex(b => b.id === blog.id);
    if (index !== -1) {
      blogs[index] = { ...blogs[index], ...blog };
    } else {
      blogs.unshift(blog); // New posts at the top
    }

    updateBlogsDataJS(blogs);
    
    res.json({ success: true, message: 'Reflection committed to the archives.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to commit reflection.' });
  }
});

// API: Get Markdown Content for Editing
app.get('/api/get-markdown/:id', (req, res) => {
  try {
    const mdPath = path.join(BLOGS_DIR, `${req.params.id}.md`);
    if (fs.existsSync(mdPath)) {
      const content = fs.readFileSync(mdPath, 'utf8');
      res.send(content);
    } else {
      res.status(404).send('Not found');
    }
  } catch (error) {
    res.status(500).send('Error reading file');
  }
});

// API: Delete Blog
app.delete('/api/delete-blog/:id', (req, res) => {
  const { id } = req.params;
  try {
    // 1. Remove Markdown File
    const mdPath = path.join(BLOGS_DIR, `${id}.md`);
    if (fs.existsSync(mdPath)) {
      fs.unlinkSync(mdPath);
    }

    // 2. Update blogsData.js
    const currentData = fs.readFileSync(BLOGS_DATA_PATH, 'utf8');
    const match = currentData.match(/export const blogs = (\[[\s\S]*?\]);/);
    let blogs = match ? JSON.parse(match[1]) : [];

    const filteredBlogs = blogs.filter(b => b.id !== id);
    updateBlogsDataJS(filteredBlogs);

    res.json({ success: true, message: 'Reflection purged from the archives.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to purge reflection.' });
  }
});

app.listen(PORT, () => {
  console.log(`Admin API active at http://localhost:${PORT}`);
});