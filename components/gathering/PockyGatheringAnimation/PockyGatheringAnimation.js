import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import AnimateEatPocky from './AnimateEatPocky';

const lottieCDN =
  'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.4.1/lottie.min.js';

export default class PockyGatheringAnimation extends PureComponent {
  static propTypes = {
    number: PropTypes.number,
  };

  componentDidMount() {
    // can't get global lottie after onload, don't know why...
    var lottie_script = document.createElement('script');
    lottie_script.onload = this._init;
    lottie_script.src = lottieCDN;
    document.head.appendChild(lottie_script);
  }

  componentDidUpdate = prevProps => {
    const isInit = prevProps.number > 1000 || this.props.number > 1000;
    if (
      this.animEatPocky &&
      !isInit &&
      prevProps.number !== this.props.number
    ) {
      this.animEatPocky.play('lottie-pocky');
    }
  };

  _init = () => {
    this.animEatPocky = new AnimateEatPocky(this.refContainer);
  };

  render() {
    return (
      <div id="lottie-pocky" ref={container => (this.refContainer = container)}>
        <Head>
          <script src={lottieCDN} />
        </Head>
        <style jsx>{`
          #lottie-pocky {
            position: absolute;
            z-index: 1;
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
          }
        `}</style>
      </div>
    );
  }
}
