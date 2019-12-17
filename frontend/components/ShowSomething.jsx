import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Container, Button, Row, Col, Badge, Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import gql from 'graphql-tag';
import fetch from 'isomorphic-unfetch';

// eslint-disable-next-line no-unused-vars
import { SET_ALERT, getMessageFromGraphQLError } from 'lib/clientState';

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

const WhiteContainer = styled(Container)`
  background-color: ${({ theme }) => theme.colors.containerBackground};
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid black;
`;

const SomethingForm = styled(Form)`
  background-color: ${({ theme }) => theme.colors.containerBackground};
  padding: 0.5rem;
  border: 1px solid black;
`;

export const ShowSomething = () => {
  // Create state variables and update methods
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);
  const [apiResult, setApiResult] = useState('');
  const [apiPostResult, setApiPostResult] = useState('');
  // create function to invoke the alert muration
  const [
    setAlert,
    // eslint-disable-next-line no-unused-vars
    { loading: setAlertLoading, error: setAlertError },
  ] = useMutation(SET_ALERT);
  // create function to invoke the do something muration
  const [
    doSomething,
    // eslint-disable-next-line no-unused-vars
    { loading: doSomethingLoading, error: doSomethingError },
  ] = useMutation(DO_SOMETHING_MUTATION, {
    onCompleted: (data) => {
      console.log('Did Something');
      console.log(jsonColorizer(stringify(data, null, 2)));
      setMessage(data.doSomething.message);
      setCount(count + 1);
    }
  });
  // call GraphQL query
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_SOMETHING, { variables: { code: '1' } });

  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>ERROR!...{queryError}</p>;
  if (!data.something) return <p>Nothing Found</p>;

  return (<>
    <WhiteContainer fluid>
      <Row>
        <Col>Something&apos;s Name: {data.something.name}</Col>
      </Row>
    </WhiteContainer>
    <WhiteContainer fluid>
      <Row>
        <Col>
          <Button onClick={(e) => {
              e.preventDefault();
              console.log('Doing Something');
              doSomething();
            }}
          >Click Me <FontAwesomeIcon icon="arrow-right" />
          </Button>
        </Col>
        <Col>
          Result: {message}<Badge>{count}</Badge>
        </Col>
      </Row>
    </WhiteContainer>
    <WhiteContainer fluid>
      <Row>
        <Col>
          <Button onClick={(e) => {
              e.preventDefault();
              console.log('Alerting!');
              setAlert({ variables: { alertType: 'danger', alertContent: 'Please don\'t click that button!' } });
            }}
          >Show Alert
          </Button>
        </Col>
      </Row>
    </WhiteContainer>
    <WhiteContainer fluid>
      <Row>
        <Col>
          <Button onClick={(e) => {
              e.preventDefault();
              console.log('RESTING!');
              fetch('/api/something')
                .then(res => res.text())
                .then(text => {
                  console.log('REST result: ' + text);
                  setApiResult(text);
                });
            }}
          >Call API Method
          </Button>
        </Col>
        <Col>API Result: {apiResult}</Col>
      </Row>
    </WhiteContainer>
    <SomethingForm>
      <FormGroup>
        <Label for="dataToPost">Data to Post to API</Label>
        <Input type="text" name="dataToPost"
          id="dataToPost" placeholder="Enter something here" />
      </FormGroup>

      <Button onClick={(e) => {
        e.preventDefault();
        console.log('POSTING!...' + e.target.form.dataToPost.value);
        if ( !e.target.form.dataToPost.value ) {
          setAlert({ variables: { alertType: 'warning', alertContent: 'Please enter something in the field before clicking.' } });
          return;
        }
        fetch('/api/something', {
          method: 'POST',
          body:    JSON.stringify({ dataToPost: e.target.form.dataToPost.value }),
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => res.json())
          .then(result => {
            console.log('REST result: ' + JSON.stringify(result));
            setApiPostResult(result.result);
          });
}}>Submit</Button>
      <FormGroup>
        <Label for="postResult">Result from the API</Label>
        <Input readOnly value={apiPostResult} />
      </FormGroup>
    </SomethingForm>
  </>);
};

export default ShowSomething;
