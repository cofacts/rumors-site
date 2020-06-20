import React, { PureComponent } from 'react';

class GoogleWebsiteTranslator extends PureComponent {
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
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        disableAutoTranslation: true, // Only translate when needed, to avoid conflict with React.js
      },
      'google_translate_element'
    );
  };

  render() {
    return (
      <div ref={container => (this.refContainer = container)}>
        <div id="google_translate_element" />
      </div>
    );
  }
}

export default GoogleWebsiteTranslator;
