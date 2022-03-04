const express = require('express');
const initDB = require('./database/config/db');

const app = express();
const port = 9000;


app.get('/', (req, res) => {
    res.send({
        data: 'Hello World, I am working well'
    });
});

app.listen(port, () => {
     console.log('App is online')
 });

 initDB();