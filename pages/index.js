import AppBar from '@material-ui/core/AppBar';
import Link from 'next/link'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ArticleList from "../components/ArticleList";

function Home() {
  return <div>
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Cofacts
        </Typography>

      </Toolbar>
    </AppBar>
    INDEX!
    <p>
      <Link href="/articles">
        <a>List page</a>
      </Link>
    </p>
  </div>;
}

export default Home;
