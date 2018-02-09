import React, { PureComponent } from 'react';
import moment from 'moment';

import { nl2br, linkify } from '../../util/text';

import { Link } from '../../routes';
import ExpandableText from '../ExpandableText';
import RepliesModal from '../Modal/RepliesModal';
import { sectionStyle } from '../ReplyConnection.styles';

export default class SearchArticleItem extends PureComponent {
  state = {
    repliesModalOpen: false,
  };

  handleModalOpen = () => {
    this.setState({
      repliesModalOpen: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      repliesModalOpen: false,
    });
  };

  handleOnConnect = event => {
    this.props.onConnect(event);
    this.handleModalClose();
  };

  render() {
    const { repliesModalOpen } = this.state;
    const { article } = this.props;
    const createdAt = moment(article.get('createdAt'));
    return (
      <li className="root">
        <button className="btn-sticky" onClick={this.handleModalOpen}>
          查看{article.get('replyCount')}則回覆
          <svg
            className="icon-extend"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm-6 400H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h340a6 6 0 0 1 6 6v340a6 6 0 0 1-6 6zm-54-304l-136 .145c-6.627 0-12 5.373-12 12V167.9c0 6.722 5.522 12.133 12.243 11.998l58.001-2.141L99.515 340.485c-4.686 4.686-4.686 12.284 0 16.971l23.03 23.029c4.686 4.686 12.284 4.686 16.97 0l162.729-162.729-2.141 58.001c-.136 6.721 5.275 12.242 11.998 12.242h27.755c6.628 0 12-5.373 12-12L352 140c0-6.627-5.373-12-12-12z" />
          </svg>
        </button>
        <header className="section">
          {createdAt.isValid() ? (
            <Link route="article" params={{ id: article.get('id') }}>
              <a>
                <h3 title={createdAt.format('lll')}>{createdAt.fromNow()}</h3>
              </a>
            </Link>
          ) : (
            ''
          )}
        </header>
        <ExpandableText wordCount={40}>
          {nl2br(linkify(article.get('text')))}
        </ExpandableText>
        {repliesModalOpen && (
          <RepliesModal
            replies={article.getIn(['replyConnections'])}
            onModalClose={this.handleModalClose}
            onConnect={this.handleOnConnect}
          />
        )}
        <style jsx>{`
          .root {
            padding: 24px;
            border: 1px solid #ccc;
            border-top: 0;
          }
          .root:first-child {
            border-top: 1px solid #ccc;
          }
          .root:hover {
            background: rgba(0, 0, 0, 0.05);
          }
          .btn-sticky {
            position: sticky;
            top: 0.3em;
            float: right;
            display: flex;
            flex-dirction: row;
            align-items: center;
            height: 1.6em;
            border-radious: 0.8em;
            cursor: pointer;
          }
          .icon-extend {
            height: 1em;
            width: auto;
            display: inline-block;
            margin-left: 0.5em;
          }
        `}</style>
        <style jsx>{sectionStyle}</style>
      </li>
    );
  }
}
