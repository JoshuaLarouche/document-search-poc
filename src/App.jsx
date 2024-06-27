import React from "react";
import { 
  InstantSearch, 
  InfiniteHits, 
  SearchBox, 
  Stats, 
  Highlight, 
  Snippet, 
  Configure, 
  RefinementList 
} from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import "instantsearch.css/themes/algolia-min.css";
import "./App.css";

// TODO: Protect key in secret 
const searchClient = instantMeiliSearch(
  "https://test.doc.search.apps.silver.devops.gov.bc.ca",
  "M01OpyNyPSDikZ9o-A7ZqKEbbl4QgrwiipMVW--6Y1Q"
);

// Mapping long content-type names to user-friendly names
const contentTypeMapping = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
  "application/pdf": "PDF",
  "application/json; charset=UTF-8": "Plain Text",
  // Add other mappings as needed
};

const App = () => (
  <div className="ais-InstantSearch">
    <h1>Document Search Proof of Concept</h1>
    <InstantSearch indexName="test" searchClient={searchClient}>
      <div className="left-panel">
        <h2>Filter by Content Type</h2>
        <RefinementList 
          attribute="Content-Type" 
          transformItems={items =>
            items.map(item => ({
              ...item,
              label: contentTypeMapping[item.label] || item.label,
            }))
          }
        />
      </div>
      <div className="right-panel">
        <SearchBox />
        <Stats />
        <Configure attributesToSnippet={["X-TIKA:content:100"]} hitsPerPage={10} />
        <InfiniteHits hitComponent={Hit} />
      </div>
    </InstantSearch>
  </div>
);

const Hit = ({ hit }) => (
  <div className="hit" key={hit.id}>
    <div className="hit-field">
      <strong>Title:</strong> <Highlight attribute="dc:title" hit={hit} />
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
      <strong>Date Created:</strong> {hit["dcterms:created"]} {/* Display created date */}
    </div>
    <div className="hit-field">
      <strong>Date Last Modified:</strong> {hit["dcterms:modified"]} {/* Display modified date */}
    </div>
    <div className="hit-field">
      <strong>Content:</strong> <Snippet attribute="X-TIKA:content" hit={hit} tagName="mark" />
    </div>
  </div>
);

export default App;
