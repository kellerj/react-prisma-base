/* eslint-disable react/jsx-max-depth */
import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Alert } from 'reactstrap';
import { Query, Mutation } from 'react-apollo';

import Header from './Header';
import Meta from './Meta';

import { LOCAL_STATE_QUERY, CLOSE_ALERT } from '../lib/clientState';

const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0,0,0,0.09)',
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
    font-size: 1.5rem;
  }
  .pagination-lg .page-link {
    /* font-size: 2rem; */
  }
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  //background: ${props => props.theme.red};
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
