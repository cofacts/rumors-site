import React from 'react';
import { truncate } from 'lib/text';

export default class ExpandableText extends React.Component {
  static defaultProps = {
    children: '',
    wordCount: 140,
  };

  state = {
    isExpanded: false,
  };

  toggleExpand = () => {
    this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
  };

  renderToggleButton = () => {
    const { isExpanded } = this.state;
    return (
      <button
        key="expandable-text-more-button"
        className="more"
        onClick={this.toggleExpand}
      >
        {isExpanded ? '隱藏全文' : '閱讀更多'}
        <style jsx>{`
          .more {
            border: 0;
            background: transparent;
            text-decoration: underline;
          }
        `}</style>
      </button>
    );
  };

  render() {
    const { children, wordCount } = this.props;
    const { isExpanded } = this.state;

    // Note: if "children" is short enough, this.state.isExpanded should never be true.
    //
    if (isExpanded) {
      return (
        <div>
          {children}
          {this.renderToggleButton()}
        </div>
      );
    }

    return (
      <div>
        {truncate(children, {
          wordCount,
          moreElem: this.renderToggleButton(),
        })}
      </div>
    );
  }
}
