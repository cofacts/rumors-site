import React from 'react';
import ClipboardJS from 'clipboard';
import 'balloon-css/balloon.css';
import levelNames from "../constants/levelNames";

export default class CopyButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.copyBtnRef = React.createRef();
    this.clipboardRef = React.createRef();
  }

  static defaultProps = {
    content: '',
  };

  componentDidMount() {

    this.clipboardRef.current = new ClipboardJS(this.copyBtnRef.current, {
      text: () => this.props.content,
    });
    this.clipboardRef.current.on('success', () => {
      // this.setState({ isSuccessMsgShow: true });
      const copyBtnRef = this.copyBtnRef.current;
      copyBtnRef.setAttribute('data-balloon', '複製成功！');
      copyBtnRef.setAttribute('data-balloon-visible', '');
      copyBtnRef.setAttribute('data-balloon-pos', 'up');
      setTimeout(function() {
        copyBtnRef.removeAttribute('data-balloon');
        copyBtnRef.removeAttribute('data-balloon-visible');
        copyBtnRef.removeAttribute('data-balloon-pos');
      }, 3000);
    });
  }

  render() {
    return (
      <button
        ref={this.copyBtnRef}
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
