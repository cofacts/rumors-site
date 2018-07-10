import React from 'react';

/**
 * @param {Map} props.stats
 * @param {number} props.stats.repliedCount
 * @param {number} props.stats.notRepliedCount
 * @param {number} props.stats.repliedArticleCount
 */
function FullSiteArticleStats({ stats, repliedArticleCount }) {
  if (!stats) return null;

  return (
    <div className="full-site-stat">
      全站未回訊息： {stats.get('notRepliedCount')}
      <p>總篇數: {stats.get('repliedCount') + stats.get('notRepliedCount')}</p>
      {typeof repliedArticleCount === 'number' && (
        <div>
          <p>
            其他人回應的: {stats.get('repliedCount') - repliedArticleCount} /
            你回應的: {repliedArticleCount}
          </p>
          <div className="progress">
            <i
              style={{
                width: `${(stats.get('notRepliedCount') /
                  (stats.get('notRepliedCount') + stats.get('repliedCount'))) *
                  100}%`,
              }}
            />
          </div>
        </div>
      )}
      <style jsx>{`
        .full-site-stat {
          font-size: 12px;
        }
        .progress {
          border: 1px solid khaki;
          padding: 1px;
          height: 8px;
          border-radius: 3px;
        }

        i {
          display: block;
          height: 100%;
          background: khaki;
        }
      `}</style>
    </div>
  );
}

export default FullSiteArticleStats;
