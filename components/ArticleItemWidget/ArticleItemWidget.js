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

  constructor(props) {
    super(props);
    this.state = Object.assign({}, initialState);
  }

  replyToNotArticle = text => {
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
      this.handleNotArticleReply(text);
      this.resetWidgetUI();
      NProgress.done();
    });
  };

  handleReadClick = event => {
    event && event.preventDefault();
    this.handleRead();
    this.resetWidgetUI();
  };

  handleNotArticleClick = () => {
    this.setState(({ notArticleSelectionDisplay }) => ({
      notArticleSelectionDisplay: !notArticleSelectionDisplay,
    }));
  };

  componentDidMount = () => {
    this.preventMobileLongPressMenu();
  };

  preventMobileLongPressMenu = () => {
    this.refWidget.addEventListener('contextmenu', event =>
      event.preventDefault()
    );
  };

  preventAll = event => {
    // stop event cascade (touchstart → touchend → mouseover → mousemove → mousedown → mouseup → click)
    event.preventDefault();
    // stop (child touchstart -> parent touchstart,... ) mainly for for parent a:link redirection,
    event.stopPropagation();
    return event;
  };

  // close widget bar and tags extend component
  resetWidgetUI = () => {
    this.setState(initialState);
  };

  openBar = () => {
    this.setState({
      barOpen: true,
      hoverTargetName: 'read', //for mobile, explain in onTouchMoveTip function
    });
  };

  hoverTag = event => {
    const name = event.currentTarget.attributes['name'].value;
    this.setState({
      hoverTargetName: name,
    });
  };

  unHoverTag = () => {
    this.setState({
      hoverTargetName: false,
    });
  };

  /**
   * since the touch start event can only trigger when the finger down at the first tag,
   * so it's hard to done with like mouse enter/leave strategy
   * then I use onTouchMove to dynamic check which tag was touch over
   */
  onTouchMoveTip = event => {
    var changedTouch = event.changedTouches[0];
    var elem = document.elementFromPoint(
      changedTouch.clientX,
      changedTouch.clientY
    );
    try {
      var target_name = elem.attributes['name'].value;
      target_name &&
        this.setState(
          Object.assign({}, this.initialTagsState, {
            [`${target_name}Hover`]: true,
            hoverTargetName: target_name,
          })
        );
    } catch (error) {
      // touch move not on the widget tag
    }
  };

  // trigger the onClick function in tags config, when finger touch end with tag elm
  onBarTouchEnd = event => {
    this.preventAll(event);
    const target = this.tags.find(select => {
      return select.name === this.state.hoverTargetName;
    });
    target && target.onClick();
  };

  onMouseLeave = () => {
    this.closeNotArticleSelection();
  };

  closeNotArticleSelection = () => {
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

  handleNotArticleReply = type => {
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
        onMouseEnter={this.openBar}
        onMouseLeave={this.onMouseLeave}
        onTouchStart={this.openBar}
        onTouchMove={this.onTouchMoveTip}
        onTouchEnd={this.onBarTouchEnd}
      >
        <WidgetItem
          name="read"
          description="已讀"
          color="#cfcfcf"
          hover={hoverTargetName === 'read'}
          index={0}
          onClick={this.handleReadClick}
          onMouseEnter={this.hoverTag}
          onMouseLeave={this.unHoverTag}
        />
        <WidgetItem
          name="notArticle"
          description="非查證"
          color="orange"
          hover={hoverTargetName === 'notArticle'}
          index={1}
          onClick={this.handleNotArticleClick}
          onMouseEnter={this.hoverTag}
          onMouseLeave={this.unHoverTag}
        >
          {notArticleSelectionDisplay && (
            <NotArticleExtendSelection
              replyToNotArticle={this.replyToNotArticle}
            />
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
