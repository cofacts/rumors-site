function AnalyticsPage() {
  return null;
}

AnalyticsPage.getInitialProps = function({ res }) {
  // Redirect to analytics
  res.writeHead(303, {
    Location:
      'https://datastudio.google.com/open/18J8jZYumsoaCPBk9bdRd97GKvi_W5v-r',
  });
  res.end('Redirecting...');
  return {};
};

export default AnalyticsPage;
