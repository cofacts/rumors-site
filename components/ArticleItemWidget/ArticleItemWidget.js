import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';
import cx from 'classnames';

import gql from '../../util/gql';
import { articleItemWidgetStyle } from './ArticleItemWidget.styles';

import NotArticleExtendSelection from './NotArticleExtendSelection.js';

// TODO: Click out for touch

// without state for tags (like: hover, show, hide...)
const initialState = {
  barOpen: false,
  notArticleSelectionDisplay: false,
  touchTarget: false, // record the target now touch(move!) over by dom id, not touch start.
};

export default class ArticleItemWidget extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired, // Article ID
    read: PropTypes.bool.isRequired,
    notArticleReplied: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string, // TYPE_SUGGESTION_OPTIONS in replyType.js
    ]),
    handleLocalEditorHelperList: PropTypes.func.isRequired,
  };

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

  // the tags config
  tags = [
    {
      name: 'read',
      description: '已讀',
      color: '#cfcfcf',
      onClick: event => {
        event && event.preventDefault();
        this.handleRead();
        this.resetWidgetUI();
      },
    },
    {
      name: 'notArticle',
      description: '非查證',
      color: 'orange',
      extendComponent: <NotArticleExtendSelection replyToNotArticle={this.replyToNotArticle} />,
      onClick: event => {
        console.log('toggle')
        this.setState({
          notArticleSelectionDisplay: !this.state.notArticleSelectionDisplay,
        });
      },
    },
  ];

  constructor(props) {
    super(props);

    this.initialTagsState = {};
    const name_list = this.tags.forEach(section => {
      this.initialTagsState[`${section.name}Hover`] = false;
    });

    this.state = Object.assign({}, initialState, this.initialTagsState);
  }

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
    this.setState(Object.assign({}, initialState, this.initialTagsState));
  };

  openBar = () => {
    this.setState({
      barOpen: true,
      readHover: true, //for mobile, explain in onTouchMoveTip function
      touchTarget: 'read',
    });
  };

  hoverTag = event => {
    const name = event.currentTarget.attributes['name'].value;
    this.setState({
      [`${name}Hover`]: true,
    });
  };

  unHoverTag = event => {
    const name = event.currentTarget.attributes['name'].value;
    this.setState({
      [`${name}Hover`]: false,
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
            touchTarget: target_name,
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
      return select.name === this.state.touchTarget;
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
    const {
      id,
      handleLocalEditorHelperList,
      read,
      notArticleReplied,
    } = this.props;
    handleLocalEditorHelperList({
      id,
      read: !read,
      notArticleReplied,
    });
  };

  handleNotArticleReply = type => {
    const { id, handleLocalEditorHelperList, read } = this.props;
    handleLocalEditorHelperList({
      id,
      read,
      notArticleReplied: type,
    });
  };

  render() {
    const { barOpen, notArticleSelectionDisplay } = this.state;
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
        {this.tags.map((tag, index) => {
          return (
            <li
              key={tag.name}
              id={tag.name}
              name={tag.name}
              data-description={tag.description}
              onMouseEnter={this.hoverTag}
              onMouseLeave={this.unHoverTag}
              onClick={tag.onClick}
              onTouchStart={event => event.preventDefault()}
              className={cx({ active: this.state[`${tag.name}Hover`] })}
              style={{
                '--index': index,
                '--color': tag.color,
              }}
            >
              <div
                id={tag.name}
                className={cx('tag', { active: tag.active })}
              />
              {notArticleSelectionDisplay &&
                tag.extendComponent &&
                tag.extendComponent}
            </li>
          );
        })}
        <style jsx>{articleItemWidgetStyle}</style>
      </ul>
    );
  }
}
