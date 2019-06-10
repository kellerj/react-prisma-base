import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import graphql from 'graphql-tag';

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

  doSomething = async (e, doSomething) => {
    e.preventDefault();
    console.log(`Doing Something`);
    const response = await doSomething();
    console.log(response);
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
                <button onClick={(e) => this.doSomething(e, doSomething)} />
                </div>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
