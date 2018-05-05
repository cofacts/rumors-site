import React from 'react';

/**
 * @param {Map} props.stats
 * @param {number} props.stats.repliedCount
 * @param {number} props.stats.notRepliedCount
 */
function FullSiteArticleStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="full-site-stat">
      全站未回訊息： {stats.get('notRepliedCount')}
      <style jsx>{`
        .full-site-stat {
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}

export default FullSiteArticleStats;
