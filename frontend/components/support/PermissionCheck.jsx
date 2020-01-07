import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from 'reactstrap';
import Router from 'next/router';

const PermissionCheck = (props) => {
  if (props.authenticationRequired && !props.user) {
    if ( props.redirectOnAuthNFailure ) {
      Router.push('/login');
    }
    return (
      <>
        <Alert color="warning">
          You must be signed in to use this component.
        </Alert>
      </>
    );
  }
  if (props.requiredRoles
    && !props.user.roles.some((p) => props.requiredRoles.includes(p))) {
    return (
      <Alert color="danger">You are not authorized to use this component.</Alert>
    );
  }
  return props.children;
};

PermissionCheck.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  children: PropTypes.node.isRequired,
  authenticationRequired: PropTypes.bool,
  redirectOnAuthNFailure: PropTypes.bool,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};

PermissionCheck.defaultProps = {
  user: null,
  authenticationRequired: true,
  requiredRoles: null,
  redirectOnAuthNFailure: false,
};


export default PermissionCheck;
