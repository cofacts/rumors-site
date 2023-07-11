/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  GetArticle?: Maybe<Article>;
  GetCategory?: Maybe<Category>;
  GetReply?: Maybe<Reply>;
  /**
   *
   *     Gets specified user. If id is not given, returns the currently logged-in user.
   *     Note that some fields like email is not visible to other users.
   *
   */
  GetUser?: Maybe<User>;
  ListAIResponses: AiResponseConnection;
  ListAnalytics: AnalyticsConnection;
  ListArticleReplyFeedbacks?: Maybe<ListArticleReplyFeedbackConnection>;
  ListArticles?: Maybe<ArticleConnection>;
  ListBlockedUsers: UserConnection;
  ListCategories?: Maybe<ListCategoryConnection>;
  ListReplies?: Maybe<ReplyConnection>;
  ListReplyRequests?: Maybe<ListReplyRequestConnection>;
  ValidateSlug?: Maybe<ValidationResult>;
};


export type QueryGetArticleArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryGetCategoryArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryGetReplyArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryGetUserArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryListAiResponsesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ListAiResponsesFilter>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<ListAiResponsesOrderBy>>>;
};


export type QueryListAnalyticsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ListAnalyticsFilter>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<ListAnalyticsOrderBy>>>;
};


export type QueryListArticleReplyFeedbacksArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ListArticleReplyFeedbackFilter>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<ListArticleReplyFeedbackOrderBy>>>;
};


export type QueryListArticlesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ListArticleFilter>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<ListArticleOrderBy>>>;
};


export type QueryListBlockedUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ListBlockedUsersFilter>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<ListBlockedUsersOrderBy>>>;
};


export type QueryListCategoriesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<ListCategoryOrderBy>>>;
};


export type QueryListRepliesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ListReplyFilter>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<ListReplyOrderBy>>>;
};


export type QueryListReplyRequestsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ListReplyRequestFilter>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<ListReplyRequestOrderBy>>>;
};


export type QueryValidateSlugArgs = {
  slug: Scalars['String'];
};

export type Article = Node & {
  __typename?: 'Article';
  /** Automated reply from AI before human fact checkers compose an fact check */
  aiReplies: Array<AiReply>;
  articleCategories?: Maybe<Array<Maybe<ArticleCategory>>>;
  /** Connections between this article and replies. Sorted by the logic described in https://github.com/cofacts/rumors-line-bot/issues/78. */
  articleReplies?: Maybe<Array<Maybe<ArticleReply>>>;
  /** Message event type */
  articleType: ArticleTypeEnum;
  /** Attachment hash to search or identify files */
  attachmentHash?: Maybe<Scalars['String']>;
  /** Attachment URL for this article. */
  attachmentUrl?: Maybe<Scalars['String']>;
  /** Number of normal article categories */
  categoryCount?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
  /** Hyperlinks in article text */
  hyperlinks?: Maybe<Array<Maybe<Hyperlink>>>;
  id: Scalars['ID'];
  lastRequestedAt?: Maybe<Scalars['String']>;
  references?: Maybe<Array<Maybe<ArticleReference>>>;
  relatedArticles?: Maybe<ArticleConnection>;
  /** Number of normal article replies */
  replyCount?: Maybe<Scalars['Int']>;
  replyRequestCount?: Maybe<Scalars['Int']>;
  replyRequests?: Maybe<Array<Maybe<ReplyRequest>>>;
  /** If the current user has requested for reply for this article. Null if not logged in. */
  requestedForReply?: Maybe<Scalars['Boolean']>;
  /** Activities analytics for the given article */
  stats?: Maybe<Array<Maybe<Analytics>>>;
  status: ReplyRequestStatusEnum;
  text?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  /** The user submitted this article */
  user?: Maybe<User>;
};


export type ArticleArticleCategoriesArgs = {
  status?: InputMaybe<ArticleCategoryStatusEnum>;
  statuses?: InputMaybe<Array<ArticleCategoryStatusEnum>>;
};


export type ArticleArticleRepliesArgs = {
  appId?: InputMaybe<Scalars['String']>;
  selfOnly?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<ArticleReplyStatusEnum>;
  statuses?: InputMaybe<Array<ArticleReplyStatusEnum>>;
  userId?: InputMaybe<Scalars['String']>;
  userIds?: InputMaybe<Array<Scalars['String']>>;
};


export type ArticleAttachmentUrlArgs = {
  variant?: InputMaybe<AttachmentVariantEnum>;
};


export type ArticleRelatedArticlesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<RelatedArticleFilter>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<RelatedArticleOrderBy>>>;
};


export type ArticleReplyRequestsArgs = {
  statuses?: InputMaybe<Array<ReplyRequestStatusEnum>>;
};


export type ArticleStatsArgs = {
  dateRange?: InputMaybe<TimeRangeInput>;
};

/** Basic entity. Modeled after Relay's GraphQL Server Specification. */
export type Node = {
  id: Scalars['ID'];
};

/** A ChatGPT reply for an article with no human fact-checks yet */
export type AiReply = AiResponse & Node & {
  __typename?: 'AIReply';
  createdAt: Scalars['String'];
  /** The id for the document that this AI response is for. */
  docId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  /** Processing status of AI */
  status: AiResponseStatusEnum;
  /** AI response text. Populated after status becomes SUCCESS. */
  text?: Maybe<Scalars['String']>;
  /** AI response type */
  type: AiResponseTypeEnum;
  updatedAt?: Maybe<Scalars['String']>;
  /** The usage returned from OpenAI. Populated after status becomes SUCCESS. */
  usage?: Maybe<OpenAiCompletionUsage>;
  /** The user triggered this AI response */
  user?: Maybe<User>;
};

/** Denotes an AI processed response and its processing status. */
export type AiResponse = {
  createdAt: Scalars['String'];
  /** The id for the document that this AI response is for. */
  docId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  /** Processing status of AI */
  status: AiResponseStatusEnum;
  /** AI response text. Populated after status becomes SUCCESS. */
  text?: Maybe<Scalars['String']>;
  /** AI response type */
  type: AiResponseTypeEnum;
  updatedAt?: Maybe<Scalars['String']>;
  /** The user triggered this AI response */
  user?: Maybe<User>;
};

export enum AiResponseStatusEnum {
  Error = 'ERROR',
  Loading = 'LOADING',
  Success = 'SUCCESS'
}

export enum AiResponseTypeEnum {
  /** The AI Response is an automated analysis / reply of an article. */
  AiReply = 'AI_REPLY'
}

export type User = Node & {
  __typename?: 'User';
  appId?: Maybe<Scalars['String']>;
  /** Returns only for current user. Returns `null` otherwise. */
  appUserId?: Maybe<Scalars['String']>;
  /** Returns only for current user. Returns `null` otherwise. */
  availableAvatarTypes?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** return avatar data as JSON string, currently only used when avatarType is OpenPeeps */
  avatarData?: Maybe<Scalars['String']>;
  avatarType?: Maybe<AvatarTypeEnum>;
  /** returns avatar url from facebook, github or gravatar */
  avatarUrl?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  /** If not null, the user is blocked with the announcement in this string. */
  blockedReason?: Maybe<Scalars['String']>;
  /** List of contributions made by the user */
  contributions?: Maybe<Array<Maybe<Contribution>>>;
  createdAt?: Maybe<Scalars['String']>;
  /** Returns only for current user. Returns `null` otherwise. */
  email?: Maybe<Scalars['String']>;
  /** Returns only for current user. Returns `null` otherwise. */
  facebookId?: Maybe<Scalars['String']>;
  /** Returns only for current user. Returns `null` otherwise. */
  githubId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastActiveAt?: Maybe<Scalars['String']>;
  level: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  points: PointInfo;
  /** Number of articles this user has replied to */
  repliedArticleCount: Scalars['Int'];
  slug?: Maybe<Scalars['String']>;
  /** Returns only for current user. Returns `null` otherwise. */
  twitterId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  /** Number of article replies this user has given feedbacks */
  votedArticleReplyCount: Scalars['Int'];
};


export type UserContributionsArgs = {
  dateRange?: InputMaybe<TimeRangeInput>;
};

export enum AvatarTypeEnum {
  Facebook = 'Facebook',
  Github = 'Github',
  Gravatar = 'Gravatar',
  OpenPeeps = 'OpenPeeps'
}

/** List only the entries that were created between the specific time range. The time range value is in elasticsearch date format (https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-date-format.html) */
export type TimeRangeInput = {
  EQ?: InputMaybe<Scalars['String']>;
  GT?: InputMaybe<Scalars['String']>;
  GTE?: InputMaybe<Scalars['String']>;
  LT?: InputMaybe<Scalars['String']>;
  LTE?: InputMaybe<Scalars['String']>;
};

export type Contribution = {
  __typename?: 'Contribution';
  count?: Maybe<Scalars['Int']>;
  date?: Maybe<Scalars['String']>;
};

/** Information of a user's point. Only available for current user. */
export type PointInfo = {
  __typename?: 'PointInfo';
  /** Points required for current level */
  currentLevel: Scalars['Int'];
  /** Points required for next level. null when there is no next level. */
  nextLevel: Scalars['Int'];
  /** Points earned by the current user */
  total: Scalars['Int'];
};

export type OpenAiCompletionUsage = {
  __typename?: 'OpenAICompletionUsage';
  completionTokens: Scalars['Int'];
  promptTokens: Scalars['Int'];
  totalTokens: Scalars['Int'];
};

export enum ArticleCategoryStatusEnum {
  /** Created by a blocked user violating terms of use. */
  Blocked = 'BLOCKED',
  Deleted = 'DELETED',
  Normal = 'NORMAL'
}

/** The linkage between an Article and a Category */
export type ArticleCategory = Node & {
  __typename?: 'ArticleCategory';
  aiConfidence?: Maybe<Scalars['Float']>;
  aiModel?: Maybe<Scalars['String']>;
  appId: Scalars['String'];
  article?: Maybe<Article>;
  articleId?: Maybe<Scalars['String']>;
  canUpdateStatus?: Maybe<Scalars['Boolean']>;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  feedbackCount?: Maybe<Scalars['Int']>;
  feedbacks?: Maybe<Array<Maybe<ArticleCategoryFeedback>>>;
  id: Scalars['ID'];
  negativeFeedbackCount?: Maybe<Scalars['Int']>;
  /** The feedback of current user. null when not logged in or not voted yet. */
  ownVote?: Maybe<FeedbackVote>;
  positiveFeedbackCount?: Maybe<Scalars['Int']>;
  status?: Maybe<ArticleCategoryStatusEnum>;
  updatedAt?: Maybe<Scalars['String']>;
  /** The user who updated this category with this article. */
  user?: Maybe<User>;
  userId: Scalars['String'];
};

/** Category label for specific topic */
export type Category = Node & {
  __typename?: 'Category';
  articleCategories?: Maybe<ArticleCategoryConnection>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};


/** Category label for specific topic */
export type CategoryArticleCategoriesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<CategoryArticleCategoriesOrderBy>>>;
  status?: InputMaybe<ArticleCategoryStatusEnum>;
};

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type CategoryArticleCategoriesOrderBy = {
  createdAt?: InputMaybe<SortOrderEnum>;
};

export enum SortOrderEnum {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type ArticleCategoryConnection = Connection & {
  __typename?: 'ArticleCategoryConnection';
  edges: Array<ArticleCategoryConnectionEdge>;
  pageInfo: ArticleCategoryConnectionPageInfo;
  /** The total count of the entire collection, regardless of "before", "after". */
  totalCount: Scalars['Int'];
};

/** Connection model for a list of nodes. Modeled after Relay's GraphQL Server Specification. */
export type Connection = {
  edges: Array<Edge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** Edge in Connection. Modeled after GraphQL connection model. */
export type Edge = {
  cursor: Scalars['String'];
  node: Node;
};

/** PageInfo in Connection. Modeled after GraphQL connection model. */
export type PageInfo = {
  /** The cursor pointing to the first node of the entire collection, regardless of "before" and "after". Can be used to determine if is in the last page. Null when the collection is empty. */
  firstCursor?: Maybe<Scalars['String']>;
  /** The cursor pointing to the last node of the entire collection, regardless of "before" and "after". Can be used to determine if is in the last page. Null when the collection is empty. */
  lastCursor?: Maybe<Scalars['String']>;
};

export type ArticleCategoryConnectionEdge = Edge & {
  __typename?: 'ArticleCategoryConnectionEdge';
  cursor: Scalars['String'];
  highlight?: Maybe<Highlights>;
  node: ArticleCategory;
  score?: Maybe<Scalars['Float']>;
};

export type Highlights = {
  __typename?: 'Highlights';
  /** Article or Reply hyperlinks */
  hyperlinks?: Maybe<Array<Maybe<Hyperlink>>>;
  /** Reply reference */
  reference?: Maybe<Scalars['String']>;
  /** Article or Reply text */
  text?: Maybe<Scalars['String']>;
};

/** Data behind a hyperlink */
export type Hyperlink = {
  __typename?: 'Hyperlink';
  error?: Maybe<Scalars['String']>;
  fetchedAt?: Maybe<Scalars['String']>;
  /** URL normalized by scrapUrl */
  normalizedUrl?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  topImageUrl?: Maybe<Scalars['String']>;
  /** URL in text */
  url?: Maybe<Scalars['String']>;
};

export type ArticleCategoryConnectionPageInfo = PageInfo & {
  __typename?: 'ArticleCategoryConnectionPageInfo';
  firstCursor?: Maybe<Scalars['String']>;
  lastCursor?: Maybe<Scalars['String']>;
};

/** User feedback to an ArticleCategory */
export type ArticleCategoryFeedback = {
  __typename?: 'ArticleCategoryFeedback';
  comment?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  /** User's vote on the articleCategory */
  vote?: Maybe<FeedbackVote>;
};

export enum FeedbackVote {
  Downvote = 'DOWNVOTE',
  Neutral = 'NEUTRAL',
  Upvote = 'UPVOTE'
}

export enum ArticleReplyStatusEnum {
  /** Created by a blocked user violating terms of use. */
  Blocked = 'BLOCKED',
  Deleted = 'DELETED',
  Normal = 'NORMAL'
}

/** The linkage between an Article and a Reply */
export type ArticleReply = {
  __typename?: 'ArticleReply';
  appId: Scalars['String'];
  article?: Maybe<Article>;
  articleId?: Maybe<Scalars['String']>;
  canUpdateStatus?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  feedbackCount?: Maybe<Scalars['Int']>;
  feedbacks?: Maybe<Array<Maybe<ArticleReplyFeedback>>>;
  negativeFeedbackCount?: Maybe<Scalars['Int']>;
  /** The feedback of current user. null when not logged in or not voted yet. */
  ownVote?: Maybe<FeedbackVote>;
  positiveFeedbackCount?: Maybe<Scalars['Int']>;
  reply?: Maybe<Reply>;
  replyId?: Maybe<Scalars['String']>;
  /** Cached reply type value stored in ArticleReply */
  replyType?: Maybe<ReplyTypeEnum>;
  status?: Maybe<ArticleReplyStatusEnum>;
  updatedAt?: Maybe<Scalars['String']>;
  /** The user who conencted this reply and this article. */
  user?: Maybe<User>;
  userId: Scalars['String'];
};


/** The linkage between an Article and a Reply */
export type ArticleReplyFeedbacksArgs = {
  statuses?: InputMaybe<Array<ArticleReplyFeedbackStatusEnum>>;
};

export enum ArticleReplyFeedbackStatusEnum {
  /** Created by a blocked user violating terms of use. */
  Blocked = 'BLOCKED',
  Normal = 'NORMAL'
}

/** User feedback to an ArticleReply */
export type ArticleReplyFeedback = Node & {
  __typename?: 'ArticleReplyFeedback';
  appId?: Maybe<Scalars['String']>;
  /** The scored article-reply's article */
  article?: Maybe<Article>;
  /** The scored article-reply */
  articleReply?: Maybe<ArticleReply>;
  /** User ID of the article-reply's author */
  articleReplyUserId: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** The scored article-reply's reply */
  reply?: Maybe<Reply>;
  /** User ID of the reply's author */
  replyUserId: Scalars['String'];
  /**
   * One of 1, 0 and -1. Representing upvote, neutral and downvote, respectively
   * @deprecated Use vote instead
   */
  score?: Maybe<Scalars['Int']>;
  status: ArticleReplyFeedbackStatusEnum;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']>;
  /** User's vote on the articleReply */
  vote?: Maybe<FeedbackVote>;
};

export type Reply = Node & {
  __typename?: 'Reply';
  articleReplies?: Maybe<Array<Maybe<ArticleReply>>>;
  createdAt?: Maybe<Scalars['String']>;
  /** Hyperlinks in reply text or reference. May be empty array if no URLs are included. `null` when hyperlinks are still fetching. */
  hyperlinks?: Maybe<Array<Maybe<Hyperlink>>>;
  id: Scalars['ID'];
  reference?: Maybe<Scalars['String']>;
  /** Replies that has similar text or references of this current reply */
  similarReplies?: Maybe<ReplyConnection>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<ReplyTypeEnum>;
  /** The user submitted this reply version */
  user?: Maybe<User>;
};


export type ReplyArticleRepliesArgs = {
  status?: InputMaybe<ArticleReplyStatusEnum>;
  statuses?: InputMaybe<Array<ArticleReplyStatusEnum>>;
};


export type ReplySimilarRepliesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<InputMaybe<SimilarReplyOrderBy>>>;
};

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type SimilarReplyOrderBy = {
  _score?: InputMaybe<SortOrderEnum>;
  createdAt?: InputMaybe<SortOrderEnum>;
};

export type ReplyConnection = Connection & {
  __typename?: 'ReplyConnection';
  edges: Array<ReplyConnectionEdge>;
  pageInfo: ReplyConnectionPageInfo;
  /** The total count of the entire collection, regardless of "before", "after". */
  totalCount: Scalars['Int'];
};

export type ReplyConnectionEdge = Edge & {
  __typename?: 'ReplyConnectionEdge';
  cursor: Scalars['String'];
  highlight?: Maybe<Highlights>;
  node: Reply;
  score?: Maybe<Scalars['Float']>;
};

export type ReplyConnectionPageInfo = PageInfo & {
  __typename?: 'ReplyConnectionPageInfo';
  firstCursor?: Maybe<Scalars['String']>;
  lastCursor?: Maybe<Scalars['String']>;
};

/** Reflects how the replier categories the replied article. */
export enum ReplyTypeEnum {
  /** The replier thinks that the article is actually not a complete article on the internet or passed around in messengers. */
  NotArticle = 'NOT_ARTICLE',
  /** The replier thinks that the articles contains no false information. */
  NotRumor = 'NOT_RUMOR',
  /** The replier thinks that the article contains personal viewpoint and is not objective. */
  Opinionated = 'OPINIONATED',
  /** The replier thinks that the article contains false information. */
  Rumor = 'RUMOR'
}

export enum ArticleTypeEnum {
  Audio = 'AUDIO',
  Image = 'IMAGE',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export enum AttachmentVariantEnum {
  /** The original file. Only available to logged-in users. */
  Original = 'ORIGINAL',
  /** Downsized file. Fixed-width webp for images; other type TBD. */
  Preview = 'PREVIEW',
  /** Tiny, static image representing the attachment. Fixed-height jpeg for images; other types TBD. */
  Thumbnail = 'THUMBNAIL'
}

export type ArticleReference = {
  __typename?: 'ArticleReference';
  createdAt?: Maybe<Scalars['String']>;
  permalink?: Maybe<Scalars['String']>;
  type?: Maybe<ArticleReferenceTypeEnum>;
};

/** Where this article is collected from. */
export enum ArticleReferenceTypeEnum {
  /** The article is collected from conversations in LINE messengers. */
  Line = 'LINE',
  /** The article is collected from the Internet, with a link to the article available. */
  Url = 'URL'
}

export type RelatedArticleFilter = {
  replyCount?: InputMaybe<RangeInput>;
};

/** List only the entries whose field match the criteria. */
export type RangeInput = {
  EQ?: InputMaybe<Scalars['Int']>;
  GT?: InputMaybe<Scalars['Int']>;
  GTE?: InputMaybe<Scalars['Int']>;
  LT?: InputMaybe<Scalars['Int']>;
  LTE?: InputMaybe<Scalars['Int']>;
};

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type RelatedArticleOrderBy = {
  _score?: InputMaybe<SortOrderEnum>;
  updatedAt?: InputMaybe<SortOrderEnum>;
};

export type ArticleConnection = Connection & {
  __typename?: 'ArticleConnection';
  edges: Array<ArticleConnectionEdge>;
  pageInfo: ArticleConnectionPageInfo;
  /** The total count of the entire collection, regardless of "before", "after". */
  totalCount: Scalars['Int'];
};

export type ArticleConnectionEdge = Edge & {
  __typename?: 'ArticleConnectionEdge';
  cursor: Scalars['String'];
  highlight?: Maybe<Highlights>;
  node: Article;
  score?: Maybe<Scalars['Float']>;
};

export type ArticleConnectionPageInfo = PageInfo & {
  __typename?: 'ArticleConnectionPageInfo';
  firstCursor?: Maybe<Scalars['String']>;
  lastCursor?: Maybe<Scalars['String']>;
};

export enum ReplyRequestStatusEnum {
  /** Created by a blocked user violating terms of use. */
  Blocked = 'BLOCKED',
  Normal = 'NORMAL'
}

export type ReplyRequest = Node & {
  __typename?: 'ReplyRequest';
  appId?: Maybe<Scalars['String']>;
  article: Article;
  articleId: Scalars['ID'];
  createdAt?: Maybe<Scalars['String']>;
  feedbackCount?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  negativeFeedbackCount?: Maybe<Scalars['Int']>;
  /** The feedback of current user. null when not logged in or not voted yet. */
  ownVote?: Maybe<FeedbackVote>;
  positiveFeedbackCount?: Maybe<Scalars['Int']>;
  reason?: Maybe<Scalars['String']>;
  status: ReplyRequestStatusEnum;
  updatedAt?: Maybe<Scalars['String']>;
  /** The author of reply request. */
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']>;
};

export type Analytics = Node & {
  __typename?: 'Analytics';
  /** The day this analytic datapoint is represented, in YYYY-MM-DD format */
  date: Scalars['String'];
  /** Authoring app ID of the document that this analytic datapoint measures. */
  docAppId?: Maybe<Scalars['ID']>;
  /** The id for the document that this analytic datapoint is for. */
  docId: Scalars['ID'];
  /** Author of the document that this analytic datapoint measures. */
  docUserId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  liff: Array<AnalyticsLiffEntry>;
  /** Sum of LIFF visitor count from all sources */
  liffUser: Scalars['Int'];
  /** Sum of LIFF view count from all sources */
  liffVisit: Scalars['Int'];
  lineUser?: Maybe<Scalars['Int']>;
  lineVisit?: Maybe<Scalars['Int']>;
  /** Type of document that this analytic datapoint is for. */
  type: AnalyticsDocTypeEnum;
  webUser?: Maybe<Scalars['Int']>;
  webVisit?: Maybe<Scalars['Int']>;
};

export type AnalyticsLiffEntry = {
  __typename?: 'AnalyticsLiffEntry';
  /** utm_source for this LIFF stat entry. Empty string if not set. */
  source: Scalars['String'];
  user: Scalars['Int'];
  visit: Scalars['Int'];
};

export enum AnalyticsDocTypeEnum {
  Article = 'ARTICLE',
  Reply = 'REPLY'
}

export type ListAiResponsesFilter = {
  /** Show only AI responses created by a specific app. */
  appId?: InputMaybe<Scalars['String']>;
  /** List only the AI responses that were created between the specific time range. */
  createdAt?: InputMaybe<TimeRangeInput>;
  /** If specified, only return AI repsonses under the specified doc IDs. */
  docIds?: InputMaybe<Array<Scalars['ID']>>;
  /** If given, only list out AI responses with specific IDs */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  /** Only list the AI responses created by the currently logged in user */
  selfOnly?: InputMaybe<Scalars['Boolean']>;
  /** If specified, only return AI repsonses under the specified statuses. */
  statuses?: InputMaybe<Array<AiResponseStatusEnum>>;
  /** If specified, only return AI repsonses with the specified types. */
  types?: InputMaybe<Array<AiResponseTypeEnum>>;
  /** List only the AI responses updated within the specific time range. */
  updatedAt?: InputMaybe<TimeRangeInput>;
  /** Show only AI responses created by the specific user. */
  userId?: InputMaybe<Scalars['String']>;
  /** Show only AI responses created by the specified users. */
  userIds?: InputMaybe<Array<Scalars['String']>>;
};

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type ListAiResponsesOrderBy = {
  createdAt?: InputMaybe<SortOrderEnum>;
  updatedAt?: InputMaybe<SortOrderEnum>;
};

export type AiResponseConnection = Connection & {
  __typename?: 'AIResponseConnection';
  edges: Array<AiResponseConnectionEdge>;
  pageInfo: AiResponseConnectionPageInfo;
  /** The total count of the entire collection, regardless of "before", "after". */
  totalCount: Scalars['Int'];
};

export type AiResponseConnectionEdge = Edge & {
  __typename?: 'AIResponseConnectionEdge';
  cursor: Scalars['String'];
  highlight?: Maybe<Highlights>;
  node: AiResponse;
  score?: Maybe<Scalars['Float']>;
};

export type AiResponseConnectionPageInfo = PageInfo & {
  __typename?: 'AIResponseConnectionPageInfo';
  firstCursor?: Maybe<Scalars['String']>;
  lastCursor?: Maybe<Scalars['String']>;
};

export type ListAnalyticsFilter = {
  /** List only the activities between the specific time range. */
  date?: InputMaybe<TimeRangeInput>;
  docAppId?: InputMaybe<Scalars['ID']>;
  docId?: InputMaybe<Scalars['ID']>;
  docUserId?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<AnalyticsDocTypeEnum>;
};

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type ListAnalyticsOrderBy = {
  date?: InputMaybe<SortOrderEnum>;
};

export type AnalyticsConnection = Connection & {
  __typename?: 'AnalyticsConnection';
  edges: Array<AnalyticsConnectionEdge>;
  pageInfo: AnalyticsConnectionPageInfo;
  /** The total count of the entire collection, regardless of "before", "after". */
  totalCount: Scalars['Int'];
};

export type AnalyticsConnectionEdge = Edge & {
  __typename?: 'AnalyticsConnectionEdge';
  cursor: Scalars['String'];
  highlight?: Maybe<Highlights>;
  node: Analytics;
  score?: Maybe<Scalars['Float']>;
};

export type AnalyticsConnectionPageInfo = PageInfo & {
  __typename?: 'AnalyticsConnectionPageInfo';
  firstCursor?: Maybe<Scalars['String']>;
  lastCursor?: Maybe<Scalars['String']>;
};

export type ListArticleReplyFeedbackFilter = {
  /** Show only article reply feedbacks created by a specific app. */
  appId?: InputMaybe<Scalars['String']>;
  articleId?: InputMaybe<Scalars['String']>;
  /** List only the feedbacks to the article-replies created by this user ID */
  articleReplyUserId?: InputMaybe<Scalars['String']>;
  /** List only the feedbacks whose `replyUserId` *or* `articleReplyUserId` is this user ID */
  authorId?: InputMaybe<Scalars['String']>;
  /** List only the article reply feedbacks that were created between the specific time range. */
  createdAt?: InputMaybe<TimeRangeInput>;
  /** If given, only list out article reply feedbacks with specific IDs */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  /** Search for comment field using more_like_this query */
  moreLikeThis?: InputMaybe<MoreLikeThisInput>;
  replyId?: InputMaybe<Scalars['String']>;
  /** List only the feedbacks to the replies created by this user ID */
  replyUserId?: InputMaybe<Scalars['String']>;
  /** Only list the article reply feedbacks created by the currently logged in user */
  selfOnly?: InputMaybe<Scalars['Boolean']>;
  /** List only the article reply feedbacks with the selected statuses */
  statuses?: InputMaybe<Array<ArticleReplyFeedbackStatusEnum>>;
  /** List only the article reply feedbacks that were last updated within the specific time range. */
  updatedAt?: InputMaybe<TimeRangeInput>;
  /** Show only article reply feedbacks created by the specific user. */
  userId?: InputMaybe<Scalars['String']>;
  /** Show only article reply feedbacks created by the specified users. */
  userIds?: InputMaybe<Array<Scalars['String']>>;
  /** When specified, list only article reply feedbacks with specified vote */
  vote?: InputMaybe<Array<InputMaybe<FeedbackVote>>>;
};

/**
 * Parameters for Elasticsearch more_like_this query.
 * See: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html
 */
export type MoreLikeThisInput = {
  /** The text string to search for. */
  like?: InputMaybe<Scalars['String']>;
  /**
   * more_like_this query's "minimum_should_match" query param.
   * See https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-minimum-should-match.html for possible values.
   */
  minimumShouldMatch?: InputMaybe<Scalars['String']>;
};

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type ListArticleReplyFeedbackOrderBy = {
  /** Full text relevance for comment field queries */
  _score?: InputMaybe<SortOrderEnum>;
  createdAt?: InputMaybe<SortOrderEnum>;
  updatedAt?: InputMaybe<SortOrderEnum>;
  vote?: InputMaybe<SortOrderEnum>;
};

export type ListArticleReplyFeedbackConnection = Connection & {
  __typename?: 'ListArticleReplyFeedbackConnection';
  edges: Array<ListArticleReplyFeedbackConnectionEdge>;
  pageInfo: ListArticleReplyFeedbackConnectionPageInfo;
  /** The total count of the entire collection, regardless of "before", "after". */
  totalCount: Scalars['Int'];
};

export type ListArticleReplyFeedbackConnectionEdge = Edge & {
  __typename?: 'ListArticleReplyFeedbackConnectionEdge';
  cursor: Scalars['String'];
  highlight?: Maybe<Highlights>;
  node: ArticleReplyFeedback;
  score?: Maybe<Scalars['Float']>;
};

export type ListArticleReplyFeedbackConnectionPageInfo = PageInfo & {
  __typename?: 'ListArticleReplyFeedbackConnectionPageInfo';
  firstCursor?: Maybe<Scalars['String']>;
  lastCursor?: Maybe<Scalars['String']>;
};

export type ListArticleFilter = {
  /** Show only articles created by a specific app. */
  appId?: InputMaybe<Scalars['String']>;
  /** Show only articles with(out) article replies created by specified user */
  articleRepliesFrom?: InputMaybe<UserAndExistInput>;
  /** Show articles with article replies matching this criteria */
  articleReply?: InputMaybe<ArticleReplyFilterInput>;
  /** List the articles with certain types */
  articleTypes?: InputMaybe<Array<InputMaybe<ArticleTypeEnum>>>;
  /** List only the articles whose number of categories match the criteria. */
  categoryCount?: InputMaybe<RangeInput>;
  /** List only articles that match any of the specified categories.ArticleCategories that are deleted or has more negative feedbacks than positive ones are not taken into account. */
  categoryIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** List only the articles that were created between the specific time range. */
  createdAt?: InputMaybe<TimeRangeInput>;
  /** Specify an articleId here to show only articles from the sender of that specified article. */
  fromUserOfArticleId?: InputMaybe<Scalars['String']>;
  /**
   *
   *             When true, return only articles with any article replies that has more positive feedback than negative.
   *             When false, return articles with none of its article replies that has more positive feedback, including those with no replies yet.
   *             In both scenario, deleted article replies are not taken into account.
   *
   */
  hasArticleReplyWithMorePositiveFeedback?: InputMaybe<Scalars['Boolean']>;
  /** If given, only list out articles with specific IDs */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  /** Show the media article similar to the input url */
  mediaUrl?: InputMaybe<Scalars['String']>;
  /** List all articles related to a given string. */
  moreLikeThis?: InputMaybe<MoreLikeThisInput>;
  /** [Deprecated] use articleReply filter instead. List only the articles that were replied between the specific time range. */
  repliedAt?: InputMaybe<TimeRangeInput>;
  /** List only the articles whose number of replies matches the criteria. */
  replyCount?: InputMaybe<RangeInput>;
  /** List only the articles whose number of replies matches the criteria. */
  replyRequestCount?: InputMaybe<RangeInput>;
  /** [Deprecated] use articleReply filter instead. List the articles with replies of certain types */
  replyTypes?: InputMaybe<Array<InputMaybe<ReplyTypeEnum>>>;
  /** Only list the articles created by the currently logged in user */
  selfOnly?: InputMaybe<Scalars['Boolean']>;
  /** Returns only articles with the specified statuses */
  statuses?: InputMaybe<Array<ArticleStatusEnum>>;
  /** Show only articles created by the specific user. */
  userId?: InputMaybe<Scalars['String']>;
  /** Show only articles created by the specified users. */
  userIds?: InputMaybe<Array<Scalars['String']>>;
};

export type UserAndExistInput = {
  /**
   *
   *                   When true (or not specified), return only entries with the specified user's involvement.
   *                   When false, return only entries that the specified user did not involve.
   *
   */
  exists?: InputMaybe<Scalars['Boolean']>;
  userId: Scalars['String'];
};

export type ArticleReplyFilterInput = {
  /** Show only articleReplies created by a specific app. */
  appId?: InputMaybe<Scalars['String']>;
  /** List only the articleReplies that were created between the specific time range. */
  createdAt?: InputMaybe<TimeRangeInput>;
  replyTypes?: InputMaybe<Array<InputMaybe<ReplyTypeEnum>>>;
  /** Only list the articleReplies created by the currently logged in user */
  selfOnly?: InputMaybe<Scalars['Boolean']>;
  statuses?: InputMaybe<Array<ArticleReplyStatusEnum>>;
  /** Show only articleReplies created by the specific user. */
  userId?: InputMaybe<Scalars['String']>;
  /** Show only articleReplies created by the specified users. */
  userIds?: InputMaybe<Array<Scalars['String']>>;
};

export enum ArticleStatusEnum {
  /** Created by a blocked user violating terms of use. */
  Blocked = 'BLOCKED',
  Normal = 'NORMAL'
}

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type ListArticleOrderBy = {
  _score?: InputMaybe<SortOrderEnum>;
  createdAt?: InputMaybe<SortOrderEnum>;
  lastMatchingArticleReplyCreatedAt?: InputMaybe<SortOrderEnum>;
  lastRepliedAt?: InputMaybe<SortOrderEnum>;
  lastRequestedAt?: InputMaybe<SortOrderEnum>;
  replyCount?: InputMaybe<SortOrderEnum>;
  replyRequestCount?: InputMaybe<SortOrderEnum>;
  updatedAt?: InputMaybe<SortOrderEnum>;
};

export type ListBlockedUsersFilter = {
  /** List only the blocked users that were registered between the specific time range. */
  createdAt?: InputMaybe<TimeRangeInput>;
};

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type ListBlockedUsersOrderBy = {
  createdAt?: InputMaybe<SortOrderEnum>;
};

export type UserConnection = Connection & {
  __typename?: 'UserConnection';
  edges: Array<UserConnectionEdge>;
  pageInfo: UserConnectionPageInfo;
  /** The total count of the entire collection, regardless of "before", "after". */
  totalCount: Scalars['Int'];
};

export type UserConnectionEdge = Edge & {
  __typename?: 'UserConnectionEdge';
  cursor: Scalars['String'];
  highlight?: Maybe<Highlights>;
  node: User;
  score?: Maybe<Scalars['Float']>;
};

export type UserConnectionPageInfo = PageInfo & {
  __typename?: 'UserConnectionPageInfo';
  firstCursor?: Maybe<Scalars['String']>;
  lastCursor?: Maybe<Scalars['String']>;
};

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type ListCategoryOrderBy = {
  createdAt?: InputMaybe<SortOrderEnum>;
};

export type ListCategoryConnection = Connection & {
  __typename?: 'ListCategoryConnection';
  edges: Array<ListCategoryConnectionEdge>;
  pageInfo: ListCategoryConnectionPageInfo;
  /** The total count of the entire collection, regardless of "before", "after". */
  totalCount: Scalars['Int'];
};

export type ListCategoryConnectionEdge = Edge & {
  __typename?: 'ListCategoryConnectionEdge';
  cursor: Scalars['String'];
  highlight?: Maybe<Highlights>;
  node: Category;
  score?: Maybe<Scalars['Float']>;
};

export type ListCategoryConnectionPageInfo = PageInfo & {
  __typename?: 'ListCategoryConnectionPageInfo';
  firstCursor?: Maybe<Scalars['String']>;
  lastCursor?: Maybe<Scalars['String']>;
};

export type ListReplyFilter = {
  /** Show only replies created by a specific app. */
  appId?: InputMaybe<Scalars['String']>;
  /** List only the replies that were created between the specific time range. */
  createdAt?: InputMaybe<TimeRangeInput>;
  /** If given, only list out replies with specific IDs */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  moreLikeThis?: InputMaybe<MoreLikeThisInput>;
  /** Only list the replies created by the currently logged in user */
  selfOnly?: InputMaybe<Scalars['Boolean']>;
  /** [Deprecated] use types instead. */
  type?: InputMaybe<ReplyTypeEnum>;
  /** List the replies of certain types */
  types?: InputMaybe<Array<InputMaybe<ReplyTypeEnum>>>;
  /** Show only replies created by the specific user. */
  userId?: InputMaybe<Scalars['String']>;
  /** Show only replies created by the specified users. */
  userIds?: InputMaybe<Array<Scalars['String']>>;
};

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type ListReplyOrderBy = {
  _score?: InputMaybe<SortOrderEnum>;
  createdAt?: InputMaybe<SortOrderEnum>;
};

export type ListReplyRequestFilter = {
  /** Show only reply requests created by a specific app. */
  appId?: InputMaybe<Scalars['String']>;
  articleId?: InputMaybe<Scalars['String']>;
  /** List only the reply requests that were created between the specific time range. */
  createdAt?: InputMaybe<TimeRangeInput>;
  /** If given, only list out reply requests with specific IDs */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  /** Only list the reply requests created by the currently logged in user */
  selfOnly?: InputMaybe<Scalars['Boolean']>;
  /** List only reply requests with specified statuses */
  statuses?: InputMaybe<Array<ReplyRequestStatusEnum>>;
  /** Show only reply requests created by the specific user. */
  userId?: InputMaybe<Scalars['String']>;
  /** Show only reply requests created by the specified users. */
  userIds?: InputMaybe<Array<Scalars['String']>>;
};

/** An entry of orderBy argument. Specifies field name and the sort order. Only one field name is allowd per entry. */
export type ListReplyRequestOrderBy = {
  createdAt?: InputMaybe<SortOrderEnum>;
  vote?: InputMaybe<SortOrderEnum>;
};

export type ListReplyRequestConnection = Connection & {
  __typename?: 'ListReplyRequestConnection';
  edges: Array<ListReplyRequestConnectionEdge>;
  pageInfo: ListReplyRequestConnectionPageInfo;
  /** The total count of the entire collection, regardless of "before", "after". */
  totalCount: Scalars['Int'];
};

export type ListReplyRequestConnectionEdge = Edge & {
  __typename?: 'ListReplyRequestConnectionEdge';
  cursor: Scalars['String'];
  highlight?: Maybe<Highlights>;
  node: ReplyRequest;
  score?: Maybe<Scalars['Float']>;
};

export type ListReplyRequestConnectionPageInfo = PageInfo & {
  __typename?: 'ListReplyRequestConnectionPageInfo';
  firstCursor?: Maybe<Scalars['String']>;
  lastCursor?: Maybe<Scalars['String']>;
};

export type ValidationResult = {
  __typename?: 'ValidationResult';
  error?: Maybe<SlugErrorEnum>;
  success: Scalars['Boolean'];
};

/** Slug of canot */
export enum SlugErrorEnum {
  /** Slug is empty */
  Empty = 'EMPTY',
  /** Slug has URI component inside, which can be misleading to browsers */
  HasUriComponent = 'HAS_URI_COMPONENT',
  /** Slug have leading or trailing spaces or line ends */
  NotTrimmed = 'NOT_TRIMMED',
  /** Slug has already been taken by someone else */
  Taken = 'TAKEN'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Create an AI reply for a specific article. If existed, returns an existing one. If information in the article is not sufficient for AI, return null. */
  CreateAIReply?: Maybe<AiReply>;
  /** Create an article and/or a replyRequest */
  CreateArticle?: Maybe<MutationResult>;
  /** Adds specified category to specified article. */
  CreateArticleCategory?: Maybe<Array<Maybe<ArticleCategory>>>;
  /** Connects specified reply and specified article. */
  CreateArticleReply?: Maybe<Array<Maybe<ArticleReply>>>;
  /** Create a category */
  CreateCategory?: Maybe<MutationResult>;
  /** Create a media article and/or a replyRequest */
  CreateMediaArticle?: Maybe<MutationResult>;
  /** Create or update a feedback on an article-category connection */
  CreateOrUpdateArticleCategoryFeedback?: Maybe<ArticleCategory>;
  /** Create or update a feedback on an article-reply connection */
  CreateOrUpdateArticleReplyFeedback?: Maybe<ArticleReply>;
  /** Create or update a reply request for the given article */
  CreateOrUpdateReplyRequest?: Maybe<Article>;
  /** Create or update a feedback on a reply request reason */
  CreateOrUpdateReplyRequestFeedback?: Maybe<ReplyRequest>;
  /** Create a reply that replies to the specified article. */
  CreateReply?: Maybe<MutationResult>;
  /**
   * Create or update a reply request for the given article
   * @deprecated Use CreateOrUpdateReplyRequest instead
   */
  CreateReplyRequest?: Maybe<Article>;
  /** Change status of specified articleCategory */
  UpdateArticleCategoryStatus?: Maybe<Array<Maybe<ArticleCategory>>>;
  /** Change status of specified articleReplies */
  UpdateArticleReplyStatus?: Maybe<Array<Maybe<ArticleReply>>>;
  /** Change attribute of a user */
  UpdateUser?: Maybe<User>;
};


export type MutationCreateAiReplyArgs = {
  articleId: Scalars['String'];
};


export type MutationCreateArticleArgs = {
  reason?: InputMaybe<Scalars['String']>;
  reference: ArticleReferenceInput;
  text: Scalars['String'];
};


export type MutationCreateArticleCategoryArgs = {
  aiConfidence?: InputMaybe<Scalars['Float']>;
  aiModel?: InputMaybe<Scalars['String']>;
  articleId: Scalars['String'];
  categoryId: Scalars['String'];
};


export type MutationCreateArticleReplyArgs = {
  articleId: Scalars['String'];
  replyId: Scalars['String'];
};


export type MutationCreateCategoryArgs = {
  description: Scalars['String'];
  title: Scalars['String'];
};


export type MutationCreateMediaArticleArgs = {
  articleType: ArticleTypeEnum;
  mediaUrl: Scalars['String'];
  reason?: InputMaybe<Scalars['String']>;
  reference: ArticleReferenceInput;
};


export type MutationCreateOrUpdateArticleCategoryFeedbackArgs = {
  articleId: Scalars['String'];
  categoryId: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
  vote: FeedbackVote;
};


export type MutationCreateOrUpdateArticleReplyFeedbackArgs = {
  articleId: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
  replyId: Scalars['String'];
  vote: FeedbackVote;
};


export type MutationCreateOrUpdateReplyRequestArgs = {
  articleId: Scalars['String'];
  reason?: InputMaybe<Scalars['String']>;
};


export type MutationCreateOrUpdateReplyRequestFeedbackArgs = {
  replyRequestId: Scalars['String'];
  vote: FeedbackVote;
};


export type MutationCreateReplyArgs = {
  articleId: Scalars['String'];
  reference?: InputMaybe<Scalars['String']>;
  text: Scalars['String'];
  type: ReplyTypeEnum;
  waitForHyperlinks?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateReplyRequestArgs = {
  articleId: Scalars['String'];
  reason?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateArticleCategoryStatusArgs = {
  articleId: Scalars['String'];
  categoryId: Scalars['String'];
  status: ArticleCategoryStatusEnum;
};


export type MutationUpdateArticleReplyStatusArgs = {
  articleId: Scalars['String'];
  replyId: Scalars['String'];
  status: ArticleReplyStatusEnum;
};


export type MutationUpdateUserArgs = {
  avatarData?: InputMaybe<Scalars['String']>;
  avatarType?: InputMaybe<AvatarTypeEnum>;
  bio?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type ArticleReferenceInput = {
  permalink?: InputMaybe<Scalars['String']>;
  type: ArticleReferenceTypeEnum;
};

export type MutationResult = {
  __typename?: 'MutationResult';
  id?: Maybe<Scalars['String']>;
};

export type HighlightFieldsFragment = { __typename?: 'Highlights', text?: string | null, reference?: string | null, hyperlinks?: Array<{ __typename?: 'Hyperlink', title?: string | null, summary?: string | null } | null> | null } & { ' $fragmentName'?: 'HighlightFieldsFragment' };

export const HighlightFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Highlights"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"hyperlinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]}}]} as unknown as DocumentNode<HighlightFieldsFragment, unknown>;