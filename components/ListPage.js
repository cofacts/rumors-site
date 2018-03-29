import React from 'react';
import Router from 'next/router';
import url from 'url';

// Super class for list pages
//
export default class ListPage extends React.Component {
  goToQuery = (newQuery, resetPage = true) => {
    const resetObj = resetPage
      ? {
          before: undefined,
          after: undefined,
        }
      : {};

    Router.push(
      `${location.pathname}${url.format({
        query: {
          ...this.props.query,
          ...resetObj,
          ...newQuery,
        },
      })}`
    );
  };

  handleOrderByChange = e => {
    this.goToQuery({
      orderBy: e.target.value,
    });
  };

  handleFilterChange = value => {
    this.goToQuery({
      filter: value,
    });
  };

  handleSearchByArticleIdChange = e => {
    const { searchUserByArticleId = '' } = this.props.query;
    const { value } = e.target;
    if (searchUserByArticleId === value) return;
    this.goToQuery({
      searchUserByArticleId: value,
    });
  };

  handleKeywordChange = e => {
    const { q = '' } = this.props.query;
    const { value } = e.target;
    if (q === value) return;
    this.goToQuery({
      q: value,
    });
  };

  handleKeywordKeyup = e => {
    if (e.which === 13) {
      e.target.blur(); // Triggers onBlur
    }
  };
}
