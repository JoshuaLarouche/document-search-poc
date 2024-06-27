import React from "react";
import { InstantSearch, InfiniteHits, SearchBox, Stats, Highlight, Snippet, Configure, RefinementList } from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import "instantsearch.css/themes/algolia-min.css";
import "./App.css";

// TODO: Protect key in secret 
const searchClient = instantMeiliSearch(
  "https://test.doc.search.apps.silver.devops.gov.bc.ca",
  "M01OpyNyPSDikZ9o-A7ZqKEbbl4QgrwiipMVW--6Y1Q"
);

const App = () => (
  <div className="ais-InstantSearch">
    <h1>Document Search Proof of Concept</h1>
    <InstantSearch indexName="test" searchClient={searchClient}>
      <div className="left-panel">
        <h2>Filter by Content Type</h2>
        <RefinementList attribute="Content-Type" />
      </div>
      <div className="right-panel">
        <Stats />
        <SearchBox />
        <Configure attributesToSnippet={["X-TIKA:content:100"]} />
        <InfiniteHits hitComponent={Hit} />
      </div>
    </InstantSearch>
  </div>
);

const Hit = ({ hit }) => {
  return (
    <div className="hit" key={hit.id}>
      <div className="hit-field">
        <strong>Title:</strong> <Highlight attribute="title" hit={hit} />
      </div>
      <div className="hit-field">
        <strong>Filename:</strong> <Highlight attribute="filename" hit={hit} />
      </div>
      <div className="hit-field">
        <strong>Last Author:</strong> <Highlight attribute="meta:last-author" hit={hit} />
      </div>
      <div className="hit-field">
        <strong>Creator:</strong> <Highlight attribute="dc:creator" hit={hit} />
      </div>
      <div className="hit-field">
        <strong>Publisher:</strong> <Highlight attribute="dc:publisher" hit={hit} />
      </div>
      <div className="hit-field">
        <strong>Company:</strong> <Highlight attribute="extended-properties:Company" hit={hit} />
      </div>
      <div className="hit-field">
        <strong>Content:</strong> <Snippet attribute="X-TIKA:content" hit={hit} tagName="mark" />
      </div>
    </div>
  );
};

export default App;
