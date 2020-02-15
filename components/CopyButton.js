import React from 'react';
import ClipboardJS from 'clipboard';
import { t } from 'ttag';
import Snackbar from '@material-ui/core/Snackbar';

class CopyButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.copyBtnRef = React.createRef();
  }

  static defaultProps = {
    content: '',
  };
  state = {
    showCopySnack: false,
  };

  componentDidMount() {
    const clipboard = new ClipboardJS(this.copyBtnRef.current, {
      text: () => this.props.content,
    });
    clipboard.on('success', () => {
      if (window.navigator && window.navigator.share) {
        const text = clipboard.text();
        navigator.share({ text }).catch(() => {});
      } else {
        this.setState({ showCopySnack: true });
      }
    });
  }

  handleClose = () => {
    this.setState({ showCopySnack: false });
  };

  render() {
    const { showCopySnack } = this.state;

    return (
      <button ref={this.copyBtnRef} className="btn-copy">
        {t`Copy`}
        <Snackbar
          open={showCopySnack}
          onClose={this.handleClose}
          message={t`Copied to clipboard.`}
        ></Snackbar>
        <style jsx>{`
          .btn-copy {
            margin-left: 10px;
          }
        `}</style>
      </button>
    );
  }
}

export default CopyButton;
