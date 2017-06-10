import React from 'react';
import Head from 'next/head'
import style from '../components/App.css';

class Instant extends React.PureComponent {
  state = {
    scale: 1,
  }

  componentDidMount() {
    this.setScale();
    window.addEventListener('resize', this.setScale);
  }

  componntWillUnmount() {
    window.removeEventListener('resize', this.setScale);
  }

  setScale = () => {
    const { width, height } = this.rootElem.getBoundingClientRect();
    const horizontalScale = window.innerWidth / width;
    const verticalScale = window.innerHeight / height;

    this.setState({
      scale: Math.min(horizontalScale, verticalScale),
    })
  }

  render() {
    return (
      <div
        className="root"
        ref={root => {this.rootElem = root}}
      >
        <div
          className="scaler"
          style={{transform: `scale(${this.state.scale})`}}
        >
          <div className="present">
            目前已回覆 2,550 篇文章
          </div>
          <div className="verb">增加了</div>
          <div className="number">86</div>
          <div className="paragraph">篇新回覆文章</div>
        </div>
        <style jsx>{`
          .root {
            line-height: 1;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .scaler {
            height: 768px;
            padding: 0 44px;
          }
          .present {
            font-size: 36px;
            font-weight: 200;
            padding: 36px 0 64px;
          }
          .verb {
            font-size: 64px;
            font-weight: 600;
          }
          .number {
            font-size: 360px;
            font-weight: 400;
          }
          .paragraph {
            font-size: 44px;
            font-weight: 600;
          }
        `}</style>
      </div>
    )
  }
}

export default class InstantWrapper extends React.Component {
  render() {
    return (
      <div>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: style }} />
          <style>{`
            html {
              font-family: 蘋方-繁, "PingFang TC", 思源黑體, "Source Han Sans", "Noto Sans CJK TC", sans-serif;
              color: rgba(0,0,0,0.76);
              overflow: hidden;
            }
          `}</style>
        </Head>
        <Instant />
      </div>
    );
  }
}
