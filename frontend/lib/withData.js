import http from 'http';
import https from 'https';
import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import getConfig from 'next/config';

import { Resolvers, Defaults } from './clientState';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
const backendUrl = serverRuntimeConfig.backendUrl || publicRuntimeConfig.backendUrl;

let agent = new http.Agent();
if (backendUrl.startsWith('https')) {
  agent = new https.Agent({ rejectUnauthorized: false });
}

function createClient({ headers }) {
  console.log(`Initializing Apollo Client with Backend URL: ${backendUrl}`);
  return new ApolloClient({
    uri: backendUrl,
    request: (operation) => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
          agent,
        },
        headers,
      });
    },
    clientState: {
      resolvers: Resolvers,
      defaults: Defaults,
    },
  });
}

export default withApollo(createClient);
