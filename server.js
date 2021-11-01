//https://www.npmjs.com/package/ws#simple-server

//https://stackoverflow.com/questions/69694055/getting-error-while-importing-function-from-another-file-in-node-js-with-ecma
//ecma script 6 is not supported sometimes
  //use esm package and run with node -r esm target.js

import sqlite3 from 'sqlite3';
import { WebSocketServer } from 'ws';

const max_msg = 40;
const wss = new WebSocketServer({ port: 8000 });
var messages = [];
const clients = new Set();

console.log("Server running");

//connect to database
let db = new sqlite3.Database('./tinytanks.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to tinytanks db.');
});

//check for user
let user_query = 'SELECT * FROM Users WHERE tag = ?';
db.get(user_query, ['nickch'], (err, row) => {
  if (err) {
    throw err;
  }
  return row
    ? console.log(row.tag, " FOUND")
    : console.log(`No user found for that id`);

});

//handle incoming client connections
wss.on('connection', function connection(ws) {
  clients.add(ws);
  //update the client on all sent messages
  for(let payload of messages){
    //console.log("FOUND:", payload);
    ws.send(payload);
  }

  ws.on('message', function incoming(message) {
    //console.log('received: %s', decode_utf8(message));
    let decode_arr = decode_msg(message);
    let id = decode_arr[0];
    let type = decode_arr[1];
    let content = decode_arr[2];
    console.log("id: ", id, " type:", type, " content:", content);

    //client is sending us a message
    if(type == "01"){
      //makes a random string of alphanumeric values to use as an id
      let msgid = Math.random().toString(16).substr(2, 8);
      if(messages.length > max_msg){
        messages = list.splice(0, max_msg/2);
      }

      let payload = msgid+"02"+id+" > "+content+'\n';
      messages.push(payload);

      //send message to all users
      for( let client of clients ){
        client.send(encode_utf8(payload));
      }
    }
  });

  ws.on('close', function() {
    clients.delete(ws);
  });
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

db.close();