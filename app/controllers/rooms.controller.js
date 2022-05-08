const Model = require('../models/Rooms');
const nameModel = 'Room';

const TypeRooms = require('../models/TypeRooms');
const { validateMongoId } = require('../common/functions/validation-common');

const findAll = async (req, res) => {
     const rooms = await Model.find({}).populate('idTypeRoom');

     if(!rooms)
          return res.status(404).send({ success: false, msg: `${nameModel}s not found` });

     res.status(200).send({ success: true, result: rooms, msg: `${nameModel}s found` });
}

const findById = async (req, res) => {
     const { _id } = req.params;

     const room = await Model.findById(_id).populate('idTypeRoom');
 
     if (!room) 
          return res.status(404).send({ success: false, msg: `${nameModel} not found` });

     res.status(200).send({ success: true, result: room, msg: `${nameModel} found with id - ${room._id}` });
}

const create = async (req, res) => {

     try {
          req.body.idTypeRoom = req.body.idTypeRoom.trim();
          const { idTypeRoom } = req.body;
     
          const typeRoom = await TypeRooms.findById(idTypeRoom);
     
          if (!typeRoom) 
               return res.status(404).send({ success: false, msg: 'Type room not found' });
          
          //DEFAULT VALUES
          req.body.status = 'available';
          const newModel = new Model({...req.body});
     
          const result = await newModel.save();
     
          res.status(201).send({ success: true, 
                                 result, 
                                 msg: `${nameModel} - name - ${ result.name } was created`});   
     } catch (error) {
          res.status(400).send({ success: false, error ,msg: `Error in the request` });
     }

     
}

const update = async (req, res) => {

     try {
          const { _id } = req.params;

          if ( validateMongoId( _id ) ) 
               return res.status(400).send( { success: false, msg: 'Id is invalid' } );
     
          if ( req.body.idTypeRoom ) {
               const { idTypeRoom } = req.body;
               const typeRoom = await TypeRooms.findById(idTypeRoom);

               if (!typeRoom) 
                    return res.status(400).send({ success: false, msg: 'Type room not found' });
          }

          const result = await Model.findByIdAndUpdate( _id, {...req.body}, {new: true} )

          if( !result ) 
               return res.status(404).send( { success: false, msg: `${nameModel} not found` } );
                                                    
          res.status(200).send({ success: true, 
                                 result, 
                                 msg: `${nameModel} updated id - ${ result._id }` });
     } catch (error) {

          if(error.codeName == 'DuplicateKey')
               return res.status(400).send( { success: false, error, msg: `Error in the request: ${error.keyValue.name} already exists` } );

          res.status(400).send( { success: false, error, msg: `Error in the request` } );
     }
}

const deleteOne = async (req, res) => {

     try {
          const { _id } = req.params;

          if ( validateMongoId( _id ) ) 
               return res.status(400).send( { success: false, msg: 'Id is invalid' } );

          const roomDeleted = await Model.findByIdAndDelete( _id );

          if (!roomDeleted)   
               return res.status(404).send( { success: false, msg: `${nameModel} not found` } );

          res.status(200).send( { 
                              success: true, 
                              result: roomDeleted ,
                              msg: `Room deleted with id ${roomDeleted._id}`
                            } 
                         );
     } catch (error) {
          res.status(400).send( { success: false, error, msg: `Error in the request` } );
     }
}

module.exports = {
     findAll,
     findById,
     create,
     update,
     deleteOne
}