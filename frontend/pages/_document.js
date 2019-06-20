/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import getConfig from 'next/config';

const { BACKEND_URL } = getConfig().publicRuntimeConfig;

const cspBuilder = require('content-security-policy-builder');

const csp = cspBuilder({
  directives: {
    defaultSrc: "'none'",
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: '*',
    objectSrc: "'none'",
    mediaSrc: "'none'",
    frameSrc: "'none'",
    connectSrc: ["'self'", BACKEND_URL],
  },
});

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          {process.env.NODE_ENV !== 'development' && (
            <meta
              httpEquiv="Content-Security-Policy"
              content={csp}
            />
          )}
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
