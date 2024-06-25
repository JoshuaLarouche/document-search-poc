import React from "react";
import { InstantSearch, InfiniteHits, SearchBox, Stats, Highlight, Snippet } from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import "instantsearch.css/themes/algolia-min.css";
import "./App.css";

//TODO protect key in secret 
const searchClient = instantMeiliSearch(
  "https://test.doc.search.apps.silver.devops.gov.bc.ca",
  "M01OpyNyPSDikZ9o-A7ZqKEbbl4QgrwiipMVW--6Y1Q"
);

const App = () => (
  <div className="ais-InstantSearch">
    <h1>Document Search Proof of Concept</h1>
    <InstantSearch indexName="test" searchClient={searchClient}>
      <Stats />
      <SearchBox />
      <InfiniteHits hitComponent={Hit} />
    </InstantSearch>
  </div>
);

const Hit = ({ hit }) => {
  return (
    <div className="hit" key={hit.id}>
      <div className="hit-title">
        <Highlight attribute="title" hit={hit} />
      </div>
      <div className="hit-filename">
        <Highlight attribute="filename" hit={hit} />
      </div>
      <div className="hit-last-author">
        <Highlight attribute="meta:last-author" hit={hit} />
      </div>
      <div className="hit-creator">
        <Highlight attribute="dc:creator" hit={hit} />
      </div>
      <div className="hit-publisher">
        <Highlight attribute="dc:publisher" hit={hit} />
      </div>
      <div className="hit-company">
        <Highlight attribute="extended-properties:Company" hit={hit} />
      </div>
      <div className="hit-content">
        <Snippet attribute="X-TIKA:content" hit={hit} tagName="mark" />
      </div>
    </div>
  );
};

export default App;