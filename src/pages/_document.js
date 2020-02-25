/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

/**
 * Override class for building each document's HTML used to include the
 * content security policy and custom style sheets.
 * @class
 */
class CustomDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    // eslint-disable-next-line react/jsx-props-no-spreading
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html lang="en">
        <Head>
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

export default CustomDocument;
