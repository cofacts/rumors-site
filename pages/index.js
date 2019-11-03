import { Fragment, useState } from 'react';
import Head from 'next/head';
import cx from 'clsx';
// import { t } from 'ttag';

import { NEWS, Jumbotron } from 'components/LandingPage';

function Home() {
  const [navCollapsed, setNavCollapsed] = useState(true);

  const toggleNav = () => {
    setNavCollapsed(s => !s);
  };

  return (
    <Fragment>
      <Head>
        <title>Cofacts - Collaborative fact-checking system</title>
        <meta
          name="description"
          content="Cofacts is a collaborative system connecting instant messages and fact-check reports together. It’s a grass-root effort fighting mis/disinformation in Taiwan."
        />
        <meta
          property="og:title"
          content="Cofacts - Collaborative fact-checking system"
        />
        <meta
          property="og:description"
          content="Cofacts is a collaborative system connecting instant messages and fact-check reports together. It’s a grass-root effort fighting mis/disinformation in Taiwan."
        />
        <meta property="og:locale" content={process.env.LOCALE} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://cofacts.g0v.tw" />
        <meta
          property="og:image"
          content={`https://cofacts.g0v.tw${require('components/LandingPage/images/ogimage.png')}`}
        />
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
          href="//fonts.googleapis.com/css?family=Lato:300,700"
          rel="stylesheet"
          type="text/css"
        />
      </Head>
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: navCollapsed ? 'initial' : '#343a40' }}
      >
        <a href="/" className="navbar-brand">
          Cofacts
        </a>
        <button
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          className="navbar-toggler"
          onClick={toggleNav}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={cx({ collapse: navCollapsed })}>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a href="/articles" className="nav-link">
                Hoax Search
              </a>
            </li>
            <li className="nav-item active">
              <a href="/replies" className="nav-link">
                Response List
              </a>
            </li>
            <li className="nav-item active">
              <a
                href="https://www.facebook.com/groups/cofacts/permalink/1959641497601003/"
                className="nav-link"
              >
                Facebook
              </a>
            </li>
            <li className="nav-item active">
              <a href="https://beta.hackfoldr.org/cofacts" className="nav-link">
                Hackfoldr
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
              Follow our LINE@, and send any suspected hoax, scam, rumor, or
              urban legend to verify its truth.
            </h4>
            <div className="sep light-dark gap-sm"></div>
            <p>
              Search by ID “@cofacts” or scan our QR Code to follow our Cofacts
              LINE@ account, forward any possible hoax, scam, rumor, or urban
              legend sources to it, then our chatbot will help you check the
              credibility of the source!
            </p>
            <p>
              <a
                href="https://g0v.hackmd.io/s/rkVVQDmqQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <small>
                  TUTORIAL <i className="fa fa-arrow-right"></i>
                </small>
              </a>
            </p>
            <p>
              <img src={require('components/LandingPage/images/qr-code.png')} />
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
            <h2>Write your own response and share your wisdom!</h2>
          </div>
          <p>
            The responses a user see are also submitted by other users. Here we
            do not have all-knowing judges, only citizens who cooperate and
            contribute. Think others’ response not good enough? Is there
            something you’d like to find out but it has not been requested yet?
            Write your own response and help others!
          </p>
          <p>
            Every suspicious source is sent from an user, which is open to
            public for examination and response. One single request can be
            responded by different people, allowing each response to take a step
            closer to unravelling its truth.
          </p>
          <p className="text-center">
            <a href="/articles" className="btn btn-secondary btn-lg mr-2">
              HOAX SEARCH <i className="fa fa-database"></i>
            </a>
          </p>
        </div>
      </div>
      <div className="section section-traction bg-danger text-light">
        <div className="inner text-center">
          <h2>A war between hoaxes and facts.</h2>
          <p>The difficulties we face...</p>
          <div
            style={{
              borderBottom: '1 solid rgba(255,255,255,0.6)',
              margin: '40px auto',
              width: '150px',
            }}
            className="sep"
          ></div>
          <div className="row">
            <div className="col-6 col-md-3">
              About
              <div className="huge">250</div> new messages entering our database
              each week.
            </div>
            <div className="col-6 col-md-3">
              About
              <div className="huge">210</div> people forwarding new messages to
              our database each week.
            </div>
            <div className="col-6 col-md-3">
              But less than
              <div className="huge">12</div> active editors can help us respond
              each week.
            </div>
            <div className="col-6 col-md-3">
              Every
              <div className="huge">2</div> months we hold{' '}
              <a href="https://cofacts.kktix.cc/">a gathering of editors.</a>
            </div>
          </div>
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
            <h2>Features</h2>
          </div>
          <p>
            Cofacts program encourages people to become part of a chatbot for
            helping others. With your research, you can add your hoax busting
            responses into our database to help people acknowledge its lies.
          </p>
          <br />
          <div className="row">
            <div className="col-6 col-md-3">
              <div className="media">
                <i className="fa mr-2 mt-1 fa-cube"></i>
                <div className="media-body">
                  <span className="name">
                    <b>Crowdsourcing</b>
                  </span>
                  <p
                    style={{
                      lineHeight: '1.4em',
                      fontSize: '0.6em',
                      color: '#444',
                    }}
                  >
                    Anyone can verify and respond to other’s requests on
                    possible hoax and upload it into our database. We encourage
                    citizens to join our program, even invite your mom and dad
                    to join.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="media">
                <i className="fa mr-2 mt-1 fa-cube"></i>
                <div className="media-body">
                  <span className="name">
                    <b>Real-Time Response</b>
                  </span>
                  <p
                    style={{
                      lineHeight: '1.4em',
                      fontSize: '0.6em',
                      color: '#444',
                    }}
                  >
                    Once someone respond to your pending request, the chatbot
                    will answer you through LINE. It’s fast and immediate, you
                    don’t even have to wait. Better yet, you don’t even need to
                    say ‘thank you’. Ask the bot to verify for you, no need to
                    feel uncomfortable asking it for favors.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="media">
                <i className="fa mr-2 mt-1 fa-cube"></i>
                <div className="media-body">
                  <span className="name">
                    <b>Different Views</b>
                  </span>
                  <p
                    style={{
                      lineHeight: '1.4em',
                      fontSize: '0.6em',
                      color: '#444',
                    }}
                  >
                    Knowing what’s fact and what’s an opinion. Seeing different
                    sides of the story makes you realize your own blindspot,
                    allowing everyone to respect each other’s perspectives.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="media">
                <i className="fa mr-2 mt-1 fa-cube"></i>
                <div className="media-body">
                  <span className="name">
                    <b>Open Source Authorization</b>
                  </span>
                  <p
                    style={{
                      lineHeight: '1.4em',
                      fontSize: '0.6em',
                      color: '#444',
                    }}
                  >
                    Codes of different patches, meeting records and database
                    statistics are all opened to public. We encourage more open
                    source data; work and share with others in a transparent
                    environment, create different possibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section section-media bg-warning text-dark">
        <div className="inner">
          <h2 className="text-center">See what others have to say.</h2>
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
            <h2>Join our open source community.</h2>
          </div>
          <p>
            Cofacts needs all of you to help our current program to be more
            efficient and complete. This collaborate program cannot be completed
            by a small community, we need everyone to contribute, write codes,
            bust hoaxes and research. Self-motivated researching and responding
            is the way to transcend this program into something great.
          </p>
          <p>We welcome everyone to join us, here is what we’re looking for.</p>
          <ul>
            <li>
              People with curiosity and a sense of justice that can help us bust
              hoaxes and help others.
            </li>
            <li>
              Coding is a piece of cake to you? Join us fast and work together
              with us on our issues.
            </li>
          </ul>
          <br />
          <div className="text-center">
            <a
              href="https://hackmd.io/@B4gs1CECTRyI5Ny7vSy6dQ/SklM4dV9m/https%3A%2F%2Fg0v.hackmd.io%2FWaz-B9sORSOPLp6nAOS82w?type=book&fbclid=IwAR0pNUVLOllNTgoPE8dxbJSt8VCvIeCK_h0MszfAS2aiUFLj3XFfTfKXM4Q"
              className="btn btn-secondary btn-lg mr-2"
            >
              I want to learn how to use Cofacts{' '}
              <i className="fa fa-user-plus"></i>
            </a>
            <a
              href="https://hackmd.io/s/SyMRyrfEl"
              className="btn btn-secondary btn-lg mr-2"
            >
              I can help bust hoaxes <i className="fa fa-pencil-square-o"></i>
            </a>
            <a
              href="https://hackmd.io/s/r1nfwTrgM"
              className="btn btn-secondary btn-lg mr-2"
            >
              I can help with coding <i className="fa fa-code"></i>
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
                  <label>Cofacts</label>
                  <div className="item">
                    <a href="https://bit.ly/cofacts-quickstart">
                      Program Introduction
                    </a>
                  </div>
                  <div className="item">
                    <a href="https://grants.g0v.tw/projects/588fa7b382223f001e022944">
                      Original Program
                    </a>
                  </div>
                  <div className="item">
                    <a href="https://github.com/cofacts">Source code</a>
                  </div>
                  <div className="item">
                    <a href="https://www.facebook.com/groups/cofacts/">
                      Facebook Club
                    </a>
                  </div>
                  <div className="item">
                    <a href="mailto:cofacts@googlegroups.com">Contact</a>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <label>Notices</label>
                  <div className="item">
                    <a href="https://beta.hackfoldr.org/cofacts/https%253A%252F%252Fhackmd.io%252Fs%252FryE0G6rxG">
                      Cofacts Copyrights
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
          font-family: Lato, Helvetica, Arial, sans-serif;
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
        .huge {
          font-size: 3em;
          font-weight: 900;
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

export default Home;
