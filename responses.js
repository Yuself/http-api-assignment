// apiResponses.js

// Decide response format based on Accept header.
// Default: JSON (if no Accept header is present).
const wantsXML = (request) => {
  const accept = request.headers.accept;
  if (!accept) return false;
  return accept.includes('application/xml') || accept.includes('text/xml');
};

// Helper: send JSON response
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // HEAD should not include a response body
  if (request.method !== 'HEAD') {
    response.write(content);
  }

  response.end();
};

// Helper: send XML response
const respondXML = (request, response, status, object) => {
  // object shape: { message: "...", id?: "badRequest" }
  let xml = '<response>';
  xml += `<message>${object.message}</message>`;
  if (object.id) xml += `<id>${object.id}</id>`;
  xml += '</response>';

  response.writeHead(status, {
    'Content-Type': 'application/xml',
    'Content-Length': Buffer.byteLength(xml, 'utf8'),
  });

  if (request.method !== 'HEAD') {
    response.write(xml);
  }

  response.end();
};

// One entry point: choose JSON or XML
const respond = (request, response, status, object) => {
  if (wantsXML(request)) return respondXML(request, response, status, object);
  return respondJSON(request, response, status, object);
};

// ---- Required API endpoints (GET) ----

// /success -> 200
const getSuccess = (request, response) => {
  respond(request, response, 200, { message: 'This request has succeeded.' });
};

// /badRequest -> 400 unless ?valid=true
const getBadRequest = (request, response, queryParams) => {
  if (queryParams.valid === 'true') {
    return respond(request, response, 200, { message: 'Valid query parameter set.' });
  }

  return respond(request, response, 400, {
    message: 'Missing valid query parameter set to true.',
    id: 'badRequest',
  });
};

// /unauthorized -> 401 unless ?loggedIn=yes
const getUnauthorized = (request, response, queryParams) => {
  if (queryParams.loggedIn === 'yes') {
    return respond(request, response, 200, { message: 'You are logged in.' });
  }

  return respond(request, response, 401, {
    message: 'Missing loggedIn query parameter set to yes.',
    id: 'unauthorized',
  });
};

// /forbidden -> 403
const getForbidden = (request, response) => {
  respond(request, response, 403, {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  });
};

// /internal -> 500
const getInternal = (request, response) => {
  respond(request, response, 500, {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internal',
  });
};

// /notImplemented -> 501
const getNotImplemented = (request, response) => {
  respond(request, response, 501, {
    message: 'This request has not been implemented.',
    id: 'notImplemented',
  });
};

// 404 default
const getNotFound = (request, response) => {
  respond(request, response, 404, {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  });
};

module.exports = {
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNotFound,
};
