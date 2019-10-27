/* eslint-disable react/display-name */
// https://github.com/yannickcr/eslint-plugin-react/issues/1200

import React from 'react';
import Head from 'next/head';
import { t, ngettext, msgid } from 'ttag';
import url from 'url';
import Router from 'next/router';

import { TYPE_NAME, TYPE_DESC } from '../constants/replyType';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import SortIcon from '@material-ui/icons/Sort';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import withData from 'lib/apollo';
import AppLayout from 'components/AppLayout';
import ArticleItem from 'components/ArticleItem';
import Pagination from 'components/Pagination';
import SearchInput from 'components/SearchInput';

const DEFAULT_ORDER_BY = 'createdAt_DESC';
const DEFAULT_TYPE_FILTER = 'all';

/**
 * @param {object} urlQuery - URL query object
 * @returns {object} ListReplyFilter
 */
function urlQuery2Filter({ filter = DEFAULT_TYPE_FILTER, q, mine } = {}) {
  const filterObj = {};
  if (q) {
    filterObj.moreLikeThis = { like: q, minimumShouldMatch: '0' };
  }

  if (filter && filter !== 'all') {
    filterObj.type === filter;
  }

  if (mine) {
    filterObj.selfOnly = true;
  }

  // Return filterObj only when it is populated.
  if (!Object.keys(filterObj).length) {
    return undefined;
  }

  return filterObj;
}

/**
 * @param {object} urlQuery - URL query object
 * @returns {object[]} ListArticleOrderBy array
 */
function urlQuery2OrderBy({ q, orderBy = DEFAULT_ORDER_BY } = {}) {
  const [orderByItem, order] = orderBy.split('_');

  // If there is query text, sort by _score first

  if (q) {
    return [{ _score: 'DESC' }, { [orderByItem]: order }];
  }

  return [{ [orderByItem]: order }];
}

/**
 * @param {object} urlQuery
 */
function goToUrlQueryAndResetPagination(urlQuery) {
  delete urlQuery.before;
  delete urlQuery.after;
  Router.push(`${location.pathname}${url.format({ query: urlQuery })}`);
}

function ReplyFilter({ filter = DEFAULT_TYPE_FILTER, onChange = () => {} }) {
  return (
    <ButtonGroup size="small" variant="outlined">
      <Button disabled={filter === 'all'} onClick={() => onChange('all')}>
        {t`All replies`}
      </Button>
      {['NOT_ARTICLE', 'OPINIONATED', 'NOT_RUMOR', 'RUMOR'].map(type => (
        <Button
          key={type}
          disabled={filter === type}
          onClick={() => onChange(type)}
          title={TYPE_DESC[type]}
        >
          {TYPE_NAME[type]}
        </Button>
      ))}
    </ButtonGroup>
  );
}

function SortInput({ orderBy = DEFAULT_ORDER_BY, onChange = () => {} }) {
  return (
    <TextField
      label={t`Sort by`}
      select
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SortIcon />
          </InputAdornment>
        ),
      }}
      value={orderBy}
      onChange={e => onChange(e.target.value)}
    >
      <MenuItem value="createdAt_DESC">{t`Most recently written`}</MenuItem>
      <MenuItem value="createdAt_ASC">{t`Least recently written`}</MenuItem>
    </TextField>
  );
}

function ReplyListPage({ query }) {
  const listQueryVars = {
    filter: urlQuery2Filter(query),
    orderBy: urlQuery2OrderBy(query),
  };

  // const {
  //   loading,
  //   data: { ListReplies: replyData },
  // } = useQuery(LIST_REPLIES, {
  //   variables: {
  //     ...listQueryVars,
  //     before: query.before,
  //     after: query.after,
  //   },
  // });

  // Separate these stats query so that it will be cached by apollo-client and sends no network request
  // on page change, but still works when filter options are updated.
  //
  // const {
  //   loading: statsLoading,
  //   data: { ListArticles: statsData },
  // } = useQuery(LIST_STAT, {
  //   variables: listQueryVars,
  // });

  return (
    <AppLayout>
      <Grid container spacing={2}>
        <Grid item>
          <ReplyFilter
            filter={query.filter}
            onChange={filter =>
              goToUrlQueryAndResetPagination({ ...query, filter })
            }
          />
        </Grid>
        <Grid item>
          <SearchInput
            q={query.q}
            onChange={q => goToUrlQueryAndResetPagination({ ...query, q })}
          />
        </Grid>
      </Grid>
      <FormControlLabel
        control={
          <Checkbox
            checked={query.mine}
            onChange={e =>
              goToUrlQueryAndResetPagination({
                ...query,
                mine: e.target.checked ? 1 : undefined,
              })
            }
          />
        }
        label={t`Only show replies written by me`}
      />
      <div>
        {query.q ? (
          t`Sort by Relevance`
        ) : (
          <SortInput
            orderBy={query.orderBy}
            onChange={orderBy =>
              goToUrlQueryAndResetPagination({ ...query, orderBy })
            }
          />
        )}
      </div>

      {/* <p>
        {statsLoading
          ? 'Loading...'
          : ngettext(
              msgid`${statsData.totalCount} collected message`,
              `${statsData.totalCount} collected messages`,
              statsData.totalCount
            )}
      </p> */}

      {/* {loading ? (
        'Loading....'
      ) : (
        <>
          <Pagination
            query={query}
            pageInfo={statsData?.pageInfo}
            edges={replyData?.edges}
          />
          <ul className="reply-list">
            {replyData.edges.map(({ node }) => (
              <ReplyItem key={node.id} reply={node} showUser={query.mine} />
            ))}
          </ul>
          <Pagination
            query={query}
            pageInfo={statsData?.pageInfo}
            edges={replyData?.edges}
          />
        </>
      )} */}

      <style jsx>
        {`
          .reply-list {
            padding: 0;
            list-style: none;
          }
        `}
      </style>
    </AppLayout>
  );
}

// Expose path query to component
ReplyListPage.getInitialProps = ({ query }) => ({ query });

export default withData(ReplyListPage);

// class ReplyList extends ListPage {
//   static async getInitialProps({ store, query, isServer }) {
//     // Load on server-side render only when query.mine is not set.
//     // This makes sure that reply list can be crawled by search engines too, and it can load fast
//     if (query.mine && isServer) return;
//     await store.dispatch(load(query));
//     return { query };
//   }

//   componentDidMount() {
//     const { query, dispatch } = this.props;

//     // Pick up initial data loading when server-side render skips
//     if (!query.mine) return;
//     return dispatch(load(query));
//   }

//   handleMyReplyOnlyCheck = e => {
//     this.goToQuery({
//       mine: e.target.checked ? 1 : undefined,
//     });
//   };

//   renderSearch = () => {
//     const {
//       query: { q },
//     } = this.props;
//     return (
//       <label>
//         Search For:
//         <input
//           type="search"
//           onBlur={this.handleKeywordChange}
//           onKeyUp={this.handleKeywordKeyup}
//           defaultValue={q}
//         />
//       </label>
//     );
//   };

//   renderOrderBy = () => {
//     const {
//       query: { orderBy, q },
//     } = this.props;
//     if (q) {
//       return <span> Relevance</span>;
//     }

//     return (
//       <select
//         onChange={this.handleOrderByChange}
//         value={orderBy || 'createdAt_DESC'}
//       >
//         <option value="createdAt_DESC">Most recently written</option>
//         <option value="createdAt_ASC">Least recently written</option>
//       </select>
//     );
//   };

//   renderMyReplyOnlyCheckbox() {
//     const {
//       isLoggedIn,
//       query: { mine },
//     } = this.props;
//     if (!isLoggedIn) return null;

//     return (
//       <label>
//         <input
//           type="checkbox"
//           onChange={this.handleMyReplyOnlyCheck}
//           checked={!!mine}
//         />
//         只顯示我寫的
//       </label>
//     );
//   }

//   renderFilter = () => {
//     const {
//       query: { filter },
//     } = this.props;
//     return (
//       <RadioGroup
//         onChange={this.handleFilterChange}
//         selectedValue={filter || 'all'}
//         Component="ul"
//       >
//         <li>
//           <label>
//             <Radio value="all" />All
//           </label>
//         </li>
//         {['NOT_ARTICLE', 'OPINIONATED', 'NOT_RUMOR', 'RUMOR'].map(type => (
//           <li key={type}>
//             <label>
//               <Radio value={type} title={TYPE_DESC[type]} />
//               {TYPE_NAME[type]}
//             </label>
//           </li>
//         ))}
//       </RadioGroup>
//     );
//   };

//   renderPagination = () => {
//     const {
//       query = {}, // URL params
//       firstCursor,
//       lastCursor,
//       firstCursorOfPage,
//       lastCursorOfPage,
//     } = this.props;

//     return (
//       <Pagination
//         query={query}
//         firstCursor={firstCursor}
//         lastCursor={lastCursor}
//         firstCursorOfPage={firstCursorOfPage}
//         lastCursorOfPage={lastCursorOfPage}
//       />
//     );
//   };

//   renderList = () => {
//     const {
//       replies = null,
//       totalCount,
//       query: { mine },
//     } = this.props;
//     return (
//       <div>
//         <p>{totalCount} replies</p>
//         {this.renderPagination()}
//         <div className="reply-list">
//           {replies.map(reply => (
//             <ReplyItem key={reply.get('id')} reply={reply} showUser={!mine} />
//           ))}
//         </div>
//         {this.renderPagination()}
//         <style jsx>{`
//           .reply-list {
//             padding: 0;
//           }
//         `}</style>
//       </div>
//     );
//   };

//   render() {
//     const { isLoading = false } = this.props;

//     return (
//       <AppLayout>
//         <main>
//           <Head>
//             <title>回應列表</title>
//           </Head>
//           <h2>回應列表</h2>
//           {this.renderSearch()}
//           <br />
//           Order By:
//           {this.renderOrderBy()}
//           {this.renderFilter()}
//           {this.renderMyReplyOnlyCheckbox()}
//           {isLoading ? <p>Loading...</p> : this.renderList()}
//           <style jsx>{mainStyle}</style>
//         </main>
//       </AppLayout>
//     );
//   }
// }

// function mapStateToProps({ replyList, auth }) {
//   return {
//     isLoggedIn: !!auth.get('user'),
//     isLoading: replyList.getIn(['state', 'isLoading']),
//     replies: (replyList.get('edges') || List()).map(edge => edge.get('node')),
//     totalCount: replyList.get('totalCount'),
//     firstCursor: replyList.get('firstCursor'),
//     lastCursor: replyList.get('lastCursor'),
//     firstCursorOfPage: replyList.getIn(['edges', 0, 'cursor']),
//     lastCursorOfPage: replyList.getIn(['edges', -1, 'cursor']),
//   };
// }

// export default connect(mapStateToProps)(ReplyList);
