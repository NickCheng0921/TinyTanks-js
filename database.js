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

export function user_login(db, tag, pass){
    let user_query = 'SELECT * FROM Users WHERE tag = ?';
    //console.log("Try query", tag, pass);
    return db.get(user_query, [tag], function (err, row) {
        if (err) {
            console.log(err.message);
            return null;
        }
        return (row.pass == pass);
    });
}