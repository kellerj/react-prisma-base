import React, { useState } from 'react';
//import { Mutation, Query } from 'react-apollo';
import { useMutation, useQuery } from '@apollo/react-hooks';

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

export const ShowSomething = () => {
  const [message, setMessage] = useState('');
  const [
    setAlert,
    { loading: setAlertLoading, error: setAlertError },
  ] = useMutation(SET_ALERT);
  const [
    doSomething,
    { loading: doSomethingLoading, error: doSomethingError },
  ] = useMutation(DO_SOMETHING_MUTATION, {
    onCompleted: (data) => {
      console.log('Did Something');
      console.log(jsonColorizer(stringify(data, null, 2)));
      setMessage(data.doSomething.message);
    }
  });
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_SOMETHING, { variables: { code: '1' } });

  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>ERROR!...{queryError}</p>;
  if (!data.something) return <p>Nothing Found</p>;
  return (
    <div>
      <p>Something&apos;s Name: {data.something.name}</p>
      <p>
        <button
          type="button" onClick={(e) => {
            e.preventDefault();
            console.log('Doing Something');
            doSomething();
          }}
        >Click Me
        </button>
      </p>
      <p>Result: {message}</p>
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
  );
}

export default ShowSomething;
