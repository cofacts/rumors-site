import React from 'react';
import { nl2br, linkify } from '../util/text';

export default class ExpandableText extends React.Component {
  static defaultProps = {
    children: '',
    lines: 3,
  };

  constructor({ children }) {
    super();

    if (typeof children !== 'string') {
      throw new Error('<ExpandableText> only accepts string children.');
    }

    this.state = {
      isExpanded: false,
    };
  }

  toggleExapnd = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render() {
    const { children, lines } = this.props;
    const { isExpanded } = this.state;
    const sentences = nl2br(linkify(children));

    if (sentences.length <= lines) {
      return (
        <div>
          {sentences}
        </div>
      );
    }

    return (
      <div>
        {isExpanded ? sentences : sentences.slice(0, lines)}

        <button className="more" onClick={this.toggleExapnd}>
          {isExpanded ? '隱藏全文' : '閱讀更多'}
        </button>
        <style jsx>{`
          .more {
            border: 0;
            background: transparent;
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }
}
