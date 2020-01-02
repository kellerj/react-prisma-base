import React from 'react';
import App from 'next/app';
import { ThemeProvider } from 'styled-components';

import Page from 'components/Page';
import { withApollo } from '../lib/apollo';

import '../styles/styles.scss';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import '../lib/icons';
import theme from '../styles/theme.js';

class ThisApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // expose the query string data to the components
    pageProps.query = ctx.query;
    pageProps.pathname = ctx.pathname;
    pageProps.loggedIn = ctx.req && !!ctx.req.user;
    pageProps.user = ctx.req && ctx.req.user;
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Page {...pageProps}>
          {/* Component here is the component of the page in pages
            - each one will get the query string as a props object. */}
          <Component {...pageProps} />
        </Page>
      </ThemeProvider>
    );
  }
}

export default withApollo(ThisApp);
