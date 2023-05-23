const httpCodes = {
  // Information
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,

  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  ALREADY_REPORTED: 208,
  IM_USED: 226,

  // Redirections
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  I_AM_A_TEAPOT: 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
}

const httpStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
}

const httpMessages = {
  //Information
  CONTINUE:
    'The server has received the initial part of the request and requires the client to continue with the request.',
  SWITCHING_PROTOCOLS: "The server is switching protocols according to the client's request.",
  PROCESSING:
    'The server is processing the request and will return the response asynchronously when it is complete.',

  // Success
  OK: 'The request was successful.',
  CREATED: 'The resource was successfully created.',
  ACCEPTED: 'The request has been accepted for processing.',
  NON_AUTHORITATIVE_INFORMATION: 'The response contains non-authoritative information.',
  NO_CONTENT: 'The request was successful, but there is no content to send back.',
  RESET_CONTENT: 'The request was successful, and the user agent should reset the document view.',
  PARTIAL_CONTENT: 'The response contains only a partial representation of the requested resource.',
  MULTI_STATUS: 'The response provides status for multiple independent operations.',
  ALREADY_REPORTED: 'The requested resource is already reported and processed in the background.',
  IM_USED:
    'The server has fulfilled a request for the resource, and the response is the result of one or more instance manipulations.',

  // Redirections
  MULTIPLE_CHOICES: 'The request has multiple options available.',
  MOVED_PERMANENTLY: 'The requested resource has permanently moved to a new location.',
  FOUND: 'The requested resource has been temporarily moved to a different location.',
  SEE_OTHER: 'The response is a reference to another URL that should be followed.',
  NOT_MODIFIED: 'The requested resource has not been modified since the last request.',
  USE_PROXY: 'The request should be accessed through a proxy specified in the Location header.',
  TEMPORARY_REDIRECT: 'The request should be redirected to the requested temporary URL.',
  PERMANENT_REDIRECT: 'The request should be redirected to the requested permanent URL.',

  // Client Errors
  BAD_REQUEST: 'The server cannot understand the request due to client error.',
  UNAUTHORIZED: 'Authentication is required to access the requested resource.',
  PAYMENT_REQUIRED: 'Payment is required to access the requested resource.',
  FORBIDDEN: 'The server refuses to fulfill the request.',
  NOT_FOUND: 'The requested resource could not be found on the server.',
  METHOD_NOT_ALLOWED: 'The requested resource does not support the provided HTTP method.',
  NOT_ACCEPTABLE:
    "The requested resource cannot generate a response that satisfies the client's requested content characteristics.",
  PROXY_AUTHENTICATION_REQUIRED:
    'Proxy authentication is required to access the requested resource.',
  REQUEST_TIMEOUT: 'The server timed out waiting for the request.',
  CONFLICT: 'The request conflicts with the current state of the server.',
  GONE: 'The requested resource is no longer available at the server.',
  LENGTH_REQUIRED: 'The server requires a valid Content-Length header.',
  PRECONDITION_FAILED: 'The server does not meet the preconditions specified in the request.',
  PAYLOAD_TOO_LARGE: "The request payload exceeds the server's limit.",
  URI_TOO_LONG: "The request URI exceeds the server's limit.",
  UNSUPPORTED_MEDIA_TYPE: "The server does not support the request's media type.",
  RANGE_NOT_SATISFIABLE: 'The requested range cannot be satisfied by the server.',
  EXPECTATION_FAILED: 'The server cannot meet the requirements of the Expect request-header field.',
  I_AM_A_TEAPOT: "I'm a teapot (RFC 2324).",
  MISDIRECTED_REQUEST:
    'The request was directed to a server that is not able to produce a response.',
  UNPROCESSABLE_ENTITY: 'The server cannot process the request due to semantic errors.',
  LOCKED: 'The requested resource is locked and unavailable.',
  FAILED_DEPENDENCY: 'The request failed because of a failed dependency.',
  TOO_EARLY: 'The server is unwilling to risk processing a request that might be replayed.',
  UPGRADE_REQUIRED: 'The client should switch to a different protocol to fulfill the request.',
  PRECONDITION_REQUIRED: 'The server requires the request to be conditional.',
  TOO_MANY_REQUESTS: 'The user has sent too many requests in a given amount of time.',
  REQUEST_HEADER_FIELDS_TOO_LARGE:
    'The server is unwilling to process the request because its header fields are too large.',
  UNAVAILABLE_FOR_LEGAL_REASONS: 'The requested resource is unavailable due to legal reasons.',

  // Server Errors
  INTERNAL_SERVER_ERROR: 'An internal server error occurred.',
  NOT_IMPLEMENTED: 'The server does not support the functionality required to fulfill the request.',
  BAD_GATEWAY: 'The server received an invalid response from an upstream server.',
  SERVICE_UNAVAILABLE:
    'The server is temporarily unable to handle the request due to maintenance or overload.',
  GATEWAY_TIMEOUT: 'The server did not receive a timely response from an upstream server.',
  HTTP_VERSION_NOT_SUPPORTED: 'The server does not support the requested HTTP protocol version.',
  VARIANT_ALSO_NEGOTIATES: 'The server has detected an internal configuration error.',
}

const Response = {
  // Success
  ok: (res, { message = httpMessages.OK, data = null } = {}) => {
    return res.status(httpCodes.OK).send({ meta: { message }, data })
  },

  created: (res, { message = httpMessages.CREATED, data = null } = {}) => {
    return res.status(httpCodes.CREATED).send({ meta: { message }, data })
  },

  // Client Errors
  badRequest: (res, { message = httpMessages.BAD_REQUEST, data = null } = {}) => {
    return res.status(httpCodes.BAD_REQUEST).send({ meta: { message }, data })
  },

  forbidden: (res, { message = httpMessages.FORBIDDEN, data = null } = {}) => {
    return res.status(httpCodes.FORBIDDEN).send({ meta: { message }, data })
  },

  notFound: (res, { message = httpMessages.NOT_FOUND, data = null } = {}) => {
    return res.status(httpCodes.NOT_FOUND).send({ meta: { message }, data })
  },

  // Server Errors
  internalServerError: (
    res,
    { message = httpMessages.INTERNAL_SERVER_ERROR, data = null } = {}
  ) => {
    return res.status(httpCodes.INTERNAL_SERVER_ERROR).send({ meta: { message }, data })
  },
}

export { Response, httpCodes, httpMessages, httpStatus }
