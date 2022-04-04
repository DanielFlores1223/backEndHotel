const Customer = require('../models/Customers');
const nameModel = 'Customer'

const createReservation = async(req, res) => {
     const { _id } = req.params;
     const { methodPayment } = req.body;

     const customerFound = await Customer.findOne({idUser: _id})

     if ( !customerFound ) 
          return res.status(400).send( { reqStatus: false, msg: `${nameModel} not found` } );

     if(methodPayment === 'Card') {
          const { reference, typeCreditCard } = req.body;

          if ( !reference || !typeCreditCard ) {

               return res.status(400).send( { reqStatus: false, msg: `reference credit card or type credit card no found` } )
          }

          req.body.creditCard = {
               reference,
               typeCreditCard
          }

     }

     const reservation = { ...req.body };

     customerFound.reservations = [ ...customerFound.reservations, reservation ];

     await customerFound.save() .then( data => {
                                                  res.status(201).send( { reqStatus: true, 
                                                  result: data, 
                                                  msg: `${nameModel} - Reresevation id - ${ data._id } was created`} );
                                               })
                                 .catch( err => {
                                     res.status(400).send( { reqStatus: false, msg: err } );
                                 });
}

const createExtraExpense = async (req, res) => {
     const { _id, _idReservation } = req.params;

     const customerFound = await Customer.findOne({idUser: _id})

     if ( !customerFound ) 
          return res.status(400).send( { reqStatus: false, msg: `${nameModel} not found` } );

     const { reservations } = customerFound;
     let reservationAdded = false;
     let msgError = {reqStatus: false, msg: `Reservation not found`};

     reservations.forEach( r => {

          if (r._id == _idReservation) {

               if ( r.openBill && req.body.methodPayment === 'Card' ) {

                    req.body.creditCard = {
                         reference: r.creditCard.reference,
                         typeCreditCard: r.creditCard.typeCreditCard
                    }
               
               } else {
                    
                    if( req.body.methodPayment === 'Card' ) {
                         const { reference, typeCreditCard } = req.body;
                    
                         if ( !reference || !typeCreditCard ) {
                              msgError = { reqStatus: false, msg: `reference credit card or type credit card no found` };
                              return reservationAdded = false;
                         }
                    
                         req.body.creditCard = {
                              reference,
                              typeCreditCard
                         }
                    
                    }
               }

               const extraExpense = { ...req.body };
               r.extraExpenses = [ ...r.extraExpenses, extraExpense ];
               reservationAdded = true;
          }
     
     });

     if ( !reservationAdded )
          return res.status(400).send( msgError );

     await customerFound.save() .then( data => {
                                                   res.status(201).send( { reqStatus: true, 
                                                   result: data, 
                                                   msg: `${nameModel} - extra expense id - ${ data._id } was created`} );
                                                })
                                 .catch( err => {
                                        res.status(400).send( { reqStatus: false, msg: err } );
                                 });
}


const createChangeRoom = async (req, res) => {
     const { _id, _idReservation } = req.params;

     const customerFound = await Customer.findOne( { idUser: _id } );

     if ( !customerFound ) 
          return res.status(400).send( { reqStatus: false, msg: `${nameModel} not found` } );

     const { reservations } = customerFound;
     let changedAdded = false;
     let msgError = {reqStatus: false, msg: `Reservation not found`};

     reservations.forEach( r => {
          if (r._id == _idReservation) {
               const newChangeRoom = {...req.body}
               r.changeRoom = [...r.changeRoom, newChangeRoom];
               changedAdded = true;
          }
     });

     if ( !changedAdded ) 
          return res.status(400).send( msgError );
     

     await customerFound.save() .then( data => {
                                                   res.status(201).send( { reqStatus: true, 
                                                   result: data, 
                                                   msg: `${nameModel} - change room id - ${ data._id } was created`} );
                                                })
                                .catch( err => {
                                        res.status(400).send( { reqStatus: false, msg: err } );
                                });
}

const responseSurvey = async (req, res) => {
     const { _id, _idReservation } = req.params;

     const customerFound = await Customer.findOne( { idUser: _id } );

     if ( !customerFound ) 
          return res.status(400).send( { reqStatus: false, msg: `${nameModel} not found` } );

     const { reservations } = customerFound;
     let changedAdded = false;
     let msgError = {reqStatus: false, msg: `Reservation not found`};
     
     reservations.forEach( r => {
          if (r._id == _idReservation) {
               const newSurvey = {...req.body, answered: true};
               r.survey = newSurvey;
               changedAdded = true;
          }
     });


     if ( !changedAdded ) 
          return res.status(400).send( msgError );
     
     await customerFound.save() .then( data => {
                                                  res.status(201).send( { reqStatus: true, 
                                                  result: data, 
                                                  msg: `${nameModel} - survey id - ${ data._id } was created`} );
                                               })
                                 .catch( err => {
                                     res.status(400).send( { reqStatus: false, msg: err } );
                                 });    

}

module.exports = {
     createReservation,
     createExtraExpense,
     createChangeRoom,
     responseSurvey
}