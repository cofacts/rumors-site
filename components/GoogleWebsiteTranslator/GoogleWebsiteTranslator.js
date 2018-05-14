import React, { PureComponent } from 'react';

export default class GoogleWebsiteTranslator extends PureComponent {
  componentDidMount() {
    window.googleTranslateElementInit = this.googleTranslateElementInit;
    this.addGoogleTranslatorScript();
  }

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
      'google_translate_element'
    );
  };

  componentWillUnmount() {
    if (this.translateInstance) {
      this.translateInstance.dispose();
    }
  }

  render() {
    return (
      <div
        id="google_translate_container"
        ref={container => (this.refContainer = container)}
      >
        <div id="google_translate_element" />
        <style jsx>
          {`
            #google_translate_container {
              position: fixed;
              bottom: 0.5em;
              right: 1em;
              background: rgba(255, 255, 255, 0.6);
            }
          `}
        </style>
      </div>
    );
  }
}
