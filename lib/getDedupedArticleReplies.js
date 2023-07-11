/**
 * Convert list of articles into list of article replies with replyIds not in,
 * existingReplyIds, and their replyIds are unique among each item.
 *
 * Sorted by original article result.
 *
 * @param {object} searchResult - Return result from ListArticles or ListReplies, in shape of
 *                                 {edges: [{articleReplies: {replyId: '...', ...}}...]}
 * @param {string[]} existingReplyIds - list of existing reply ids
 *
 * @returns {object[]} list of articleReplies, without existingReplyIds
 */
export default function getDedupedArticleReplies(
  searchResult,
  existingReplyIds
) {
  const existingReplyIdMap = (existingReplyIds || []).reduce((map, replyId) => {
    map[replyId] = true;
    return map;
  }, {});

  const articleReplies = [];
  (searchResult?.edges || []).forEach(({ node }) => {
    node.articleReplies.forEach((articleReply) => {
      if (existingReplyIdMap[articleReply.replyId]) return;

      articleReplies.push(articleReply);
      existingReplyIdMap[articleReply.replyId] = true;
    });
  });

  return articleReplies;
}
