import React, { Component } from 'react';
import Router from 'next/router';
import getConfig from 'next/config';
import NProgress from 'nprogress';

const { appName, instanceId } = getConfig().publicRuntimeConfig;

Router.onRouteChangeChart = () => {
  console.log('onRouteChangeChart triggered');
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  console.log('onRouteChangeComplete triggered');
  NProgress.done();
};
Router.onRouteChangeError = () => {
  console.log('onRouteChangeError triggered');
  NProgress.done();
};

class Header extends Component {
  render() {
    return (
      <>
        <h1>{appName} - {instanceId}</h1>
      </>
    );
  }
}

export default Header;
