/* eslint-disable react/jsx-max-depth */
import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Alert } from 'reactstrap';
import { Query, Mutation } from 'react-apollo';

import Header from './Header';
import Meta from './Meta';

import { LOCAL_STATE_QUERY, CLOSE_ALERT } from '../lib/clientState';

const theme = {
  maxWidth: '1000px',
};

// eslint-disable-next-line no-unused-expressions
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

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <Meta />
          <GlobalStyleOverrides />
          <Header pathname={this.props.pathname} />
          <Inner>
            <>
              <Mutation mutation={CLOSE_ALERT}>{closeAlert => (
                <Query query={LOCAL_STATE_QUERY}>
                  {({ data: clientState }) => (
                    <Alert
                      color={clientState.alertType} isOpen={clientState.alertOpen}
                      toggle={closeAlert}
                    >
                      {clientState.alertContent}
                    </Alert>
                  )}
                </Query>
              )}
              </Mutation>
              {this.props.children}
            </>
          </Inner>
        </div>
      </ThemeProvider>
    );
  }
}

export default Page;
