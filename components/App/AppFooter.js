import React from 'react';
import { EDITOR_FACEBOOK_GROUP, CONTACT_EMAIL } from '../../constants/urls';

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
      <p>
        <a
          href={EDITOR_FACEBOOK_GROUP}
          target="_blank"
          rel="noopener noreferrer"
        >
          編輯求助區
        </a>
        ・
        <a href={`mailto:${CONTACT_EMAIL}`}>連絡信箱</a>
      </p>
      <style jsx>{`
        footer {
          margin: 0 20px 44px;
          text-align: center;
        }
        img {
          width: 100%;
          max-width: 300px;
        }
      `}</style>
    </footer>
  );
}
