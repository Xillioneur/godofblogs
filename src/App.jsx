import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './App.css'
import { blogs as blogsData } from './blogsData'
import AdminDashboard from './AdminDashboard'

// --- HELPER COMPONENTS (Moved outside to prevent re-mounting/focus loss) ---

const GamerCross = ({ className = "gamer-cross-svg" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Glow / Halo */}
    <circle cx="50" cy="40" r="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />
    
    {/* The Sword-Cross Blade */}
    <path d="M50 5 L56 15 L56 85 L50 95 L44 85 L44 15 Z" fill="currentColor" />
    
    {/* The Cross Guard (Hilt) */}
    <path d="M20 35 L80 35 L82 38 L80 43 L20 43 L18 38 Z" fill="currentColor" />
    
    {/* Central Core (Glow) */}
    <path d="M50 12 L52 18 L52 82 L50 88 L48 82 L48 18 Z" fill="rgba(255,255,255,0.3)" />
    
    {/* Angular Accents */}
    <path d="M35 35 L44 25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <path d="M65 35 L56 25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

const Header = ({ isDarkMode, setIsDarkMode, backToList, onAbout }) => (
  <header className="professional-header">
    <div className="header-inner">
      <div className="brand" onClick={backToList} role="button">
        <GamerCross className="header-logo-svg" />
        <span className="brand-name">GOD OF BLOGS</span>
      </div>
      <nav className="header-nav">
        <button className="nav-link" onClick={onAbout}>ABOUT THE AUTHOR</button>
        <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
        </button>
      </nav>
    </div>
  </header>
);

const WordStack = () => {
  const scriptures = [
    { isIcon: true, text: <GamerCross className="gamer-cross-svg" />, style: "style-icon", cite: "" },
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
        <button className="cta-secondary" onClick={() => {
          setActiveCategory('GOD');
          setTimeout(() => {
            const feed = document.querySelector('.blog-feed');
            feed?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}>
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

const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? 
          <mark key={i} className="search-highlight">{part}</mark> : 
          part
      )}
    </span>
  );
};

const BlogFeed = ({ filteredBlogs, activeCategory, setActiveCategory, searchQuery, setSearchQuery, viewArticle, publicLikes }) => (
  <div className="blog-feed">
    <CategoryTabs 
      activeCategory={activeCategory} 
      setActiveCategory={setActiveCategory} 
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />

    {searchQuery && (
      <div className="search-results-info">
        <span className="results-count">{filteredBlogs.length} REFLECTIONS FOUND FOR "{searchQuery.toUpperCase()}"</span>
        <button className="clear-search" onClick={() => setSearchQuery('')}>CLEAR SEARCH</button>
      </div>
    )}

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
                                                  <span className="card-author">BY {blog.author?.toUpperCase() || 'WILLIE LIWA JOHNSON'}</span>
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                                    <span className="card-reading-time">{publicLikes[blog.id] || 0}</span>
                                                  </div>
                                                  <span className="card-reading-time">4 MIN READ</span>
                                                </div>
                                                {isFeatured && <span className="card-category">{blog.category}</span>}                                <h2 className="card-title">
                                  <HighlightText text={blog.title} highlight={searchQuery} />
                                </h2>
                                <p className="card-excerpt">
                                  <HighlightText text={blog.summary} highlight={searchQuery} />
                                </p>
                                <span className="read-more">CONTINUE READING →</span>
                              </div>            </article>
          );
        })
      ) : (
        <div className="no-results">
          <h3>No reflections found in the current archives.</h3>
          <p>Try searching for a different word or explore another category.</p>
          <button className="cta-secondary" style={{ marginTop: '20px' }} onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}>VIEW ALL ARCHIVES</button>
        </div>
      )}
    </div>
  </div>
);

const FloatingSacredCTA = ({ show, onLike }) => (
  <div className={`floating-cta ${show ? 'visible' : ''}`}>
    <span className="cta-text">JOIN THE SANCTUARY</span>
    <div className="cta-actions">
      <button className="icon-btn" title="Like Reflection" onClick={onLike}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <button className="icon-btn" title="Subscribe RSS" onClick={() => window.open('/feed.xml', '_blank')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
      </button>
      <button className="icon-btn" title="Divine Letter" onClick={() => document.querySelector('.newsletter-section')?.scrollIntoView({ behavior: 'smooth' })}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      </button>
    </div>
  </div>
);

const Breadcrumbs = ({ paths }) => (
  <nav className="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li><a href="/" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}>HOME</a></li>
      {paths.map((p, i) => (
        <li key={i}>
          <span className="breadcrumb-separator">/</span>
          {p.current ? (
            <span className="breadcrumb-current" aria-current="page">{p.label.toUpperCase()}</span>
          ) : (
            <a href={p.url} onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', p.url); window.dispatchEvent(new PopStateEvent('popstate')); }}>{p.label.toUpperCase()}</a>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

const ArticleView = ({ selectedBlog, blogs, blogContent, isLoading, currentReadingTime, backToList, shareArticle, viewArticle, onLike, isDarkMode, publicLikes }) => {
  const currentIndex = blogs.findIndex(b => b.id === selectedBlog.id);
  const prevPost = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? blogs[currentIndex - 1] : null;

  const related = blogs
    .filter(b => b.id !== selectedBlog.id && b.category === selectedBlog.category)
    .slice(0, 2);

  return (
    <article className="article-view animate-in">
      <div className="article-header">
        <Breadcrumbs paths={[
          { label: selectedBlog.category, url: `/?category=${selectedBlog.category}` },
          { label: selectedBlog.title, current: true }
        ]} />
        <button className="article-back" onClick={backToList}>← BACK TO JOURNAL</button>
        <div className="article-meta">
          <span className="article-category">{selectedBlog?.category}</span>
          <time>{selectedBlog?.date}</time>
          <span className="article-author">BY {selectedBlog?.author?.toUpperCase() || 'WILLIE LIWA JOHNSON'}</span>
          <span className="reading-time">{publicLikes[selectedBlog.id] || 0} APPRECIATIONS</span>
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
          <button className="sidebar-btn" onClick={onLike} title="Sacred Appreciation">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button className="sidebar-btn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} title="Back to top">
            ↑
          </button>
          <a href="/feed.xml" className="sidebar-btn" title="RSS Feed" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
          </a>
        </div>
        <div className="article-content">
          {isLoading ? (
            <div className="shimmer-container">
              <div className="shimmer-line"></div>
              <div className="shimmer-line"></div>
              <div className="shimmer-line"></div>
            </div>
          ) : (
            <>
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
              
              <div className="post-navigation">
                {prevPost ? (
                  <div className="nav-item prev" onClick={() => viewArticle(prevPost)}>
                    <span className="nav-label">PREVIOUS REFLECTION</span>
                    <h4 className="nav-title">{prevPost.title}</h4>
                  </div>
                ) : <div className="nav-item prev disabled"></div>}
                
                {nextPost ? (
                  <div className="nav-item next" onClick={() => viewArticle(nextPost)}>
                    <span className="nav-label">NEXT REFLECTION</span>
                    <h4 className="nav-title">{nextPost.title}</h4>
                  </div>
                ) : <div className="nav-item next disabled"></div>}
              </div>

              {related.length > 0 && (
                <div className="related-reflections">
                  <h3>CONTINUE THE JOURNEY</h3>
                  <div className="related-grid">
                    {related.map(blog => (
                      <div key={blog.id} className="related-card" onClick={() => viewArticle(blog)}>
                        <img src={blog.previewImageUrl} alt={blog.title} />
                        <h4>{blog.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
};

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

const Newsletter = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubscribe) onSubscribe(email);
    setEmail('');
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-inner">
        <h2>The Divine Letter</h2>
        <p>Join our sanctuary of readers and receive weekly reflections on truth, grace, and eternity directly in your inbox.</p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="email@address.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button type="submit">SUBSCRIBE</button>
        </form>
      </div>
    </section>
  );
};

const FeaturedScripture = () => (
  <section className="featured-scripture-section animate-in">
    <div className="scripture-quote-box">
      <span className="quote-mark">“</span>
      <p className="main-quote">For in Him we live and move and have our being.</p>
      <cite>ACTS 17:28</cite>
    </div>
  </section>
);

const ChronicleOfLight = () => (
  <section className="chronicle-section animate-in">
    <div className="section-header">
      <h2>CHRONICLE OF LIGHT</h2>
      <p>The evolving digital journey of this sanctuary.</p>
    </div>
    <div className="chronicle-list">
      <div className="update-entry">
        <div className="update-meta">
          <span className="update-date">FEB 07</span>
          <div className="update-dot"></div>
        </div>
        <div className="update-content">
          <h4>PHASE 4: ARCHIVE SOVEREIGNTY</h4>
          <p>The Admin Portal is now live. We have established a direct bridge between the local editor and the digital archives, ensuring every reflection is permanent and pristine.</p>
        </div>
      </div>
      <div className="update-entry">
        <div className="update-meta">
          <span className="update-date">FEB 06</span>
          <div className="update-dot"></div>
        </div>
        <div className="update-content">
          <h4>PHASE 3: THE GAMER'S CROSS</h4>
          <p>Unified the platform identity with the new Sword-Cross logo. A modern symbol for an eternal message.</p>
        </div>
      </div>
      <div className="update-entry">
        <div className="update-meta">
          <span className="update-date">FEB 05</span>
          <div className="update-dot"></div>
        </div>
        <div className="update-content">
          <h4>PHASE 2: EDITORIAL MASTERY</h4>
          <p>Transitioned into a high-end editorial aesthetic. Enhanced SEO, dynamic reading times, and advanced typography are now foundational.</p>
        </div>
      </div>
    </div>
  </section>
);

const AboutView = ({ onBack }) => (
  <div className="article-view animate-in">
    <div className="article-header">
      <Breadcrumbs paths={[{ label: 'ABOUT THE AUTHOR', current: true }]} />
      <button className="article-back" onClick={onBack}>← BACK TO JOURNAL</button>
      <h1 className="article-title">Willie Liwa Johnson</h1>
      <p className="hero-description" style={{ margin: '0 auto 40px auto' }}>Author, Explorer, and Servant of the Word.</p>
    </div>
    
    <div className="article-hero-image" style={{ height: '60vh' }}>
      <img src="/assets/covers/author.svg" alt="The Journey" />
    </div>

    <div className="article-container">
      <div className="article-content">
        <div className="reveal">
          <p>
            Welcome to <strong>God of Blogs</strong>. I am Willie Liwa Johnson, and this sanctuary is dedicated to the exploration of the Divine through the lens of human experience.
          </p>
        </div>
        <div className="reveal">
          <h2>The Mission</h2>
          <p>
            In a world often fragmented by noise, I seek to build a bridge between logic and faith. Every reflection shared here is a pilgrimage toward clarity, grounded in the absolute truth of the Creator and the transformative power of Love.
          </p>
        </div>
        <div className="reveal">
          <blockquote>
            "To live is to learn the language of the Infinite."
          </blockquote>
        </div>
        <div className="reveal">
          <p>
            Thank you for joining me on this journey. May these words serve as a light on your path, as they have on mine.
          </p>
        </div>
        <div className="reveal" style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--border-color)' }}>
          <h3>CONNECT</h3>
          <p>You can find my latest reflections and updates on the firmament of the social web.</p>
          <button className="cta-primary" style={{ marginTop: '40px' }} onClick={onBack}>BEGIN THE PILGRIMAGE</button>
        </div>
      </div>
    </div>
  </div>
);

const NotFoundView = ({ onBack }) => (
  <div className="article-view animate-in">
    <div className="article-header">
      <h1 className="article-title">Lost in the Void</h1>
      <p className="hero-description">This path is not yet written in the archives.</p>
      <button className="cta-primary" style={{ marginTop: '40px' }} onClick={onBack}>RETURN TO THE ARCHIVE</button>
    </div>
    <div className="hero-visual" style={{ margin: '80px auto', maxWidth: '400px' }}>
      <div className="visual-inner">
        <span style={{ fontSize: '10rem', opacity: 0.1 }}>?</span>
      </div>
    </div>
  </div>
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
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAscend, setShowAscend] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [publicLikes, setPublicLikes] = useState({});
  const [userLikes, setUserLikes] = useState(() => {
    const saved = localStorage.getItem('user_likes');
    return saved ? JSON.parse(saved) : {};
  });

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

  // Scroll Progress & Ascend
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowAscend(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    const revealedElements = document.querySelectorAll('.reveal');
    revealedElements.forEach(el => observer.observe(el));

    return () => {
      revealedElements.forEach(el => observer.unobserve(el));
    };
  }, [selectedBlog, showAbout, filteredBlogs]);

  // Initial Data Load
  useEffect(() => {
    if (blogsData) {
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    }
    fetchPublicStats();
  }, []);

  const fetchPublicStats = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/stats');
      const data = await res.json();
      setPublicLikes(data.likes || {});
    } catch (e) {
      console.error("Failed to fetch public stats");
    }
  };

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

  const setJsonLd = (data) => {
    let script = document.getElementById('json-ld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(data);
  };

  // Routing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pathParts = window.location.pathname.split('/');
    const pathBlogId = pathParts[1] === 'post' ? pathParts[2] : null;

    if (params.get('admin') === 'portal') {
      setShowAdmin(true);
      return;
    }
    if (params.get('page') === 'about' || pathParts[1] === 'about') {
      setShowAbout(true);
      setSelectedBlog(null);
      return;
    }

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pathParts = window.location.pathname.split('/');
      const blogId = params.get('post') || (pathParts[1] === 'post' ? pathParts[2] : null);
      const page = params.get('page') || (pathParts[1] === 'about' ? 'about' : null);

      if (page === 'about') {
        setShowAbout(true);
        setSelectedBlog(null);
        setIsNotFound(false);
      } else if (blogId && blogs.length > 0) {
        const blog = blogs.find(b => b.id === blogId);
        if (blog) {
          fetchAndSetBlog(blog);
          setShowAbout(false);
          setIsNotFound(false);
        } else {
          setSelectedBlog(null);
          setShowAbout(false);
          setIsNotFound(true);
        }
      } else {
        setSelectedBlog(null);
        setShowAbout(false);
        setIsNotFound(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Check URL on load
    const blogId = params.get('post') || pathBlogId;
    if (blogId && blogs.length > 0 && !selectedBlog) {
      const blog = blogs.find(b => b.id === blogId);
      if (blog) fetchAndSetBlog(blog);
      else setIsNotFound(true);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [blogs]);

  // SEO Update
  useEffect(() => {
    const siteUrl = "https://godofblogs.xyz";
    const defaultTitle = "Willie Liwa Johnson | Divine Reflections";
    const defaultDesc = "A professional journal dedicated to the exploration of Divine Love, the complexities of Life, and the Sovereignty of God.";
    const defaultImage = "https://godofblogs.xyz/assets/covers/main-cover.png";

    if (selectedBlog) {
      const currentUrl = `${siteUrl}/?post=${selectedBlog.id}`;
      document.title = `${selectedBlog.title} | Willie Liwa Johnson`;
      updateMetaTag('description', selectedBlog.summary);
      updateMetaTag('og:title', selectedBlog.title);
      updateMetaTag('og:description', selectedBlog.summary);
      updateMetaTag('og:image', selectedBlog.socialImage?.startsWith('http') ? selectedBlog.socialImage : `${siteUrl}${selectedBlog.socialImage || selectedBlog.previewImageUrl}`);
      updateMetaTag('og:url', currentUrl);
      updateMetaTag('twitter:title', selectedBlog.title);
      updateMetaTag('twitter:description', selectedBlog.summary);
      updateMetaTag('twitter:image', selectedBlog.socialImage?.startsWith('http') ? selectedBlog.socialImage : `${siteUrl}${selectedBlog.socialImage || selectedBlog.previewImageUrl}`);
      updateCanonical(currentUrl);

      // Inject JSON-LD
      setJsonLd([
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": selectedBlog.title,
          "image": [selectedBlog.previewImageUrl],
          "datePublished": "2026-02-05T08:00:00+00:00",
          "author": [{
              "@type": "Person",
              "name": "Willie Liwa Johnson",
              "url": siteUrl
            }]
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },{
            "@type": "ListItem",
            "position": 2,
            "name": selectedBlog.title,
            "item": currentUrl
          }]
        }
      ]);
    } else {
      document.title = defaultTitle;
      updateMetaTag('description', defaultDesc);
      updateMetaTag('og:title', defaultTitle);
      updateMetaTag('og:description', defaultDesc);
      updateMetaTag('og:image', defaultImage);
      updateMetaTag('twitter:title', defaultTitle);
      updateMetaTag('twitter:description', defaultDesc);
      updateMetaTag('twitter:image', defaultImage);
      updateCanonical(siteUrl);

      setJsonLd({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Willie Liwa Johnson",
        "url": siteUrl,
        "author": {
          "@type": "Person",
          "name": "Willie Liwa Johnson"
        }
      });
    }
  }, [selectedBlog]);

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
    url.pathname = `/post/${blog.id}`;
    url.searchParams.delete('post');
    window.history.pushState({ blogId: blog.id }, '', url);
    fetchAndSetBlog(blog);
  };

  const shareArticle = (blog) => {
    if (!blog) return;
    const shareUrl = `${window.location.origin}/post/${blog.id}`;
    const shareText = `Behold: ${blog.title} | Willie Liwa Johnson`;
    
    if (navigator.share) {
      navigator.share({ title: blog.title, text: shareText, url: shareUrl });
    } else {
      const choice = confirm("Share this reflection?\n\nOK for X.com\nCancel for Reddit");
      if (choice) {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      } else {
        window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog.title)}`, '_blank');
      }
    }
  };

  const handleAbout = () => {
    setShowAbout(true);
    setSelectedBlog(null);
    const url = new URL(window.location.href);
    url.pathname = '/about';
    url.searchParams.delete('page');
    url.searchParams.delete('post');
    window.history.pushState({ page: 'about' }, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToList = () => {
    setSelectedBlog(null);
    setShowAbout(false);
    setIsNotFound(false);
    setBlogContent('');
    const url = new URL(window.location.origin);
    window.history.pushState({}, '', url);
    setError(null);
  };

  if (showAdmin) {
    return (
      <div className="main-canvas">
        <AdminDashboard blogs={blogs} onBack={() => {
          setShowAdmin(false);
          const url = new URL(window.location.href);
          url.searchParams.delete('admin');
          window.history.pushState({}, '', url);
        }} />
      </div>
    );
  }

  const handleSubscribe = async (email) => {
    try {
      const res = await fetch('http://localhost:3001/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        alert("Welcome to the sanctuary. You will be notified of new reflections.");
      }
    } catch (e) {
      console.error("Subscription failed. Local API may not be running.");
    }
  };

  const handleLike = async (id) => {
    // Local visual feedback
    if (userLikes[id]) return; // One like per session/user for now
    
    const newUserLikes = { ...userLikes, [id]: true };
    setUserLikes(newUserLikes);
    localStorage.setItem('user_likes', JSON.stringify(newUserLikes));

    // Optimistic update
    setPublicLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

    try {
      const res = await fetch('http://localhost:3001/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (e) {
      console.warn("Server-side like sync unavailable in production. Local persistence active.");
    }
  };

  return (
    <div className="app-container">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
      
      <FloatingSacredCTA 
        show={showAscend && !selectedBlog} 
        onLike={() => handleLike('global')} // Placeholder for global like
      />

      <button className={`ascend-btn ${showAscend ? 'visible' : ''}`} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} title="Ascend">
        ↑
      </button>

      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        backToList={backToList}
        onAbout={handleAbout}
      />
      
      <main className="main-content">
        {isNotFound ? (
          <NotFoundView onBack={backToList} />
        ) : showAbout ? (
          <AboutView onBack={backToList} />
        ) : !selectedBlog ? (
          <>
            <Hero setActiveCategory={setActiveCategory} />
            <div className="reveal">
              <BlogFeed 
                filteredBlogs={filteredBlogs}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewArticle={viewArticle}
                publicLikes={publicLikes}
              />
            </div>
            <div className="reveal">
              <FeaturedScripture />
            </div>
            <div className="reveal">
              <MissionSection />
            </div>
            <div className="reveal">
              <ChronicleOfLight />
            </div>
            <div className="reveal">
              <Newsletter onSubscribe={handleSubscribe} />
            </div>
          </>
        ) : (
          <ArticleView 
            selectedBlog={selectedBlog}
            blogs={blogs}
            blogContent={blogContent}
            isLoading={isLoading}
            currentReadingTime={currentReadingTime}
            backToList={backToList}
            shareArticle={shareArticle}
            viewArticle={viewArticle}
            onLike={() => handleLike(selectedBlog.id)}
            isDarkMode={isDarkMode}
            publicLikes={publicLikes}
          />
        )}
      </main>

      <footer className="professional-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <GamerCross className="footer-logo-svg" />
            <span className="brand-name">WILLIE LIWA JOHNSON</span>
            <div className="footer-socials">
              <a href="#" className="social-icon" title="X (Twitter)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              </a>
              <a href="#" className="social-icon" title="Reddit">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
              </a>
              <a href="#" className="social-icon" title="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
            <p className="footer-quote" style={{ marginTop: '20px' }}>"Let your light so shine before men..."</p>
          </div>
          <div className="footer-links">
            <h4>EXPLORE</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('ALL'); }}>All Reflections</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('GOD'); }}>God</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('LIFE'); }}>Life</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('LOVE'); }}>Love</a></li>
              <li>
                <a href="/feed.xml" className="rss-link-item" target="_blank">
                  <svg className="rss-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
                  RSS FEED
                </a>
              </li>
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
          <div className="footer-copy">© 2026 WILLIE LIWA JOHNSON • FOR THE GREATER GLORY</div>
        </div>
      </footer>
    </div>
  )
}

export default App