const authHeaders = {
  APIAuthToken: 'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXNlciJ9.RT46w06Uu_vLu7vD3DcLCVvEmbfeXcIbS-KR2u68_OGUrEIavQa6PUWfZOBBTMIE',
};

module.exports = [
  {
    endpoint: process.env.BACKEND_URL,
    name: 'Get Something',
    query: `
query GET_SOMETHING($code: String!) {
  something(where: { code: $code }) {
    id
    code
    name
    encryptedData
  }
}
    `,
    variables: JSON.stringify({ code: '1' }, null, 2),
    headers: authHeaders,
  },
  {
    endpoint: process.env.BACKEND_URL,
    name: 'Do Something',
    query: `
mutation DO_SOMETHING_MUTATION {
  doSomething {
    message
  }
}
    `,
    headers: authHeaders,
  },
  {
    endpoint: process.env.BACKEND_URL,
    name: 'Do Something Else',
    query: `
mutation DO_SOMETHING_MUTATION {
  doSomethingElse {
    message
  }
}
        `,
    headers: authHeaders,
  },
  {
    endpoint: process.env.BACKEND_URL,
    name: 'Do Something Else - no auth',
    query: `
mutation DO_SOMETHING_ELSE_MUTATION {
  doSomethingElse {
    message
  }
}
    `,
  },
];
