import md5 from 'blueimp-md5';

export default (email = '', s = 80, d = 'mp', r = 'g') => {
  const GRAVATAR_URL = 'https://www.gravatar.com/avatar/';
  const hash = md5(email.trim().toLocaleLowerCase());
  const params = `?s=${s}&d=${d}&r=${r}`;
  return `${GRAVATAR_URL}${hash}${params}`;
};
