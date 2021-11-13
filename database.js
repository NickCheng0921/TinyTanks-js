import sqlite3 from 'sqlite3';

/*
 * Check if database can be connected to
 */
export function connect_db(path){
    return new sqlite3.Database(path, (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to tinytanks db.');
    });      
}

export function user_login(db, tag, pass, ws){
    //we will have to implement ghetto async/await
    let user_query = 'SELECT * FROM Users WHERE tag = ?';
    let result = false;
    let signal = 0;
    //console.log("Try query", tag, pass);
    db.get(user_query, [tag], function (err, row) {
        if (err) {
            console.log(err.message);
        }
        else if(row && row.pass == pass){
            let short_id = tag;
            if(tag.length > 8){
              short_id = tag.substr(0, 8);
            }
            while(short_id.length < 8){
              short_id += " ";
            }
      
            let payload = "XSERVERX" + "03" + short_id;
            ws.send(payload);
        }
    });

}