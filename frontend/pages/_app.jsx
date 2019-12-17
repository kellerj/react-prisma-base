import React from 'react';
import App from 'next/app';
import { ApolloProvider } from 'react-apollo';
import '../styles/styles.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
// Find Icons Here: https://fontawesome.com/cheatsheet?from=io
import {
  faArrowRight//, faCartPlus, faEdit, faTrashAlt, faUserCircle, faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeProvider } from 'styled-components';

import Page from 'components/Page';
import withApolloClient from 'lib/apolloClient';

library.add(faArrowRight);
// library.add(faCartPlus);
// library.add(faEdit);
// library.add(faTrashAlt);
// library.add(faUserCircle);
// library.add(faSearch);

const theme = require('../styles/theme.js');

class ThisApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // expose the query string data to the components
    pageProps.query = ctx.query;
    pageProps.pathname = ctx.pathname;
    return { pageProps };
  }

  render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <ApolloProvider client={apollo}>
          <Page {...pageProps}>
            {/* Component here is the component of the page in pages
              - each one will get the query string as a props object. */}
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </ThemeProvider>
    );
  }
}

export default withApolloClient(ThisApp);
