//https://www.npmjs.com/package/ws#simple-server

//https://stackoverflow.com/questions/69694055/getting-error-while-importing-function-from-another-file-in-node-js-with-ecma
//ecma script 6 is not supported sometimes
  //use esm package and run with node -r esm target.js

import { WebSocketServer } from 'ws';
import * as helper from './helper.js';
import * as mydb from './database.js';

const max_msg = 40;
const wss = new WebSocketServer({ port: 8000 });
var messages = [];
const clients = new Set();

helper.display_logo();

let db = mydb.connect_db('./tinytanks.db');

//check for user
mydb.user_login(db, 'nickch');

//handle incoming client connections
wss.on('connection', function connection(ws) {
  clients.add(ws);
  //update the client on all sent messages
  for(let payload of messages){
    //console.log("FOUND:", payload);
    ws.send(payload);
  }

  ws.on('message', function incoming(message) {
    let decode_arr = decode_msg(message);
    let id = decode_arr[0];
    let type = decode_arr[1];
    let content = decode_arr[2];
    console.log("id: ", id, " type:", type, " content:", content);

    //someone is attempting login, id is name and content will be password
    if(type == "00"){
      if(mydb.user_login(db, id, content)){
        let payload = "XSERVERX" + "03" + id;
        ws.send(payload);
      }
    }

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
        client.send(helper.encode_utf8(payload));
      }
    }
  });

  ws.on('close', function() {
    clients.delete(ws);
  });
});

function decode_msg(msg){
  let id = "";
  try {
    msg.toString().substr(0, 8);
  }
  catch(error){

  }

  let type = "";
  try {
    msg.toString().substr(8, 2);
  }
  catch(error){

  }

  let content = "";
  try{
    content = msg.toString().substr(10);
  }
  catch (error){
    console.log("Error reading a msg: ", msg);
  }
  return [id, type, content];
}

db.close();