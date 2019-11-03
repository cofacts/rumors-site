import { useState, useEffect } from 'react';
import { t, jt } from 'ttag';

const DEFAULT_CHARACTOR = {
  singular: /* Are you aware that ~ is helping with ... */ t`someone`,
  plural: /* local ~ need your help! */ t`people`,
};

const RANDOM_CHARACTORS = [
  { singular: t`your mom`, plural: t`moms` },
  { singular: t`your dad`, plural: t`dads` },
  { singular: t`your sister`, plural: t`sis` },
  { singular: t`your brother`, plural: t`bro` },
  { singular: t`your colleague`, plural: t`colleagues` },
  { singular: t`your child`, plural: t`children` },
];

function Jumbotron() {
  const [currentIdx, setCurrentIdx] = useState(-1); // default charactor
  useEffect(() => {
    // Switch out default charactor on load
    setCurrentIdx(Math.floor(Math.random() * RANDOM_CHARACTORS.length));

    const handle = setInterval(() => {
      setCurrentIdx(Math.floor(Math.random() * RANDOM_CHARACTORS.length));
    }, 3000);

    return () => {
      clearInterval(handle);
    };
  }, []);

  const currentCharactor = RANDOM_CHARACTORS[currentIdx] || DEFAULT_CHARACTOR;

  const someone = (
    <span className="switching-item" key={currentIdx}>
      {currentCharactor.singular}
    </span>
  );
  const someones = (
    <span className="switching-item" key={currentIdx}>
      {currentCharactor.plural}
    </span>
  );
  const internetHoaxes = (
    <em className="emphasis" key="em">
      internet hoaxes
    </em>
  );

  return (
    <div className="jumbotron text-light">
      <div className="text-center">
        <h1 className="mb-2">
          {jt`Are you aware that ${someone} is helping the spread of ${internetHoaxes}?`}
        </h1>
        <div
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.3)',
            margin: 20,
          }}
        ></div>
        <p>
          {t`Follow our LINE bot or join as one of our Cofacts editor.`}
          <br />
          {jt`Local ${someones} need your protection!`}
        </p>
        <br />
        <a
          style={{ minWidth: 280 }}
          href="/articles"
          className="btn btn-danger btn-lg"
        >
          {t`Start busting hoaxes now`}
        </a>
      </div>
      <style jsx>{`
        .jumbotron {
          height: 100vh;
          max-height: 640px;
          margin-bottom: 0;
          position: relative;
          background: url(${require('components/LandingPage/images/jumbotron.jpg')})
            center center no-repeat #222;
          background-size: cover;
          border-radius: 0;
        }
        /* :global because these elements are variables */
        .jumbotron :global(.switching-item) {
          position: relative;
          animation: fade-in 0.7s;
        }
        .jumbotron :global(.emphasis) {
          font-style: normal;
          color: #ffc107;
        }
        .text-center {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          height: 210px;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Jumbotron;
