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
import 'instantsearch.css/themes/satellite.css';
import "./SearchPage.css";
import logo from './assets/BCID_H_rgb_pos.png';

const searchClient = instantMeiliSearch(
  "https://test.doc.search.apps.silver.devops.gov.bc.ca",
  "M01OpyNyPSDikZ9o-A7ZqKEbbl4QgrwiipMVW--6Y1Q"
  // "http://localhost:7700",
  // "ozREe6YsmS6j9UMiLVJX78bKqp0bkGAUe7P2eXzAoEM"
);

const contentTypeMapping = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
  "application/pdf": "PDF",
  "application/json; charset=UTF-8": "Plain Text",
};

const SearchPage = () => (
  <div className="ais-InstantSearch">
    <InstantSearch indexName="uppy" searchClient={searchClient}>
      <SearchBox />
      <hr className="delineating-line" />
      <div className="filter-options">
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
        <Stats />
        <Configure attributesToSnippet={["X-TIKA:content:100"]} hitsPerPage={10} />
        <div className="hits">
          <InfiniteHits hitComponent={Hit} />
        </div>
      </div>
    </InstantSearch>
  </div>
);

const Hit = ({ hit }) => (
  <div className="hit" key={hit.id}>
    <div className="hit-field"><strong>Title:</strong> <Highlight attribute="dc:title" hit={hit} /></div>
    <div className="hit-field"><strong>Last Author:</strong> <Highlight attribute="meta:last-author" hit={hit} /></div>
    <div className="hit-field"><strong>Creator:</strong> <Highlight attribute="dc:creator" hit={hit} /></div>
    <div className="hit-field"><strong>Publisher:</strong> <Highlight attribute="dc:publisher" hit={hit} /></div>
    <div className="hit-field"><strong>Company:</strong> <Highlight attribute="extended-properties:Company" hit={hit} /></div>
    <div className="hit-field"><strong>Date Created:</strong> {hit["dcterms:created"]}</div>
    <div className="hit-field"><strong>Date Last Modified:</strong> {hit["dcterms:modified"]}</div>
    <div className="hit-field"><strong>Content:</strong> <Snippet attribute="X-TIKA:content" hit={hit} tagName="mark" /></div>
  </div>
);

export default SearchPage;