import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Container, Button, Row, Col, Badge, Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import gql from 'graphql-tag';
import fetch from 'isomorphic-unfetch';

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

export const ShowSomething = () => {
  // Create state variables and update methods
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);
  const [apiResult, setApiResult] = useState('');
  const [apiPostResult, setApiPostResult] = useState('');
  // create function to invoke the alert muration
  const [
    setAlert,
    { loading: setAlertLoading, error: setAlertError },
  ] = useMutation(SET_ALERT);
  // create function to invoke the do something muration
  const [
    doSomething,
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
    <Container fluid={true} style={{marginBottom: '1rem'}}>
      <Row>
        <Col>Something&apos;s Name: {data.something.name}</Col>
      </Row>
    </Container>
    <Container fluid={true} style={{marginBottom: '1rem'}}>
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
    </Container>
    <Container fluid={true} style={{marginBottom: '1rem'}}>
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
    </Container>
    <Container fluid={true} style={{marginBottom: '1rem', backgroundColor: 'white'}}>
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
                })
            }}
          >Call API Method
          </Button>
        </Col>
        <Col>API Result: {apiResult}</Col>
      </Row>
    </Container>
    <Form>
      <FormGroup>
        <Label for="dataToPost">Data to Post to API</Label>
        <Input type="text" name="dataToPost" id="dataToPost" placeholder="Enter something here" />
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
          })
}}>Submit</Button>
      <FormGroup>
        <Label for="postResult">Result from the API</Label>
        <Input readOnly value={apiPostResult} />
      </FormGroup>
    </Form>

  </>);
}

export default ShowSomething;
