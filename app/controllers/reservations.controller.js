const Customer = require('../models/Customers');
const nameModel = 'Customer'

const Room = require('../models/Rooms');
const AdditionalService = require('../models/AdditionalServices');
const { waitSearchIds, waitUpdateStatus, waitCreateDatesOffRooms } = require('../common/functions/my-promises');

const createReservation = async(req, res) => {

     try {
          const { _id } = req.params;
          const { methodPayment, idRooms } = req.body;

          const arrayIds = idRooms.split(',');
          req.body.idRooms = [];

          //Search room in the db
          const correctIds = await waitSearchIds(arrayIds, Room); 
          req.body.idRooms = correctIds.arraySuccess;
          
          const customerFound = await Customer.findOne({idUser: _id});
          
          if ( !customerFound ) 
               return res.status(400).send( { success: false, msg: `${nameModel} not found` } );

          //Validate if the rooms exist in the db
          if ( !correctIds.success )
               return res.status(404).send( correctIds )         

          if ( correctIds.arrayErrorsId.length > 0)  
                return res.status(400).send({ success: false, error: correctIds.arrayErrorsId });        

          req.body.rooms = correctIds.arraySuccess;

          if(methodPayment === 'Card') {
               const { reference, typeCreditCard } = req.body;

               if ( !reference || !typeCreditCard ) {

                    return res.status(400).send( { 
                                                   success: false,
                                                   msg: `reference credit card or type credit card no found` 
                                                } );
               }

               req.body.creditCard = {
                    reference,
                    typeCreditCard
               }

          }

          const reservation = { ...req.body };

          customerFound.reservations = [ ...customerFound.reservations, reservation ];

          const result = await customerFound.save();

          const dateStart = new Date( req.body.startDate );
          const dateFinish = new Date( req.body.finishDate );

          //First date in the request body
          let fechasOff = [new Date( req.body.startDate )];
          let flag = false

          // Add days to date start
          let nextDate = new Date(dateStart.setDate(dateStart.getDate() + 1)).toISOString();
          while ( !flag ) {
                    
               if ( new Date(nextDate).getTime() === dateFinish.getTime() ) {
                    fechasOff = [...fechasOff, dateFinish];                     
                    flag = true;
                    break;
               }

               fechasOff = [...fechasOff, new Date(nextDate)];
               nextDate = new Date(new Date(nextDate).setDate( new Date(nextDate).getDate() + 1)).toISOString();
          }

          //Save dates in days off array
          const resultDatesRoom = await waitCreateDatesOffRooms(req.body.idRooms, fechasOff, Room);
          if (!resultDatesRoom.success) 
               return res.status(400).send( { success: false , msg: `There is a error with the rooms` } );

          res.status(201).send( {  success: true, 
                                   result, 
                                   msg: `${nameModel} - Reresevation was created`} );
     } catch (error) {
          console.log(error)
          res.status(400).send( { success: false, error ,msg: `Error in the request` } );
     }
}

const createExtraExpense = async (req, res) => {

     try {
          const { _id, _idReservation } = req.params;

          const customerFound = await Customer.findOne({idUser: _id})

          if ( !customerFound ) 
               return res.status(400).send( { success: false, msg: `${nameModel} not found` } );

          const addServiceFound = await AdditionalService.findById( req.body.idAdditionalService );

          if ( !addServiceFound ) 
               return res.status(400).send( { success: false, msg: `Additional service not found` } );

          const { reservations } = customerFound;
          let reservationAdded = false;
          let msgError = {success: false, msg: `Reservation not found`};

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
                                   msgError = { success: false, 
                                                msg: `reference credit card or type credit card no found` 
                                              };
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

          const result = await customerFound.save();

          res.status(201).send( { success: true, 
                                   result, 
                                   msg: `${nameModel} - extra expense id - ${ result._id } was created`} );
     } catch (error) {
          res.status(400).send( { success: false, error ,msg: `Error in the request` } );
     }
     
}


const createChangeRoom = async (req, res) => {
     
     try {
          const { _id, _idReservation } = req.params;

          const customerFound = await Customer.findOne( { idUser: _id } );

          if ( !customerFound ) 
               return res.status(400).send( { success: false, msg: `${nameModel} not found` } );

          const newRoomFound = await Room.findById( req.body.idNewRoom );

          if ( !newRoomFound ) 
               return res.status(400).send( { success: false, msg: `Room not found` } );

          const { reservations } = customerFound;
          let changedAdded = false;
          let msgError = {success: false, msg: `Reservation not found`};

          let idRoomBefore = '';
          reservations.forEach( r => {
               if (r._id == _idReservation) {
                    const newChangeRoom = {...req.body}
                    idRoomBefore = r.idRoom;
                    r.changeRoom = [...r.changeRoom, newChangeRoom];
                    changedAdded = true;
               }
          });

          if ( !changedAdded ) 
               return res.status(400).send( msgError );
     
          await Room.findByIdAndUpdate( idRoomBefore, {status: 'available'} );
          await Room.findByIdAndUpdate( req.body.idNewRoom, {status: 'unavailable'} )

          const result = await customerFound.save();

          res.status(201).send( { success: true, 
                                  result, 
                                  msg: `${nameModel} - change room id - ${ result._id } was created`} );
                               
     } catch (error) {
          res.status(400).send( { success: false, error ,msg: `Error in the request` } );
     }
     
}

const responseSurvey = async (req, res) => {

     try {
          const { _id, _idReservation } = req.params;

          const customerFound = await Customer.findOne( { idUser: _id } );

          if ( !customerFound ) 
               return res.status(400).send( { success: false, msg: `${nameModel} not found` } );

          const { reservations } = customerFound;
          let changedAdded = false;
          let msgError = {success: false, msg: `Reservation not found`};
     
          reservations.forEach( r => {
               if (r._id == _idReservation) {
                    const newSurvey = {...req.body, answered: true};
                    r.survey = newSurvey;
                    changedAdded = true;
               }
          });


          if ( !changedAdded ) 
               return res.status(400).send( msgError );
     
          const result = await customerFound.save();  
                                 
          res.status(201).send( {  success: true, 
                                   result, 
                                   msg: `${nameModel} - survey id - ${ result._id } was created`} );

     } catch (error) {
          res.status(400).send( { success: false, error ,msg: 'Error in the request' } );
     }
     
}

module.exports = {
     createReservation,
     createExtraExpense,
     createChangeRoom,
     responseSurvey
}