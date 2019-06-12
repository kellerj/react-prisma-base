import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

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

  doSomething = async (e, doSomething) => {
    e.preventDefault();
    console.log('Doing Something');
    const response = await doSomething();
    console.log(jsonColorizer(stringify(response, null, 2)));
    this.setState({ message: response.data.doSomething.message });
  }

  render() {
    return (
      <Query query={GET_SOMETHING} variables={{ code: '1' }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.something) return <p>Nothing Found</p>;
          return (
            <Mutation mutation={DO_SOMETHING_MUTATION}>
              {(doSomething, {
                mutationLoading, error,
              }) => (
                // this.updateItem(e, updateItem)}
                <div>
                  <p>Something's Name: {data.something.name}</p>
                  <p><button type="button" onClick={e => this.doSomething(e, doSomething)}>Click Me</button></p>
                  <p>Result: {this.state.message}</p>
                </div>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
