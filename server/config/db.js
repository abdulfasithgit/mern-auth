const Mysqli = require('mysqli');

let conn = new Mysqli({
    host:'localhost',
    post:3306,
    user:'root',
    passwd:'',
    db:'mern-auth'
})
//
let db = conn.emit(false,'');
db
  .tableList()
  .then(list => {
    console.log ( "Db connected" );
  })
  .catch(err => {
    console.log ("Db connection error", err ) ;
  })
module.exports ={
    database:db
}
