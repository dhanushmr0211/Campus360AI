import { useState } from 'react';
import styles from '../styles/NoticeCard.module.css';

export default function NoticeCard({ notice }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Academic: '#4a90e2',
      Events: '#f39c12',
      Sports: '#27ae60',
      Clubs: '#9b59b6',
      Administration: '#e74c3c',
      Placement: '#16a085',
      Workshop: '#d35400',
      Scholarship: '#2ecc71',
      General: '#95a5a6'
    };
    return colors[category] || colors.General;
  };

  return (
    <div className={styles.card}>
      <div 
        className={styles.categoryBadge}
        style={{ backgroundColor: getCategoryColor(notice.category) }}
      >
        {notice.category || 'General'}
      </div>
      
      <h2 className={styles.title}>{notice.title}</h2>
      
      <p className={styles.summary}>
        {notice.summary || notice.original_content?.substring(0, 150) + '...'}
      </p>
      
      {notice.original_content && (
        <div>
          <button
            className={styles.expandButton}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Read More'}
          </button>
          
          {expanded && (
            <div className={styles.fullContent}>
              <h3>Full Content:</h3>
              <p>{notice.original_content}</p>
            </div>
          )}
        </div>
      )}
      
      <div className={styles.footer}>
        <span className={styles.timestamp}>
          {formatDate(notice.timestamp)}
        </span>
      </div>
    </div>
  );
}
