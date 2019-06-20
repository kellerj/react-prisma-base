import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

import { SET_ALERT, getMessageFromGraphQLError } from '../lib/clientState';

const jsonColorizer = require('json-colorizer');
const stringify = require('json-stringify-safe');

const GET_SOMETHING = gql`
  query GET_SOMETHING($code: String!) {
    something(where: { code: $code }) {
      id
      code
      name
    }
  }
`;

const DO_SOMETHING_MUTATION = gql`
  mutation DO_SOMETHING_MUTATION {
    doSomething {
      message
    }
  }
`;

export default class ShowSomething extends Component {
  state = {
    message: '',
  }

  render() {
    return (
      <Mutation
        mutation={SET_ALERT}
      >{setAlert => (
        <Query query={GET_SOMETHING} variables={{ code: '1' }}>
          {({ data, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (!data.something) return <p>Nothing Found</p>;
            return (
              <Mutation
                mutation={DO_SOMETHING_MUTATION}
                onCompleted={({ doSomething }) => {
                  console.log('Did Something');
                  console.log(jsonColorizer(stringify(doSomething, null, 2)));
                  this.setState({ message: doSomething.message });
                }}
              >
                {(doSomething, { loading, error }) => (
                  <div>
                    <p>Something&apos;s Name: {data.something.name}</p>
                    <p>
                      <button
                        type="button" onClick={async (e) => {
                          e.preventDefault();
                          console.log('Doing Something');
                          await doSomething();
                        }}
                      >Click Me
                      </button>
                    </p>
                    <p>Result: {this.state.message}</p>
                    <p>
                      <button
                        type="button" onClick={(e) => {
                          e.preventDefault();
                          console.log('Alerting!');
                          setAlert({ variables: { alertType: 'danger', alertContent: 'Please don\'t click that button!' } });
                        }}
                      >Show Alert
                      </button>
                    </p>
                  </div>
                )}
              </Mutation>
            );
          }}
        </Query>
      )}
      </Mutation>
    );
  }
}
