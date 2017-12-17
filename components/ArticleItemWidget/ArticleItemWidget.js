import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';
import cx from 'classnames';

import gql from '../../util/gql';

import WidgetItem from './WidgetItem.js';
import NotArticleExtendSelection from './NotArticleExtendSelection.js';

// TODO: Click out for touch

const initialState = {
  barOpen: false,
  notArticleSelectionDisplay: false,
  hoverTargetName: false, // record the target now mouseEnter or touch(move!) over by dom id, not touch start.
};

export default class ArticleItemWidget extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired, // Article ID
    read: PropTypes.bool.isRequired,
    notArticleReplied: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string, // TYPE_SUGGESTION_OPTIONS in replyType.js
    ]),
    onChange: PropTypes.func.isRequired,
  };

  state = initialState;

  componentDidMount = () => {
    this.preventMobileMenuLongPress();
  };

  preventMobileMenuLongPress = () => {
    this.refWidget.addEventListener('contextmenu', event =>
      event.preventDefault()
    );
  };

  handleNotArticleReply = text => {
    const { id } = this.props;
    NProgress.start();
    gql`
      mutation(
        $articleId: String!
        $text: String!
        $type: ReplyTypeEnum!
        $reference: String
      ) {
        CreateReply(
          articleId: $articleId
          text: $text
          type: $type
          reference: $reference
        ) {
          id
        }
      }
    `({ articleId: id, type: 'NOT_ARTICLE', text }).then(() => {
      this.handleNotArticleSave(text);
      this.handleWidgetUIReset();
      NProgress.done();
    });
  };

  handleReadClick = event => {
    event && event.preventDefault();
    this.handleRead();
    this.handleWidgetUIReset();
  };

  handleNotArticleClick = () => {
    this.setState(({ notArticleSelectionDisplay }) => ({
      notArticleSelectionDisplay: !notArticleSelectionDisplay,
    }));
  };

  preventAll = event => {
    // stop event cascade (touchstart → touchend → mouseover → mousemove → mousedown → mouseup → click)
    event.preventDefault();
    // stop (child touchstart -> parent touchstart,... ) mainly for for parent a:link redirection,
    event.stopPropagation();
    return event;
  };

  // close widget bar and tags extend component
  handleWidgetUIReset = () => {
    this.setState(initialState);
  };

  handleBarOpen = () => {
    this.setState({
      barOpen: true,
      hoverTargetName: 'read', //for mobile, explain in onTouchMoveTip function
    });
  };

  handleTagHover = event => {
    const name = event.currentTarget.attributes['name'].value;
    this.setState({
      hoverTargetName: name,
    });
  };

  handleTagUnHover = () => {
    this.setState({
      hoverTargetName: false,
    });
  };

  /**
   * since the touch start event can only trigger when the finger down at the first tag,
   * so it's hard to done with like mouse enter/leave strategy
   * then I use onTouchMove to dynamic check which tag was touch over
   */
  handleBarTouchMove = event => {
    var changedTouch = event.changedTouches[0];
    var elem = document.elementFromPoint(
      changedTouch.clientX,
      changedTouch.clientY
    );
    try {
      var target_name = elem.attributes['name'].value;
      target_name &&
        this.setState({
          hoverTargetName: target_name,
        });
    } catch (error) {
      // touch move not on the widget tag
    }
  };

  // trigger the onClick function in tags config, when finger touch end with tag elm
  handleBarTouchEnd = event => {
    this.preventAll(event);
    switch (this.state.hoverTargetName) {
      case 'read':
        return this.handleReadClick();
      case 'notArticle':
        return this.handleNotArticleClick();
    }
  };

  handleMouseLeave = () => {
    this.handleNotArticleSelectionClose();
  };

  handleNotArticleSelectionClose = () => {
    this.setState({
      barOpen: false,
      notArticleSelectionDisplay: false,
    });
  };

  handleRead = () => {
    const { id, onChange, read, notArticleReplied } = this.props;
    onChange({
      id,
      read: !read,
      notArticleReplied,
    });
  };

  handleNotArticleSave = type => {
    const { id, onChange, read } = this.props;
    onChange({
      id,
      read,
      notArticleReplied: type,
    });
  };

  render() {
    const { barOpen, notArticleSelectionDisplay, hoverTargetName } = this.state;
    return (
      <ul
        className={cx('bar', {
          active: barOpen,
        })}
        ref={widget => (this.refWidget = widget)}
        style={{ zIndex: notArticleSelectionDisplay ? 2 : 1 }} //or the extend component will cover by next ul
        onClick={this.preventAll}
        onMouseEnter={this.handleBarOpen}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleBarOpen}
        onTouchMove={this.handleBarTouchMove}
        onTouchEnd={this.handleBarTouchEnd}
      >
        <WidgetItem
          name="read"
          description="已讀"
          color="#cfcfcf"
          hover={hoverTargetName === 'read'}
          index={0}
          onClick={this.handleReadClick}
          onMouseEnter={this.handleTagHover}
          onMouseLeave={this.handleTagUnHover}
        />
        <WidgetItem
          name="notArticle"
          description="非查證"
          color="orange"
          hover={hoverTargetName === 'notArticle'}
          index={1}
          onClick={this.handleNotArticleClick}
          onMouseEnter={this.handleTagHover}
          onMouseLeave={this.handleTagUnHover}
        >
          {notArticleSelectionDisplay && (
            <NotArticleExtendSelection onSelect={this.handleNotArticleReply} />
          )}
        </WidgetItem>
        <style jsx>{`
          ul {
            --selection-size: 0.8em;
            position: absolute;
            right: 0;
            /* variable from listItem.styles.js */
            bottom: var(--list-item-padding);
            height: calc(var(--font-size) * 2);
          }
          ul.active {
            /* give additional space for hover */
            width: 50%;
          }
          ul.active :global(.tag) {
            transform: translateX(calc(var(--index) * -2.3em)) scale(1.2);
            opacity: 1;
          }
        `}</style>
      </ul>
    );
  }
}
