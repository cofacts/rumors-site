import React from 'react';

export default function AppFooter() {
  return (
    <footer>
      <a
        href="https://grants.g0v.tw/power/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://grants.g0v.tw/images/power/poweredby-long.svg"
          alt="Powered by g0v"
        />
      </a>
      <style jsx>{`
        footer {
          text-align: center;
          margin: 0 20px 44px;
        }
        img {
          max-width: 300px;
        }
      `}</style>
    </footer>
  );
}
