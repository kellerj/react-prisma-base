import React from 'react';
import App from 'next/app';
import { ThemeProvider } from 'styled-components';

import Page from 'components/Page';
import { withApollo } from '../lib/apollo';

import '../styles/styles.scss';
import theme from '../styles/theme.js';
import log from 'loglevel';
import getConfig from 'next/config';

const { loggingUUID } = getConfig().publicRuntimeConfig;

// Need to protected this from being run when code is being run on the server
if ( process.browser ) {
  // This posts any warn+ messages to the /logger path on the front end for inclusion in the server logs there
  require('loglevel-plugin-remote').apply(log, {
    url: '/logger',
    method: 'POST',
    timeout: 500,
    interval: 500,
    level: 'warn',
    token: Buffer.from(loggingUUID).toString('base64')
  });
}

if ( process.env.NODE_ENV === 'development' ) {
  log.setDefaultLevel('info');
}

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
