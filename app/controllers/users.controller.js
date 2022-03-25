const User = require('../models/User');
const Customer = require('../models/Customers');
const Receptionist = require('../models/Receptionists');

const nameModel = 'Users';

const prueba = (req, res) => {
     res.send({msg: 'hola'});
}

const create = async (req, res) => {

     const newUser = new User( { ...req.body } );

     const userCreated = await newUser.save().then( data => { return { reqStatus: true, 
                                                   data, 
                                                   msg: `${nameModel} - name - ${ data.name } was created`} } )
                                             .catch( err => { return { reqStatus: false, 
                                                                       err } } );

     if( !userCreated.reqStatus )
          return res.status(400).send( userCreated );

     const { data } = userCreated;
     const { role, _id } = data;

     if ( role === 'Receptionist' ) {
          const newReceptionist = new Receptionist( { idUser: _id, changeDB: [] } )
          
          await newReceptionist.save().then( data => {
               res.status(200).send( { 
                                        reqStatus: true, 
                                        data, 
                                        msg: `${nameModel} Receptionist - name - ${ data.idUser } was created` } );
          } )
          .catch( err => {
               res.status(400).send( { reqStatus: false, err } )
          });
          
          return;
     }

     if( role === 'Customer' ) {
          const newCustomer = new Customer( { 
               idUser: _id,
               address: {
                    street: '',
                    colony: '',
                    externalNumber: '',
                    internalNumber: ''
               },
               city: '',
               country: '',
               reservations: [],
           } );

           await newCustomer.save().then( data => {
               res.status(200).send( { 
                    reqStatus: true, 
                    data, 
                    msg: `${nameModel} Customer - name - ${ data.idUser } was created` } );
               }
           )
           .catch( err => {
               res.status(400).send( { reqStatus: false, err } )
          });

          return;
     }

     //admin
     res.status(200).send(userCreated)
}

const login = async (req, res) => {
     const { email, password } = req.body;

     const userFound = await User.findOne( { '$and': [ 
                                                        {email}, 
                                                        {password} 
                                                     ] 
                                         } )
                                         .then( data => {
                                             return { reqStatus: true, data }
                                         } )
                                         .catch( err => {
                                              return { reqStatus: false, err }
                                         } );

     const { reqStatus } = userFound;
     if ( !reqStatus ) {
          return res.status(400).send( userFound )
     }

     //crear el token



}

module.exports = {
     prueba,
     create
}