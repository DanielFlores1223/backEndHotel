const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Customer = require('../models/Customers');
const Receptionist = require('../models/Receptionists');

const { createToken } = require('../common/functions/authorization');
const { validateMongoId } = require('../common/functions/validation-common');

const nameModel = 'Users';
const saltBy = 10;

const create = async (req, res) => {

     req.body.password = await bcrypt.hash( req.body.password, saltBy );

     const newUser = new User( { ...req.body } );

     const userCreated = await newUser.save().then( data => { return { success: true, 
                                                   result: data, 
                                                   msg: `${nameModel} - name - ${ data.name } was created`} } )
                                             .catch( err => { return { success: false, 
                                                                       msg: err } } );

     if( !userCreated.success )
          return res.status(400).send( userCreated );

     const { result } = userCreated;
     const { role, _id } = result;

     if ( role === 'Receptionist' ) {
          const newReceptionist = new Receptionist( { idUser: _id, changeDB: [] } )
          
          await newReceptionist.save().then( data => {
               res.status(200).send( { 
                                        success: true, 
                                        result: { user: userCreated.data, receptionist: data }, 
                                        msg: `${nameModel} Receptionist - name - ${ data.idUser } was created` } );
          } )
          .catch( err => {
               res.status(400).send( { success: false, msg: err } )
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
                    success: true, 
                    result: { user: userCreated.data, customer: data }, 
                    msg: `${nameModel} Customer - name - ${ data.idUser } was created` } );
               }
           )
           .catch( err => {
               res.status(400).send( { success: false, msg: err } )
          });

          return;
     }

     //admin
     res.status(200).send(userCreated)
}

const login = async (req, res) => {
     try {
          const { email, password } = req.body;

          const userFound = await User.findOne( { email } );

          if ( !userFound ) {
               return res.status(400).send( { success: false, msg: 'User no identify' } )
          }

          const credentialCorrect = await bcrypt.compare( password, userFound.password );

          if ( !credentialCorrect ) 
               return res.status(400).send( { success: false, msg: 'Credentials are incorrect' } )

          const { _id, role } = userFound;
          const token = createToken( _id, role, true );

          const result = { ...userFound._doc, token };
          res.status(200).send( { success: true, result, msg: `User logged with email - ${result.email}` } );

     } catch (error) {
          res.status(400).send( { success: false, error, msg: `Error in the request` } );
     }
}

const updateUser = async (req, res) => {

     try {
          const { _id } = req.params;

          if ( validateMongoId( _id ) ) 
               return res.status(400).send( { success: false, msg: 'Id is invalid' } );

          if ( req.body.password ) 
               req.body.password = await bcrypt.hash( req.body.password, saltBy );

          const userModified = await User.findByIdAndUpdate( _id, { ...req.body }, { new: true} );

          if( !userModified ) 
               return res.status(400).send( { success: false, msg: 'User not found' } );
                                                    
          res.status(200).send({ success: true, 
                                 result: userModified, 
                                 msg: `${nameModel} updated id - ${ userModified._id }` });
     } catch (error) {
          res.status(400).send( { success: false, error, msg: `Error in the request` } );
     }
    
}

const updateCustomer = async (req, res) => {
     try {
          const { _id } = req.params;

          if ( validateMongoId( _id ) ) 
               return res.status(400).send( { success: false, msg: 'Id is invalid' } );

          const customerModified = await Customer.findByIdAndUpdate( _id, { ...req.body }, { new: true} );

          if( !customerModified ) 
               return res.status(400).send( { success: false, msg: 'User not found' } );
                                               
          res.status(200).send({ success: true, 
                                 result: customerModified, 
                                 msg: `${nameModel} updated id - ${ customerModified._id }` });
     } catch (error) {
          res.status(400).send( { success: false, error, msg: `Error in the request` } );
     }
}

const updateReceptionist = async ( req, res ) => {

     try {
          const { _id } = req.params;

          if ( validateMongoId( _id ) ) 
               return res.status(400).send( { success: false, msg: 'Id is invalid' } );

          const receptionistModified = await Receptionist.findByIdAndUpdate( _id, { ...req.body }, { new: true} );

          if( !receptionistModified ) 
               return res.status(400).send( { success: false, msg: 'User not found' } );
                                               
          res.status(200).send({ success: true, 
                                 result: receptionistModified, 
                                 msg: `${nameModel} updated id - ${ receptionistModified._id }` });  

     } catch (error) {
          res.status(400).send( { success: false, error, msg: `Error in the request` } );
     }
     
} 

const deleteOne = async (req, res) => {

     try {
          const { _id } = req.params;

          if ( validateMongoId( _id ) ) 
               return res.status(400).send( { success: false, msg: 'Id is invalid' } );

          const userDeleted = await User.findByIdAndDelete( _id );

          if (!userDeleted) 
               return res.status(400).send( { success: false, msg: 'User not found' } );

          const customerFound = Customer.findOne( { usedId: _id } );

          if (customerFound) {
               const customerDeleted = await Customer.findOneAndDelete( { usedId: _id } );
          
               if( !customerDeleted )
                    return res.status(400).send( { success: false, msg: 'Customer not found' } );

               return res.status(200).send( { 
                                         success: true, 
                                         result: { userDeleted, customerDeleted } ,
                                         msg: `Customer deleted with id ${userDeleted._id}` 
                                        } 
                                     );
          }

          const receptionistFound = await Receptionist.findOneAndDelete( { userId: _id } );

          if ( receptionistFound ) {
               const receptionistDeleted = await Receptionist.findOneAndDelete( { userId: _id } );

               if( !receptionistDeleted )
                    return res.status(400).send( { success: false, msg: 'Receptionist not found' } );

               return res.status(200).send( { 
                                         success: true, 
                                         result: { userDeleted, customerDeleted } ,
                                         msg: `Receptionist deleted with id ${userDeleted._id}`
                                       } 
                                    );
          }    

          return res.status(200).send( { 
                                     success: true, 
                                     result: { userDeleted } ,
                                     msg: `Admin deleted with id ${userDeleted._id}`
                                   } 
                                );

     } catch (error) {
          res.status(400).send( { success: false, error, msg: `Error in the request` } );
     }
     
}

module.exports = {
     create,
     login,
     updateUser,
     updateCustomer,
     updateReceptionist,
     deleteOne
}