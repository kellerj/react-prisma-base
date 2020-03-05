import React from 'react';
import Router from 'next/router';
import getConfig from 'next/config';
import NProgress from 'nprogress';
import { Nav, NavItem, Navbar, NavbarBrand, NavbarToggler, NavbarText, Collapse, NavLink } from 'reactstrap';
import { UserCircle, QuestionCircle } from '@styled-icons/fa-solid';
import log from 'loglevel';

const { appName, instanceId } = getConfig().publicRuntimeConfig;

Router.onRouteChangeChart = () => {
  log.debug('onRouteChangeChart triggered');
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  log.debug('onRouteChangeComplete triggered');
  NProgress.done();
};
Router.onRouteChangeError = () => {
  log.debug('onRouteChangeError triggered');
  NProgress.done();
};

const LoginNavItem = (props) => {
  if ( props.loggedIn ) {
    return (<>
      <NavItem>
        <NavbarText>Hello, {props.user.name}</NavbarText>
      </NavItem>
      <NavItem>
        <NavLink href="/logout">Logout <UserCircle title={props.user.id} /></NavLink>
      </NavItem>
    </>);
  }
  return (
    <NavItem>
      <NavLink href="/login">Login <QuestionCircle title="Not Logged In" /></NavLink>
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
