import { Fragment, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import getConfig from 'next/config';
import cx from 'clsx';
import { t } from 'ttag';
import { NEWS, Jumbotron, Stats } from 'components/LandingPage';
import qrCodeURL from './../components/LandingPage/images/qr-code.png';
import ogImage from 'components/LandingPage/images/ogimage.png';

const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

function Home() {
  const [navCollapsed, setNavCollapsed] = useState(true);

  const toggleNav = () => {
    setNavCollapsed(s => !s);
  };

  const title = `${t`Cofacts`} - ${t`Connecting facts and instant messages`}`;
  const description = t`Cofacts is a collaborative system connecting instant messages and fact-check reports or different opinions together. It’s a grass-root effort fighting mis/disinformation in Taiwan.`;

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:locale" content={process.env.LOCALE} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={PUBLIC_URL} />
        <meta property="og:image" content={`${PUBLIC_URL}${ogImage}`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1271" />
        <meta property="article:author" content="MrOrz" />
        <meta property="article:section" content="Taiwan" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          type="text/css"
          href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="//maxcdn.bootstrapcdn.com/font-awesome/4.6.2/css/font-awesome.min.css"
        />
        <link
          href="//fonts.googleapis.com/css?family=Lato:400,700"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Noto+Sans+TC:400,700&display=swap&subset=chinese-traditional"
          rel="stylesheet"
          type="text/css"
        />
      </Head>
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: navCollapsed ? 'initial' : '#343a40' }}
      >
        <Link href="/">
          <a className="navbar-brand">{t`Cofacts`}</a>
        </Link>
        <button
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          className="navbar-toggler"
          onClick={toggleNav}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={cx('navbar-collapse', { collapse: navCollapsed })}>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <Link href="/articles">
                <a className="nav-link">{t`Hoax Search`}</a>
              </Link>
            </li>
            <li className="nav-item active">
              <Link href="/replies">
                <a className="nav-link">{t`Response List`}</a>
              </Link>
            </li>
            <li className="nav-item active">
              <a
                href="https://www.facebook.com/groups/cofacts/permalink/1959641497601003/"
                className="nav-link"
              >
                {t`Facebook`}
              </a>
            </li>
            <li className="nav-item active">
              <a href="https://beta.hackfoldr.org/cofacts" className="nav-link">
                {t`Hackfoldr`}
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <Jumbotron />

      <div className="section bg-warning section-line">
        <div className="inner">
          <div className="content">
            <h4>
              {t`Follow our LINE@, and send any suspected hoax, scam, rumor, or
                 urban legend to verify its truth`}
            </h4>
            <div className="sep light-dark gap-sm"></div>
            <p>
              {t`Search by ID “@cofacts” or scan our QR Code to follow our Cofacts
                 LINE@ account, forward any possible hoax, scam, rumor, or urban
                 legend sources to it, then our chatbot will help you check the
                 credibility of the source!`}
            </p>
            <p>
              <a
                href="https://g0v.hackmd.io/s/rkVVQDmqQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <small>
                  {t`TUTORIAL`} <i className="fa fa-arrow-right"></i>
                </small>
              </a>
            </p>
            <p>
              <img src={qrCodeURL} />
            </p>
          </div>
          <div className="phone-container">
            <div className="phone-img">
              <video
                poster={require('components/LandingPage/images/recording-still.gif')}
                src={require('components/LandingPage/images/recording.mp4')}
                autoPlay
                loop
                muted
              ></video>
            </div>
          </div>
        </div>
      </div>
      <div className="section section-why bg-light">
        <div className="inner">
          <div className="text-center">
            <h2>{t`Write your own response and share your wisdom!`}</h2>
          </div>
          <p>
            {t`The responses a user see are also submitted by other users. Here we
               do not have all-knowing judges, only citizens who cooperate and
               contribute. Think others’ response not good enough? Is there
               something you’d like to find out but it has not been requested yet?
               Write your own response and help others!`}
          </p>
          <p>
            {t`Every suspicious source is sent from an user, which is open to
               public for examination and response. One single request can be
               responded by different people, allowing each response to take a step
               closer to unravelling its truth.`}
          </p>
          <p className="text-center">
            <a href="/articles" className="btn btn-secondary btn-lg mr-2">
              {t`HOAX SEARCH`} <i className="fa fa-database"></i>
            </a>
          </p>
        </div>
      </div>
      <div className="section section-traction bg-danger text-light">
        <div className="inner text-center">
          <h2>{t`A war between hoaxes and facts`}</h2>
          <p>{t`The difficulties we face...`}</p>
          <div
            style={{
              borderBottom: '1 solid rgba(255,255,255,0.6)',
              margin: '40px auto',
              width: '150px',
            }}
            className="sep"
          />
          <Stats />
        </div>
      </div>
      <div className="section section-photos">
        <div className="inner">
          <div
            style={{
              backgroundImage: `url(${require('components/LandingPage/images/gallery/1.jpg')})`,
            }}
            className="photo"
          >
            <div className="mask"></div>
          </div>
          <div
            style={{
              backgroundImage: `url(${require('components/LandingPage/images/gallery/2.jpg')})`,
            }}
            className="photo"
          >
            <div className="mask"></div>
          </div>
          <div
            style={{
              backgroundImage: `url(${require('components/LandingPage/images/gallery/3.jpg')})`,
            }}
            className="photo"
          >
            <div className="mask"></div>
          </div>
          <div
            style={{
              backgroundImage: `url(${require('components/LandingPage/images/gallery/4.jpg')})`,
            }}
            className="photo"
          >
            <div className="mask"></div>
          </div>
          <div
            style={{
              backgroundImage: `url(${require('components/LandingPage/images/gallery/5.jpg')})`,
            }}
            className="photo"
          >
            <div className="mask"></div>
          </div>
          <div
            style={{
              backgroundImage: `url(${require('components/LandingPage/images/gallery/6.jpg')})`,
            }}
            className="photo"
          >
            <div className="mask"></div>
          </div>
        </div>
      </div>
      <div className="section section-trivia">
        <div className="inner">
          <div className="text-center">
            <h2>{t`Features`}</h2>
          </div>
          <p>
            {t`Cofacts program encourages people to become part of a chatbot for
               helping others. With your research, you can add your hoax busting
               responses into our database to help people acknowledge its lies.`}
          </p>
          <br />
          <div className="row">
            <div className="col-6 col-md-3">
              <div className="media">
                <i className="fa mr-2 mt-1 fa-cube"></i>
                <div className="media-body">
                  <span className="name">
                    <b>{t`Crowdsourcing`}</b>
                  </span>
                  <p
                    style={{
                      lineHeight: '1.4em',
                      fontSize: '0.6em',
                      color: '#444',
                    }}
                  >
                    {t`Anyone can verify and respond to other’s requests on
                       possible hoax and upload it into our database. We encourage
                       citizens to join our program, even invite your mom and dad
                       to join.`}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="media">
                <i className="fa mr-2 mt-1 fa-cube"></i>
                <div className="media-body">
                  <span className="name">
                    <b>{t`Real-Time Response`}</b>
                  </span>
                  <p
                    style={{
                      lineHeight: '1.4em',
                      fontSize: '0.6em',
                      color: '#444',
                    }}
                  >
                    {t`Once someone respond to your pending request, the chatbot
                       will answer you through LINE. It’s fast and immediate, you
                       don’t even have to wait. Better yet, you don’t even need to
                       say ‘thank you’. Ask the bot to verify for you, no need to
                       feel uncomfortable asking it for favors.`}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="media">
                <i className="fa mr-2 mt-1 fa-cube"></i>
                <div className="media-body">
                  <span className="name">
                    <b>{t`Different Views`}</b>
                  </span>
                  <p
                    style={{
                      lineHeight: '1.4em',
                      fontSize: '0.6em',
                      color: '#444',
                    }}
                  >
                    {t`Knowing what’s fact and what’s an opinion. Seeing different
                       sides of the story makes you realize your own blindspot,
                       allowing everyone to respect each other’s perspectives.`}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="media">
                <i className="fa mr-2 mt-1 fa-cube"></i>
                <div className="media-body">
                  <span className="name">
                    <b>{t`Open Source Authorization`}</b>
                  </span>
                  <p
                    style={{
                      lineHeight: '1.4em',
                      fontSize: '0.6em',
                      color: '#444',
                    }}
                  >
                    {t`Codes of different patches, meeting records and database
                       statistics are all opened to public. We encourage more open
                       source data; work and share with others in a transparent
                       environment, create different possibilities.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section section-media bg-warning text-dark">
        <div className="inner">
          <h2 className="text-center">{t`See what others have to say`}</h2>
          <ul>
            {NEWS.map(([meta, title, url], idx) => (
              <li key={idx}>
                {meta}／<a href={url}>{title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="section section-contribute bg-light text-dark">
        <div className="inner">
          <div className="text-center">
            <h2>{t`Join our open source community`}</h2>
          </div>
          <p>
            {t`Cofacts needs all of you to help our current program to be more
               efficient and complete. This collaborate program cannot be completed
               by a small community, we need everyone to contribute, write codes,
               bust hoaxes and research. Self-motivated researching and responding
               is the way to transcend this program into something great.`}
          </p>
          <p>{t`We welcome everyone to join us, here is what we’re looking for.`}</p>
          <ul>
            <li>
              {t`People with curiosity and a sense of justice that can help us bust
                 hoaxes and help others.`}
            </li>
            <li>
              {t`Coding is a piece of cake to you? Join us fast and work together
                 with us on our issues.`}
            </li>
          </ul>
          <br />
          <div className="text-center">
            <a
              href="https://hackmd.io/@B4gs1CECTRyI5Ny7vSy6dQ/SklM4dV9m/https%3A%2F%2Fg0v.hackmd.io%2FWaz-B9sORSOPLp6nAOS82w?type=book&fbclid=IwAR0pNUVLOllNTgoPE8dxbJSt8VCvIeCK_h0MszfAS2aiUFLj3XFfTfKXM4Q"
              className="btn btn-secondary btn-md mr-2 mb-2"
              style={{
                whiteSpace: 'normal !important',
                wordWrap: 'break-word',
              }}
            >
              {t`I want to learn how to use Cofacts`}{' '}
              <i className="fa fa-user-plus"></i>
            </a>
            <a
              href="https://hackmd.io/s/SyMRyrfEl"
              className="btn btn-secondary btn-md mr-2 mb-2"
            >
              {t`I can help bust hoaxes`}{' '}
              <i className="fa fa-pencil-square-o"></i>
            </a>
            <a
              href="https://hackmd.io/s/r1nfwTrgM"
              className="btn btn-secondary btn-md mr-2 mb-2"
            >
              {t`I can help with coding`} <i className="fa fa-code"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="section section-footer bg-dark text-light">
        <div className="inner">
          <div className="row">
            <div className="col-12 col-md-8">
              <div className="row">
                <div className="col-6 col-md-4">
                  <label>{t`Cofacts`}</label>
                  <div className="item">
                    <a href="https://bit.ly/cofacts-quickstart">
                      {t`Program Introduction`}
                    </a>
                  </div>
                  <div className="item">
                    <a href="https://grants.g0v.tw/projects/588fa7b382223f001e022944">
                      {t`Original Program`}
                    </a>
                  </div>
                  <div className="item">
                    <a href="https://github.com/cofacts">{t`Source code`}</a>
                  </div>
                  <div className="item">
                    <a href="https://www.facebook.com/groups/cofacts/">
                      {t`Facebook Club`}
                    </a>
                  </div>
                  <div className="item">
                    <a href="mailto:cofacts@googlegroups.com">{t`Contact`}</a>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <label>{t`Notices`}</label>
                  <div className="item">
                    <a href="https://beta.hackfoldr.org/cofacts/https%253A%252F%252Fhackmd.io%252Fs%252FryE0G6rxG">
                      {t`Cofacts Copyrights`}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 text-center">
              <img
                src={require('components/LandingPage/images/g0v-bg-dark.svg')}
                style={{ width: 100 }}
              />
              <div>powered by g0v</div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        :global(html, body) {
          font-size: 22px;
          font-family: Lato, 'Noto Sans TC', Helvetica, Arial, sans-serif;
        }
        h1,
        h2,
        h3,
        h4,
        h5 {
          font-weight: 900;
        }
        nav {
          text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
          font-size: 0.9em;
        }
        .section {
          padding: 80px 20px;
        }
        .section .inner {
          margin: 0 auto;
          max-width: 1024px;
        }
        h2 {
          margin-bottom: 50px;
        }
        .section-line {
          padding: 0 40px;
        }
        .section-line .inner {
          display: flex;
          flex-flow: wrap;
          justify-content: center;
          align-items: flex-end;
        }
        .section-line .content {
          padding: 40px 0;
          min-width: 50%;
          -webkit-flex: 1;
          flex: 1;
        }
        .phone-container {
          margin: 0 20px;
          max-width: 100%;
          width: 360px;
          overflow: hidden;
        }
        .phone-container .phone-img {
          width: 100%;
          padding-bottom: 150%;
          background: url(${require('components/LandingPage/images/phone.png')})
            top left;
          background-size: cover;
          position: relative;
        }
        .phone-container video {
          position: absolute;
          width: 78%;
          left: 11%;
          top: 14%;
        }
        .section-why {
          background: #fff
            url(${require('components/LandingPage/images/cofacts-db-bg.jpg')})
            bottom left no-repeat;
        }
        .section-why p {
          background: rgba(255, 255, 255, 0.6);
        }
        .section-photos {
          padding: 0;
        }
        .section-photos .inner {
          display: flex;
          -webkit-flex-wrap: wrap;
          flex-wrap: wrap;
          width: 100%;
          max-width: 100%;
        }
        .section-photos .photo {
          -webkit-flex: 1 1 auto;
          flex: 1 1 auto;
          width: 33%;
          height: 270px;
          background-color: #000;
          background-position: center center;
          background-size: cover;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        }
        .section-photos .photo .mask {
          content: ' ';
          width: 100%;
          height: 100%;
          display: block;
          background: #000;
          opacity: 0.5;
        }
        .section-photos .photo:hover .mask {
          opacity: 0;
        }
        .section-features {
          padding-top: 90px;
        }
        .section-features .icon {
          font-size: 90px;
          margin-bottom: 40px;
        }
        .section-features p {
          font-size: 0.9em;
          color: #555;
        }
        .section-contribute {
          background: #fff
            url(${require('components/LandingPage/images/giraffe.jpg')}) bottom
            right no-repeat;
          background-size: 150px auto;
        }
        .section-footer a {
          color: #9be;
        }
        .sep.gap-sm {
          margin: 15px 0;
        }
        .sep.gap {
          margin: 30px 0;
        }
        .sep.gap-lg {
          margin: 60px 0;
        }
        .sep.light {
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        }
        .sep.dark {
          border-bottom: 1px solid rgba(0, 0, 0, 0.5);
        }
        .sep.light-dark {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Fragment>
  );
}

// Home page should be server-rendered
Home.getInitialProps = () => ({});

export default Home;
