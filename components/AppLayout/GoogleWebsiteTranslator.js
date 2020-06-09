import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';

class GoogleWebsiteTranslator extends PureComponent {
  constructor(props) {
    super(props);
    const { mobile, desktop } = props;
    this.id = 'google_translate_element';
    if (mobile) this.id += 'mobile';
    if (desktop) this.id += 'desktop';
  }

  componentDidMount() {
    if (!this.fit()) return;
    window.googleTranslateElementInit = this.googleTranslateElementInit;
    this.addGoogleTranslatorScript();
  }

  // Since google translation component doesn't allow to create multiple
  // instances, here we use a workaround to render only one component
  // in different screen size.
  // This is more like a workaround, feel free to change the method if
  // you find a better solution.
  fit = () => {
    const mdScreen = 768;
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const { mobile, desktop } = this.props;
    return (width >= mdScreen && desktop) || (width < mdScreen && mobile);
  };

  addGoogleTranslatorScript = () => {
    const newScript = document.createElement('script');
    newScript.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    this.refContainer.appendChild(newScript);
  };

  googleTranslateElementInit = () => {
    this.translateInstance = new window.google.translate.TranslateElement(
      {
        pageLanguage: 'zh-TW',
        includedLanguages: 'en,zh-TW',
        layout:
          window.google.translate.TranslateElement.FloatPosition.BOTTOM_RIGHT,
        disableAutoTranslation: true, // Only translate when needed, to avoid conflict with React.js
      },
      this.id
    );
  };

  componentWillUnmount() {
    if (this.translateInstance) {
      this.translateInstance.dispose();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div
        className={classes.root}
        ref={container => (this.refContainer = container)}
      >
        <div className={classes.element} id={this.id} />
      </div>
    );
  }
}

const ExportComponent = withStyles(theme => ({
  root: {
    background: 'transparent',
    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
    },
  },
}))(GoogleWebsiteTranslator);

ExportComponent.displayName = 'GoogleWebsiteTranslator';

export default ExportComponent;
