import React from 'react';
import ClipboardJS from 'clipboard';
import 'balloon-css/balloon.css';

export default class CopyButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.copyBtnRef = React.createRef();
    this.clipboardRef = React.createRef();
  }

  static defaultProps = {
    content: '',
  };
  state = {
    btnAttributes: {},
  };

  componentDidMount() {
    this.clipboardRef.current = new ClipboardJS(this.copyBtnRef.current, {
      text: () => this.props.content,
    });
    this.clipboardRef.current.on('success', () => {
      const self = this;
      this.setState({
        btnAttributes: {
          'data-balloon': '複製成功！',
          'data-balloon-visible': '',
          'data-balloon-pos': 'up',
        }});

      setTimeout(function() {
        self.setState({ btnAttributes: {} });
      }, 1000);
    });
  }

  render() {
    return (
      <button
        ref={this.copyBtnRef}
        key="copy"
        onClick={() => {}}
        className="btn-copy"
        { ...this.state.btnAttributes }
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
