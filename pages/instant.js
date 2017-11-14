import React from 'react';
import Head from 'next/head';
import gql from '../util/gql';
import style from '../components/App/App.css';
import querystring from 'querystring';

const POLLING_INTERVAL = 5000;

const SPECIAL_PROPS = {
  7: {
    top: 'Lucky',
  },
  17: {
    bottom: '8+9',
  },
  21: {
    top: '每天只有',
    bottom: '小時，剩下 3 小時是用來睡覺的',
  },
  44: {
    bottom: '隻石獅子',
  },
  56: {
    bottom: '不能亡',
  },
  64: {
    top: '勿忘',
  },
  77: {
    top: '森',
  },
  87: {
    bottom: '不能再高了',
  },
  92: {
    top: '沒有共識的',
    bottom: '共識',
  },
  94: {
    bottom: '狂',
  },
  101: {
    bottom: '大樓',
  },
  118: {
    top: '看到',
    bottom: '就跪了',
  },
  123: {
    bottom: '木頭人',
  },
  133: {
    top: '法定最低時薪',
  },
  158: {
    top: 'mini',
  },
  165: {
    top: '警政署',
    bottom: '反詐騙專線',
  },
  183: {
    bottom: 'CLUB',
  },
  193: {
    bottom: '縣道',
  },
  200: {
    top: '意外撿到',
    bottom: '元',
  },
  228: {
    bottom: '二二八',
  },
  261: {
    top: '說好不提',
  },
  318: {
    bottom: '學運',
  },
  377: {
    bottom: '森七七',
  },
  500: {
    top: '下去領',
  },
};

function getSpecialProps(number) {
  return SPECIAL_PROPS[number.toString()];
}

function Kuang() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      html:after {
        content: '';
        position: fixed;
        border: 0.8vw solid rgba(0,0,0,0.64);
        top: 24px;
        right: 24px;
        bottom: 24px;
        left: 24px;
      }
    `,
      }}
    />
  );
}

function Hit({ number = 0, top = '', bottom = '' }) {
  return (
    <FullScreenResizer listen={number}>
      <div className="root">
        {top ? <div className="paragraph">{top}</div> : ''}
        <div className="number">{number}</div>
        {bottom ? <div className="paragraph">{bottom}</div> : ''}
      </div>
      <Kuang />
      <style jsx>{`
        .root {
          display: flex;
          flex-flow: column;
          justify-content: center;
          height: 100%;
          padding: 0 24px;
        }
        .number {
          font-size: 360px;
          font-weight: 100;
        }
        .paragraph {
          font-size: 84px;
          font-weight: 600;
          margin: 24px 0;
          white-space: nowrap;
        }
      `}</style>
    </FullScreenResizer>
  );
}

function Instant({ number = 0, total = 0 }) {
  return (
    <FullScreenResizer listen={number}>
      <div className="present">目前已回覆 {total} 篇文章</div>
      <div className="verb">增加了</div>
      <div className="number">{number}</div>
      <div className="paragraph">篇新回覆文章</div>
      <style jsx>{`
        .present {
          font-size: 36px;
          font-weight: 200;
          padding: 36px 0 64px;
          white-space: nowrap;
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
    </FullScreenResizer>
  );
}

class FullScreenResizer extends React.PureComponent {
  state = {
    scale: 1,
    isHidden: true,
    listen: null, // When changed, invoke this.setScale()
  };

  componentDidMount() {
    this.setScale();
    this.setState({ isHidden: false }); // After scale is set, show this component
    window.addEventListener('resize', this.setScale);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setScale);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listen !== this.props.listen) {
      this.setScale();
    }
  }

  setScale = () => {
    // Must wait until styled jsx boot up the stylesheet...
    ///
    requestAnimationFrame(() => {
      if (!this.rootElem) return;
      const { width, height } = this.rootElem.getBoundingClientRect();
      const horizontalScale = window.innerWidth / width;
      const verticalScale = window.innerHeight / height;

      this.setState({
        scale: Math.min(horizontalScale, verticalScale),
      });
    });
  };

  render() {
    const { scale, isHidden } = this.state;

    return (
      <div
        className={`root ${isHidden ? 'hidden' : ''}`}
        ref={root => {
          this.rootElem = root;
        }}
      >
        <div className="scaler" style={{ transform: `scale(${scale})` }}>
          {this.props.children}
        </div>
        <style jsx>{`
          .root {
            line-height: 1;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: opacity 0.25s;
          }
          .hidden {
            opacity: 0;
          }
          .scaler {
            height: 768px;
            /* Fixed as in design mockup */
            padding: 0 44px;
          }
        `}</style>
      </div>
    );
  }
}

function Loading({ show }) {
  return (
    <div className={`root ${show ? '' : 'hidden'}`}>
      Loading...
      <style jsx>{`
        .root {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: #fff;
          opacity: 1;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 100;
        }
        .hidden {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default class InstantWrapper extends React.Component {
  state = {
    current: 0, // current number of replied articles
    startFrom: null, // start number of replied articles to compare from
    isBootstrapping: true,
  };

  componentDidMount() {
    const queryParams = querystring.parse(location.hash.slice(1));
    this.periodicallyUpdateNumber().then(count => {
      // If startFrom is not specified in hash, set startFrom to the count.
      //
      const startFrom =
        queryParams && queryParams.startFrom ? queryParams.startFrom : count;
      this.setState({ startFrom, isBootstrapping: false });
      location.hash = querystring.stringify({ startFrom });
    });
  }

  updateNumber = () => {
    return gql`
      {
        ListArticles(filter: { replyCount: { GT: 0 } }) {
          totalCount
        }
      }
    `().then(data => {
      const totalCount = data.getIn(['data', 'ListArticles', 'totalCount'], 0);
      this.setState({ current: totalCount });
      return totalCount;
    });
  };

  periodicallyUpdateNumber = () =>
    this.updateNumber().then(count => {
      clearTimeout(this._timer);
      this._timer = setTimeout(this.periodicallyUpdateNumber, POLLING_INTERVAL);
      return count;
    });

  render() {
    const { current, startFrom, isBootstrapping } = this.state;
    const number = current - startFrom;
    const specialProps = getSpecialProps(number);

    return (
      <div>
        <Head>
          <title>{number} 篇新回覆文章 - cofacts</title>
          <style dangerouslySetInnerHTML={{ __html: style }} />
          <style
            dangerouslySetInnerHTML={{
              __html: `
            html {
              font-family: 蘋方-繁, "PingFang TC", 思源黑體, "Source Han Sans", "Noto Sans CJK TC", sans-serif;
              color: rgba(0,0,0,0.76);
              overflow: hidden;
              height: 100%;
            }
          `,
            }}
          />
        </Head>
        {specialProps ? (
          <Hit number={number} {...specialProps} />
        ) : (
          <Instant number={number} total={current} />
        )}
        <Loading show={isBootstrapping} />
      </div>
    );
  }
}
