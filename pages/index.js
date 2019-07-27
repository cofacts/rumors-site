import ArticleList from "../components/ArticleList";

function Home() {
  return <div>
    Welcome to Next.js! { new Date().toLocaleString() }

    <ArticleList />
    <style jsx>{`
      div {
        color: red;
      }
    `}</style>
  </div>;
}

export default Home;
