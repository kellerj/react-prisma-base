import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Alert } from 'reactstrap';
import { useMutation, useQuery } from '@apollo/react-hooks';

import Header from './Header';
import Meta from './Meta';

import { LOCAL_STATE_QUERY, CLOSE_ALERT } from '../lib/clientState';

const GlobalStyleOverrides = createGlobalStyle`
  body {
    /* font-size: 12pt; */
  }
  button {
    /* font-size: 1.5rem; */
  }
  .btn-lg {
    /* font-size: 2rem; */
  }
  a.nav-link {
    /* font-size: 1.5rem; */
  }
  .pagination-lg .page-link {
    /* font-size: 2rem; */
  }
`;

const Body = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

const Page = (props) => {
  const [ closeAlert ] = useMutation(CLOSE_ALERT);
  const { data: clientState } = useQuery(LOCAL_STATE_QUERY);
  return (
    <>
      <Meta />
      <GlobalStyleOverrides />
      <Header pathname={props.pathname} />
      <Body>
        <>
          <Alert
            color={clientState && clientState.alertType}
            isOpen={clientState && clientState.alertOpen}
            toggle={closeAlert}
          >
            {clientState && clientState.alertContent}
          </Alert>
          {props.children}
        </>
      </Body>
    </>
  );
};

export default Page;
