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

  handleKeywordChange = e => {
    const { value } = e.target;
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
