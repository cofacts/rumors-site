import React from 'react';
import ClipboardJS from 'clipboard';

export default class CopyButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.btnRef = React.createRef();
  }

  static defaultProps = {
    content: '',
  };

  componentDidMount() {
    console.log(this.btnRef.current);
  }

  render() {
    return (
      <button
        ref={this.btnRef}
        key="copy"
        onClick={() => {}}
        className="btn-copy"
        data-clipboard-target="#testCopyTarget"
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
