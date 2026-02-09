const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const apiHandler = require('./responses.js');


const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handleGet = (request, response, parsedUrl) => {
  const pathname = parsedUrl.pathname;
  const queryParams = Object.fromEntries(parsedUrl.searchParams);

  if (pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (pathname === '/success') {
    apiHandler.getSuccess(request, response);
  } else if (pathname === '/badRequest') {
    apiHandler.getBadRequest(request, response, queryParams);
  } else if (pathname === '/unauthorized') {
    apiHandler.getUnauthorized(request, response, queryParams);
  } else if (pathname === '/forbidden') {
    apiHandler.getForbidden(request, response);
  } else if (pathname === '/internal') {
    apiHandler.getInternal(request, response);
  } else if (pathname === '/notImplemented') {
    apiHandler.getNotImplemented(request, response);
  } else {
    apiHandler.getNotFound(request, response);
  }
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  handleGet(request, response, parsedUrl);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
