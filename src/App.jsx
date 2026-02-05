import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './App.css'
import { blogs as blogsData } from './blogsData'

// --- HELPER COMPONENTS (Moved outside to prevent re-mounting/focus loss) ---

const Header = ({ isDarkMode, setIsDarkMode, backToList }) => (
  <header className="professional-header">
    <div className="header-inner">
      <div className="brand" onClick={backToList} role="button">
        <span className="brand-logo">†</span>
        <span className="brand-name">GOD OF BLOGS</span>
      </div>
      <nav className="header-nav">
        <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
        </button>
      </nav>
    </div>
  </header>
);

const WordStack = () => {
  const scriptures = [
    { text: "†", style: "style-cross", cite: "" },
    { text: "GOD IS LOVE", style: "style-serif-bold", cite: "1 JOHN 4:8" },
    { text: "BE STILL AND KNOW", style: "style-serif-italic", cite: "PSALM 46:10" },
    { text: "I AM THE WAY", style: "style-sans", cite: "JOHN 14:6" },
    { text: "GRACE BE WITH YOU", style: "style-serif", cite: "1 TIMOTHY 6:21" },
    { text: "THE LIGHT SHINES IN DARKNESS", style: "style-sans-light", cite: "JOHN 1:5" },
    { text: "FAITH HOPE LOVE", style: "style-serif-bold", cite: "1 COR 13:13" },
    { text: "IN THE BEGINNING WAS THE WORD", style: "style-mono", cite: "JOHN 1:1" }
  ];

  const [flipCount, setFlipCount] = useState(0);
  const [frontIndex, setFrontIndex] = useState(0);
  const [backIndex, setBackIndex] = useState(1);

  const handleFlip = () => {
    const nextCount = flipCount + 1;
    const nextWordIndex = (nextCount + 1) % scriptures.length;
    
    setFlipCount(nextCount);
    setTimeout(() => {
      if (nextCount % 2 === 1) setFrontIndex(nextWordIndex);
      else setBackIndex(nextWordIndex);
    }, 300);
  };

  return (
    <div className="visual-inner" onClick={handleFlip}>
      <div className="word-card-stack" style={{ transform: `rotateX(${flipCount * 180}deg)` }}>
        <div className="word-card front">
          <div className="scripture-container">
            <span className={`dynamic-word ${scriptures[frontIndex].style}`}>
              {scriptures[frontIndex].text}
            </span>
            {scriptures[frontIndex].cite && <cite className="scripture-cite">{scriptures[frontIndex].cite}</cite>}
          </div>
        </div>
        <div className="word-card back">
          <div className="scripture-container">
            <span className={`dynamic-word ${scriptures[backIndex].style}`}>
              {scriptures[backIndex].text}
            </span>
            {scriptures[backIndex].cite && <cite className="scripture-cite">{scriptures[backIndex].cite}</cite>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = ({ setActiveCategory }) => (
  <section className="professional-hero">
    <div className="hero-content">
      <span className="hero-tag">EST. 2026</span>
      <h1>Illuminating the Journey of the Soul</h1>
      <p className="hero-description">
        A professional journal dedicated to the exploration of Divine Love, 
        the complexities of Life, and the Sovereignty of God.
      </p>
      <div className="hero-cta-group">
        <button className="cta-primary" onClick={() => {
          const feed = document.querySelector('.blog-feed');
          feed?.scrollIntoView({ behavior: 'smooth' });
        }}>
          BEGIN THE PILGRIMAGE
        </button>
        <button className="cta-secondary" onClick={() => setActiveCategory('GOD')}>
          EXPLORE THE DIVINE
        </button>
      </div>
    </div>
    <div className="hero-visual">
      <WordStack />
    </div>
  </section>
);

const CategoryTabs = ({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }) => {
  const categories = ['ALL', 'LOVE', 'LIFE', 'GOD'];
  return (
    <div className="category-tabs-container">
      <div className="category-tabs">
        {categories.map(c => (
          <button 
            key={c} 
            className={`tab-item ${activeCategory === c ? 'active' : ''}`}
            onClick={() => { setActiveCategory(c); setSearchQuery(''); }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Search reflections..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

const BlogFeed = ({ filteredBlogs, activeCategory, searchQuery, viewArticle }) => (
  <div className="blog-feed">
    <div className="feed-grid">
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map((blog, index) => {
          const isFeatured = index === 0 && activeCategory === 'ALL' && !searchQuery;
          return (
            <article 
              key={blog.id} 
              className={`feed-card ${isFeatured ? 'featured' : ''}`} 
              onClick={() => viewArticle(blog)}
            >
              <div className="card-image">
                <img src={blog.previewImageUrl} alt={blog.title} loading="lazy" />
                {!isFeatured && <div className="card-category">{blog.category}</div>}
              </div>
              <div className="card-body">
                <div className="card-meta">
                  <time className="card-date">{blog.date}</time>
                  <span className="card-reading-time">4 MIN READ</span>
                </div>
                {isFeatured && <span className="card-category">{blog.category}</span>}
                <h2 className="card-title">{blog.title}</h2>
                <p className="card-excerpt">{blog.summary}</p>
                <span className="read-more">CONTINUE READING →</span>
              </div>
            </article>
          );
        })
      ) : (
        <div style={{ gridColumn: 'span 12', textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
          No reflections found in this category.
        </div>
      )}
    </div>
  </div>
);

const ArticleView = ({ selectedBlog, blogContent, isLoading, currentReadingTime, backToList, shareArticle, isDarkMode }) => (
  <article className="article-view animate-in">
    <div className="article-header">
      <button className="article-back" onClick={backToList}>← BACK TO JOURNAL</button>
      <div className="article-meta">
        <span className="article-category">{selectedBlog?.category}</span>
        <time>{selectedBlog?.date}</time>
        <span className="reading-time">{currentReadingTime} MIN READ</span>
      </div>
      <h1 className="article-title">{selectedBlog?.title}</h1>
      <div className="article-actions">
        <button className="article-share" onClick={() => shareArticle(selectedBlog)}>SHARE REFLECTION</button>
      </div>
    </div>
    
    <div className="article-hero-image">
      <img src={selectedBlog?.previewImageUrl} alt={selectedBlog?.title} />
    </div>

    <div className="article-container">
      <div className="article-sidebar">
        <button className="sidebar-btn" onClick={() => shareArticle(selectedBlog)} title="Share">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
        <button className="sidebar-btn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} title="Back to top">
          ↑
        </button>
      </div>
      <div className="article-content">
        {isLoading ? (
          <div className="shimmer-container">
            <div className="shimmer-line"></div>
            <div className="shimmer-line"></div>
            <div className="shimmer-line"></div>
          </div>
        ) : (
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter style={isDarkMode ? vscDarkPlus : prism} language={match[1]} PreTag="div" {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>{children}</code>
                )
              }
            }}
          >
            {blogContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  </article>
);

const MissionSection = () => (
  <section className="professional-mission">
    <div className="mission-inner">
      <div className="mission-header">
        <h2>OUR CORE TENETS</h2>
        <p>Founded on the principles of truth, grace, and eternal perspective.</p>
      </div>
      <div className="mission-grid">
        <div className="mission-card">
          <h3>TRUTH</h3>
          <p>We pursue the absolute truths revealed through the Word of God, standing firm against the shifting sands of modern skepticism.</p>
        </div>
        <div className="mission-card">
          <h3>GRACE</h3>
          <p>Our reflections are seasoned with the grace we have first received, aiming to heal, restore, and inspire the weary soul.</p>
        </div>
        <div className="mission-card">
          <h3>ETERNITY</h3>
          <p>We look beyond the finite horizon, viewing every aspect of life through the lens of our eternal destination.</p>
        </div>
      </div>
    </div>
  </section>
);

const Newsletter = () => (
  <section className="newsletter-section">
    <div className="newsletter-inner">
      <h2>The Divine Letter</h2>
      <p>Join our sanctuary of readers and receive weekly reflections on truth, grace, and eternity directly in your inbox.</p>
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="email@address.com" required />
        <button type="submit">SUBSCRIBE</button>
      </form>
    </div>
  </section>
);

// --- MAIN APP COMPONENT ---

function App() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogContent, setBlogContent] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentReadingTime, setCurrentReadingTime] = useState(0);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? false : true;
  });

  // Theme Management
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial Data Load
  useEffect(() => {
    if (blogsData) {
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    }
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = blogs || [];
    if (activeCategory !== 'ALL') {
      result = result.filter(b => b.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q)
      );
    }
    setFilteredBlogs(result);
  }, [activeCategory, searchQuery, blogs]);

  // Routing & SEO
  useEffect(() => {
    const siteUrl = "https://godofblogs.com";
    const defaultTitle = "God of Blogs | Divine Reflections";
    const defaultDesc = "A professional sanctuary for the soul, exploring Love, Life, and the Divine.";

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const blogId = params.get('post');
      if (blogId && blogs.length > 0) {
        const blog = blogs.find(b => b.id === blogId);
        if (blog) fetchAndSetBlog(blog);
        else setSelectedBlog(null);
      } else {
        setSelectedBlog(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Check URL on load
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get('post');
    if (blogId && blogs.length > 0) {
      const blog = blogs.find(b => b.id === blogId);
      if (blog) fetchAndSetBlog(blog);
    }

    // SEO Update
    if (selectedBlog) {
      const currentUrl = `${siteUrl}/?post=${selectedBlog.id}`;
      document.title = `${selectedBlog.title} | God of Blogs`;
      updateMetaTag('description', selectedBlog.summary);
      updateMetaTag('og:title', selectedBlog.title);
      updateMetaTag('og:description', selectedBlog.summary);
      updateMetaTag('og:image', selectedBlog.previewImageUrl);
      updateMetaTag('og:url', currentUrl);
      updateCanonical(currentUrl);
    } else {
      document.title = defaultTitle;
      updateMetaTag('description', defaultDesc);
      updateCanonical(siteUrl);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [blogs, selectedBlog]);

  const updateMetaTag = (name, content) => {
    let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
    if (el) el.setAttribute('content', content);
  };

  const updateCanonical = (url) => {
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedBlog) backToList();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlog]);

  const calculateReadingTime = (text) => {
    if (!text) return 0;
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s+/).length;
    return Math.ceil(noOfWords / wordsPerMinute);
  };

  const fetchAndSetBlog = async (blog) => {
    setIsLoading(true);
    setSelectedBlog(blog);
    try {
      const response = await fetch(blog.contentPath);
      if (!response.ok) throw new Error('Fetch failed');
      const text = await response.text();
      setBlogContent(text);
      setCurrentReadingTime(calculateReadingTime(text));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError('Unable to retrieve the reflection.');
    } finally {
      setIsLoading(false);
    }
  };

  const viewArticle = (blog) => {
    const url = new URL(window.location.href);
    url.searchParams.set('post', blog.id);
    window.history.pushState({ blogId: blog.id }, '', url);
    fetchAndSetBlog(blog);
  };

  const shareArticle = (blog) => {
    if (!blog) return;
    const shareUrl = window.location.origin + window.location.pathname + '?post=' + blog.id;
    const shareText = `${blog.title} | God of Blogs`;
    if (navigator.share) {
      navigator.share({ title: blog.title, text: shareText, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard.');
    }
  };

  const backToList = () => {
    setSelectedBlog(null);
    setBlogContent('');
    const url = new URL(window.location.href);
    url.searchParams.delete('post');
    window.history.pushState({}, '', url);
    setError(null);
  };

  return (
    <div className="app-container">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
      
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        backToList={backToList} 
      />
      
      <main className="main-content">
        {!selectedBlog ? (
          <>
            <Hero setActiveCategory={setActiveCategory} />
            <CategoryTabs 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <BlogFeed 
              filteredBlogs={filteredBlogs}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              viewArticle={viewArticle}
            />
            <MissionSection />
            <Newsletter />
          </>
        ) : (
          <ArticleView 
            selectedBlog={selectedBlog}
            blogContent={blogContent}
            isLoading={isLoading}
            currentReadingTime={currentReadingTime}
            backToList={backToList}
            shareArticle={shareArticle}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      <footer className="professional-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-logo">†</span>
            <p className="footer-quote">"Let your light so shine before men..."</p>
          </div>
          <div className="footer-links">
            <h4>EXPLORE</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('ALL'); }}>All Reflections</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('GOD'); }}>God</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('LIFE'); }}>Life</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('LOVE'); }}>Love</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>JOURNAL</h4>
            <ul>
              <li><a href="/sitemap.xml">Sitemap</a></li>
              <li><a href="#">About the Mission</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Grace</a></li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '80px', opacity: 0.5 }}>
          <div className="footer-copy">© 2026 GOD OF BLOGS • FOR THE GREATER GLORY</div>
        </div>
      </footer>
    </div>
  )
}

export default App