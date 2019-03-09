import React from 'react';
import ClipboardJS from 'clipboard';

export default class CopyButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.btnRef = React.createRef();
    this.clipboardRef = React.createRef();
  }

  static defaultProps = {
    content: '',
  };

  componentDidMount() {
    this.clipboardRef.current = new ClipboardJS(this.btnRef.current, {
      text: () => this.props.content,
    });
  }

  render() {
    return (
      <button
        ref={this.btnRef}
        key="copy"
        onClick={() => {}}
        className="btn-copy"
      >
        複製到剪貼簿
        <style jsx>{`
          .btn-copy {
            margin-left: 10px;
          }
        `}</style>
      </button>
    );
  }
}
