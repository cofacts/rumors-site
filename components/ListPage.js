import React from 'react';
import Router from 'next/router';
import url from 'url';

// Super class for list pages
//
export default class ListPage extends React.Component {
  handleOrderByChange = e => {
    Router.push(
      `${location.pathname}${url.format({
        query: {
          ...this.props.query,
          orderBy: e.target.value,
          before: undefined,
          after: undefined,
        },
      })}`
    );
  };

  handleFilterChange = value => {
    Router.push(
      `${location.pathname}${url.format({
        query: {
          ...this.props.query,
          filter: value,
          before: undefined,
          after: undefined,
        },
      })}`
    );
  };

  handleKeywordChange = e => {
    const { value } = e.target;
    Router.push(
      `${location.pathname}${url.format({
        query: {
          ...this.props.query,
          q: value,
          before: undefined,
          after: undefined,
        },
      })}`
    );
  };

  handleKeywordKeyup = e => {
    if (e.which === 13) {
      return this.handleKeywordChange(e);
    }
  };
}
