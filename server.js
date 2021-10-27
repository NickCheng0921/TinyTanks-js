//https://www.npmjs.com/package/ws#simple-server

//https://stackoverflow.com/questions/69694055/getting-error-while-importing-function-from-another-file-in-node-js-with-ecma
//ecma script 6 is not supported sometimes
  //use esm package and run with node -r esm target.js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8000 });
var messages = [];

console.log("Server running");

wss.on('connection', function connection(ws) {
  let mymessages = [];
  ws.on('message', function incoming(message) {
    console.log('received: %s', decode_utf8(message));
    let decode_arr = decode_msg(message);
    let id = decode_arr[0];
    let type = decode_arr[1];
    let content = decode_arr[2];
    console.log("id: ", id, " type:", type, " content:", content);

    //client is sending us a message
    if(content == "01"){
      //makes a random string of alphanumeric values
      let msgid = Math.random().toString(16).substr(2, 8);
      messages.push([msgid, id, content]);

      let payload = msgid+"02"+id+" > "+content+'\n';
      ws.send("THISISAMESSAGE");
    }

    //client is requesting an update
    if(content == "03"){
      ;
    }

  });

  //ws.send('something');
});

function decode_msg(msg){
  let id = msg.toString().substr(0, 8);
  let type = msg.toString().substr(8, 2);
  let content = "";
  try{
    content = msg.toString().substr(10);
  }
  catch (error){
    console.log("Error reading a msg: ", msg);
  }
  return [id, type, content];
}

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}