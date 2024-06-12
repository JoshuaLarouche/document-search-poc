import { MeiliSearch } from 'meilisearch'
import documents from './data.json'

const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'rO5_rXjNcNjcO4nXZRKBwFFjhNpAxAym65SFtetSTV0'
  })
  client.index('documents').addDocuments(documents)
    .then((res) => console.log(res))