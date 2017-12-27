import css from 'styled-jsx/css'; // eslint-disable-line import/no-unresolved

export const mainStyle = css`
  main {
    padding: 24px;
  }
  @media screen and (min-width: 768px) {
    main {
      padding: 40px;
    }
  }
`;

export const hintStyle = css`
  .hint {
    color: #aaa;
  }
`;
