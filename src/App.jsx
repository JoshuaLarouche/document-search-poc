import React from "react";
import { InstantSearch, InfiniteHits, SearchBox, Stats, Highlight } from "react-instantsearch-dom";
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
//   const authorsHighlighted = hit._highlightResult.authors.map((author, index) => (
//     <span key={index}>
//       <Highlight attribute={`authors[${index}].first_name`} hit={hit} tagName="mark" />{" "}
//       <Highlight attribute={`authors[${index}].last_name`} hit={hit} tagName="mark" />
//       {index < hit.authors.length - 1 ? ", " : ""}
//     </span>
//   ));

  
  return (
    <div className="hit" key={hit.id}>
      <div className="hit-title">
        <Highlight attribute="dc:title" hit={hit} />
      </div>
      <div className="hit-creator">
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
        <Highlight attribute="X-TIKA:content" hit={hit} />
      </div>
    </div>
  );
};

export default App;