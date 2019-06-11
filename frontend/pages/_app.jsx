import React from 'react';
import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import '../styles/styles.scss';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import {
//   faShoppingCart, faCartPlus, faEdit, faTrashAlt, faUserCircle, faSearch,
// } from '@fortawesome/free-solid-svg-icons';

import Page from '../components/Page';
import withData from '../lib/withData';

// library.add(faShoppingCart);
// library.add(faCartPlus);
// library.add(faEdit);
// library.add(faTrashAlt);
// library.add(faUserCircle);
// library.add(faSearch);

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
      <Container>
        <ApolloProvider client={apollo}>
          <Page {...pageProps}>
            {/* Component here is the component of the page in pages
              - each one will get the query string as a props object. */}
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withData(ThisApp);
