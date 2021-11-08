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

/*
 * Check if a user exists, if so, generate a token for them
 */
export function user_login(db, uid){
    let user_query = 'SELECT * FROM Users WHERE tag = ?';
    db.get(user_query, [uid], (err, row) => {
    if (err) {
        console.log(err.message);
        return null;
    }
    return row
        ? console.log(row.tag, " FOUND")
        : console.log(`No user found for that id`);
});
}