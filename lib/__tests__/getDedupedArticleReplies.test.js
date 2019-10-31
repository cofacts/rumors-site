import getDedupedArticleReplies from '../getDedupedArticleReplies';

describe('getDedupedArticleReplies', () => {
  it('handles when searchResults are not loaded yet', () => {
    expect(getDedupedArticleReplies(undefined, [])).toMatchInlineSnapshot(
      `Array []`
    );
  });

  it('correctly formats articleReplies and removes existing reply id', () => {
    const searchResult = {
      edges: [
        {
          node: {
            articleReplies: [
              { articleId: 'a1', replyId: 'r1' },
              { articleId: 'a1', replyId: 'r2' }, // filtered out by existingReplyIds
            ],
          },
        },
        {
          node: {
            articleReplies: [
              { articleId: 'a2', replyId: 'r1' }, // filtered out because a1-r1 has been included
              { articleId: 'a2', replyId: 'r2' }, // filtered out by existingReplyIds
            ],
          },
        },
      ],
    };

    const existingReplyIds = ['r2'];

    expect(getDedupedArticleReplies(searchResult, existingReplyIds))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "articleId": "a1",
          "replyId": "r1",
        },
      ]
    `);
  });
});
