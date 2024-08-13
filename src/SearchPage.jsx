import React from "react";
import {
  InstantSearch,
  InfiniteHits,
  SearchBox,
  Stats,
  Highlight,
  Snippet,
  Configure,
  connectRefinementList,
} from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import 'instantsearch.css/themes/satellite.css';
import { Typography, Divider, Row, Col, Select } from 'antd';

const { Text, Link } = Typography;
const { Option } = Select;

const searchClient = instantMeiliSearch(
  // "https://meilisearch-test.apps.silver.devops.gov.bc.ca",
  // "NKeIxVU7wmZGWoCP2XOCbm53APgLfNxdn8BemhMVmDA"
  "http://localhost:7700",
  "i8RDbqjtK2d8TtflMZNXiBnkgKK5v0tKl1hXpf1n1qw"
);

const contentTypeMapping = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
  "application/pdf": "PDF",
  "application/json; charset=UTF-8": "Plain Text",
};

const CustomRefinementList = ({ items, refine }) => {
  const handleFilterChange = (value) => {
    if (value) {
      refine([value]); // Apply the selected filter
    } else {
      refine([]); // Clear the filter
    }
  };

  return (
    <Select
      placeholder="Select a content type"
      onChange={handleFilterChange}
      style={{ width: 200 }}
      allowClear
    >
      {Object.entries(contentTypeMapping).map(([key, label]) => (
        <Option key={key} value={key}>
          {label}
        </Option>
      ))}
    </Select>
  );
};

const ConnectedRefinementList = connectRefinementList(CustomRefinementList);

const SearchPage = () => (
  <div className="ais-InstantSearch">
    <InstantSearch indexName="uppy" searchClient={searchClient}>
      <SearchBox />
      <Divider className="delineating-line" />
      <div className="filter-options">
        <Text strong>Filter by Content Type</Text>
        <ConnectedRefinementList attribute="Content-Type" />
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
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Text strong>Title: </Text><Highlight attribute="dc:title" hit={hit} />
      </Col>
      <Col span={12}>
        <Text strong>Last Author: </Text><Highlight attribute="meta:last-author" hit={hit} />
      </Col>
      <Col span={12}>
        <Text strong>Creator: </Text><Highlight attribute="dc:creator" hit={hit} />
      </Col>
      <Col span={12}>
        <Text strong>Publisher: </Text><Highlight attribute="dc:publisher" hit={hit} />
      </Col>
      <Col span={12}>
        <Text strong>Company: </Text><Highlight attribute="extended-properties:Company" hit={hit} />
      </Col>
      <Col span={12}>
        <Text strong>Date Created: </Text>{hit["dcterms:created"]}
      </Col>
      <Col span={12}>
        <Text strong>Date Last Modified: </Text>{hit["dcterms:modified"]}
      </Col>
      {hit.hyperlink && (
        <Col span={24}>
          <Text strong>Original File Location: </Text>
          <Link href={hit.hyperlink} target="_blank" rel="noopener noreferrer">
            {hit.hyperlink}
          </Link>
        </Col>
      )}
      <Col span={24}>
        <Text strong>Additional Metadata: </Text>{hit["additionalField"]}
      </Col>
      <Col span={24}>
        <Text strong>Status: </Text>{hit.status} {/* Display status */}
      </Col>
      <Col span={24}>
        <Text strong>Content: </Text>
        <Snippet attribute="X-TIKA:content" hit={hit} tagName="mark" />
      </Col>
    </Row>
  </div>
);

export default SearchPage;
