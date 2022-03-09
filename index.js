const express = require('express');
const bodyParser = require('body-parser');
const initDB = require('./app/database/config/db');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use( express.json() );
const port = 9000;

//ROUTES
const additionalServicesRoute = require('./app/routes/additionalServices.routes');

//USE ROUTES
app.use( '/', additionalServicesRoute );

app.listen(port, () => {
     console.log('App is online')
 });

 initDB();