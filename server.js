//https://www.npmjs.com/package/ws#simple-server

//https://stackoverflow.com/questions/69694055/getting-error-while-importing-function-from-another-file-in-node-js-with-ecma
//ecma script 6 is not supported sometimes
  //use esm package and run with node -r esm target.js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8000 });

console.log("Server running");

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', decode_utf8(message));
  });

  //ws.send('something');
});

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}