const express = require('express');
const cors = require('cors');
const initDB = require('./app/database/config/db');

const app = express();
app.use( express.urlencoded({extended:true}) );
app.use( express.json() );
app.use( cors() );
const port = 9000;
const pathApi = '/api/';

//ROUTES
const additionalServicesRoute = require('./app/routes/additionalServices.routes');
const typeRoomsRoute = require('./app/routes/typeRooms.routes');
const usersRoute = require('./app/routes/users.routes');
const reservationsRoute = require('./app/routes/reservations.routes');

//USE ROUTES
app.use( pathApi, additionalServicesRoute );
app.use( pathApi, typeRoomsRoute );
app.use( pathApi, usersRoute );
app.use( pathApi, reservationsRoute );

app.listen(port, () => {
     console.log('App is online, in port', port)
 });

 initDB();