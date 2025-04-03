import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import NewsItem from "./NewsItem";

export default function Home(props) {
  let [articles, setArticles] = useState([]);
  let [totalResults, setTotalResults] = useState(0);
  let [page, setPage] = useState(1);

  async function getAPIData() {
    let response = await fetch(
      `https://newsapi.org/v2/everything?q=${
        props.search ? props.search : props.q
      }&pageSize=24&sortBy=publishedAt&language=${
        props.language
      }&apiKey=b3f64e86d625421080b625eb13d95e49`
    );
    response = await response.json();

    if (response.articles) {
      setArticles(response.articles.filter((x) => x.title !== "[Removed]"));
      setTotalResults(response.totalResults);
    }
  }

  async function fetchData() {
    setPage(page + 1);
    let response = await fetch(
      `https://newsapi.org/v2/everything?q=${
        props.search ? props.search : props.q
      }&pageSize=24&page=${page}&sortBy=publishedAt&language=${
        props.language
      }&apiKey=b3f64e86d625421080b625eb13d95e49`
    );
    response = await response.json();

    if (response.articles)
      setArticles(
        articles.concat(
          response.articles.filter((x) => x.title !== "[Removed]")
        )
      );
  }

  useEffect(() => {
    getAPIData()
  }, [props])
  return (
    <>
      <div className="container-fluid my-1">
        <h5 className="background text-light text-center p-2 my-1 text-capitalize">
          {props.search ? props.search : props.q} News Articles
        </h5>
        <InfiniteScroll
          dataLength={articles.length} 
          next={fetchData}
          hasMore={articles.length < totalResults}
          loader={
            <div className="my-5 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
        >
          <div className="row">
            {articles.map((item, index) => {
              return (
                <NewsItem
                  key={index}
                  source={item.source.name}
                  title={item.title}
                  description={item.description}
                  url={item.url}
                  pic={item.urlToImage}
                  date={item.publishedAt}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
}
