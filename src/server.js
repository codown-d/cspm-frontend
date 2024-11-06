// socket.io test....
const httpProxy = require('http-proxy');
import { SOCKET_URL } from './utils';

httpProxy
  .createProxyServer({
    target: `${SOCKET_URL}/`,
    ws: true,
  })
  .listen(8001);
