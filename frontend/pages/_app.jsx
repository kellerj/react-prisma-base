import React from 'react';
import App from 'next/app';
import { ApolloProvider } from 'react-apollo';

import '../styles/styles.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { library } from '@fortawesome/fontawesome-svg-core';
// Find Icons Here: https://fontawesome.com/cheatsheet?from=io
import {
  faArrowRight, faUserCircle, faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeProvider } from 'styled-components';

import Page from 'components/Page';
import withApolloClient from 'lib/apolloClient';

// Loads these into the bundle for use by the <FontAwesomeIcon> tag
library.add(faArrowRight);
library.add(faUserCircle);
library.add(faQuestionCircle);

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
