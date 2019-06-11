import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';

const { appName } = getConfig().publicRuntimeConfig;

const Meta = () => (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <link rel="shortcut icon" href="/static/favicon.ico" />
    <link
      rel="stylesheet" href="/static/nprogress.css"
      type="text/css"
    />
    <title>{appName}</title>
  </Head>
);

export default Meta;
