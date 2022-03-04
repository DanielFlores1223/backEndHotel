const mongoose = require('mongoose');
const { credentials } = require('./credentials');

const DB_URI = credentials.DB_URI;

module.exports = () => {
     const connect = () => {
          mongoose.connect(
               DB_URI, 
               {
                    keepAlive: true,
                    useNewUrlParser: true,
                    useUnifiedTopology: true
               },
               (err) => {
                    if(err) console.log('DB: ERROR!!');
                    else console.log('DB connection is successful');    
               }
          )
     }

     connect();
}