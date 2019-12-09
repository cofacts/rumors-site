function HackfoldrPage() {
  return null;
}

HackfoldrPage.getInitialProps = function({ res }) {
  // Redirect to hackfoldr
  res.writeHead(303, {
    Location: 'https://beta.hackfoldr.org/cofacts',
  });
  res.end('Redirecting...');
  return {};
};

export default HackfoldrPage;
