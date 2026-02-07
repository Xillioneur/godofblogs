import React, { useState, useEffect } from 'react';

const SelectToShare = () => {
  const [position, setPosition] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const handleSelect = () => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (!selectedText || selectedText.length < 5) {
        setPosition(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Calculate position relative to viewport, centered above selection
      setPosition({
        top: rect.top + window.scrollY - 50,
        left: rect.left + window.scrollX + (rect.width / 2)
      });
      setText(selectedText);
    };

    document.addEventListener('selectionchange', handleSelect);
    return () => document.removeEventListener('selectionchange', handleSelect);
  }, []);

  const handleShare = () => {
    const url = window.location.href;
    const tweetText = `"${text}"

Read more at: ${url}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
    setPosition(null);
  };

  if (!position) return null;

  return (
    <div 
      className="select-share-tooltip reveal revealed"
      style={{ 
        position: 'absolute', 
        top: position.top, 
        left: position.left, 
        transform: 'translateX(-50%)',
        zIndex: 1000
      }}
    >
      <button className="share-quote-btn" onClick={handleShare}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px'}}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        SHARE TRUTH
      </button>
      <div className="tooltip-arrow"></div>
    </div>
  );
};

export default SelectToShare;
