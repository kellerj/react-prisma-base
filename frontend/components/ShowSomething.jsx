import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import graphql from 'graphql-tag';

const jsonColorizer = require('json-colorizer');
const stringify = require('json-stringify-safe');

const GET_SOMETHING = graphql`
  query GET_SOMETHING {
    getSomething {
      id
      name
    }
  }
`;

const DO_SOMETHING_MUTATION = graphql`
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
    this.setState({ message: response.message });
  }

  render() {
    return (
      <Query query={GET_SOMETHING}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.getSomething) return <p>Nothing Found</p>;
          return (
            <Mutation mutation={DO_SOMETHING_MUTATION}>
              {(doSomething, {
                mutationLoading, error,
              }) => (
                // this.updateItem(e, updateItem)}
                <div>
                  <p>{data}</p>
                  <p><button type="button" onClick={e => this.doSomething(e, doSomething)} /></p>
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
