import React from 'react';
import Router from 'next/router';
import getConfig from 'next/config';
import NProgress from 'nprogress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav, NavItem, Navbar, NavbarBrand, NavbarToggler, NavbarText, Collapse, NavLink } from 'reactstrap';

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

const LoginNavItem = (props) => {
  if ( props.loggedIn ) {
    return (<>
      <NavItem>
        <NavbarText>Hello, {props.user.name}</NavbarText>
      </NavItem>
      <NavItem>
        <NavLink href="/logout">Logout <FontAwesomeIcon icon="user-circle" title={props.user.id} /></NavLink>
      </NavItem>
    </>);
  }
  return (
    <NavItem>
      <NavLink href="/login">Login <FontAwesomeIcon icon="question-circle" /></NavLink>
    </NavItem>
  );
};

const Header = (props) => {
  return (
    <Navbar dark expand
      className="bg-dark">
      <NavbarBrand>{appName} - {instanceId}</NavbarBrand>
      <NavbarToggler />
      <Collapse navbar>
        <Nav navbar className="mr-auto">
          <NavbarText>Other Navigation Links Can Go Here</NavbarText>
        </Nav>
        <Nav navbar>
          <LoginNavItem user={props.user} loggedIn={props.loggedIn} />
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
