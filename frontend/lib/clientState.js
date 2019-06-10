import gql from 'graphql-tag';

export const LOCAL_STATE_QUERY = gql`
  query {
    alertType @client
    alertContent @client
    alertOpen @client
  }
`;

export const SET_ALERT = gql`
  mutation($alertType: String!, $alertContent: String!) {
     setAlert(alertType: $alertType, alertContent: $alertContent) @client
  }
`;

export const getMessageFromGraphQLError = (error) => {
  if (error.networkError
    && error.networkError.result.errors[0]
    && error.networkError.result.errors[0].message) {
    return error.networkError.result.errors[0].message;
  }
  if (error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message) {
    return error.graphQLErrors[0].message;
  }
  if (error.message) {
    return error.message;
  }
  console.log(JSON.stringify(error, null, 2));
  return JSON.stringify(error);
};

export const CLOSE_ALERT = gql`
  mutation {
     closeAlert @client
  }
`;

export const Defaults = {
  //todo error - clear on page change
  alertType: 'success',
  alertContent: '',
  alertOpen: false,
};

export const Resolvers = {
  Mutation: {
    toggleCart(_, variables, { cache }) {
      const { cartOpen } = cache.readQuery({
        query: LOCAL_STATE_QUERY,
      });
      const data = {
        data: {
          cartOpen: !cartOpen,
        },
      };
      cache.writeData(data);
      return data;
    },
    setAlert(_, variables, { cache }) {
      console.log(variables);
      const data = {
        data: {
          alertType: variables.alertType,
          alertContent: variables.alertContent,
          alertOpen: true,
        },
      };
      cache.writeData(data);
      return data;
    },
    closeAlert(_, variables, { cache }) {
      console.log(variables);
      const data = {
        data: {
          alertOpen: false,
        },
      };
      cache.writeData(data);
      return data;
    },
  },
};
