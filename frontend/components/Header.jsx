import React, { Component } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

import Nav from './Nav';
import Cart from './Cart';
import Search from './Search';

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
        <div>
          <Nav pathname={this.props.pathname} />
        </div>
        <Search />
        <Cart />
      </>
    );
  }
}

export default Header;
