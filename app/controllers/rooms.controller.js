const Model = require('../models/Rooms');
const nameModel = 'Room';

const TypeRooms = require('../models/TypeRooms');
const { validateMongoId } = require('../common/functions/validation-common');

const findAll = async (req, res) => {
     const rooms = await Model.find({});

     if(!rooms)
          return res.status(404).send({ reqStatus: false, msg: `${nameModel}s not found` });

     res.status(200),send({ reqStatus: true, result: rooms, msg: `${nameModel}s found` });
}

const findById = async (req, res) => {
     const { _id } = req.params;

     const room = await Model.findById(_id);

     if (!room) 
          return res.status(404).send({ reqStatus: false, msg: `${nameModel} not found` });

     res.status(200),send({ reqStatus: true, result: romm, msg: `${nameModel} found with id - ${room._id}` });
}

const create = async (req, res) => {

     req.body.idTypeRoom = req.body.idTypeRoom.trim();
     const { idTypeRoom } = req.body;

     const typeRoom = await TypeRooms.findById(idTypeRoom);

     if (!typeRoom) 
          return res.status(400).send({ reqStatus: false, msg: 'Type room not found' });
     
     const newModel = new Model({...req.body});

     const modelCreated = await newModel.save().then(
                                                      data => { return { reqStatus: true, 
                                                        result: data, 
                                                        msg: `${nameModel} - name - ${ data.name } was created`} } )
                                                .catch( err => { return { reqStatus: false, 
                                                                           msg: err } } );
     if (!modelCreated.reqStatus) 
          return res.status(400).send(modelCreated);
     
     res.status(201).send(modelCreated);
}

const update = async (req, res) => {
     const { _id } = req.params;

     if ( validateMongoId( _id ) ) 
          return res.status(400).send( { reqStatus: false, msg: 'Id is invalid' } );
     
     if ( req.body.idTypeRoom ) {
          const { idTypeRoom } = req.body;
          const typeRoom = await TypeRooms.findById(idTypeRoom);

          if (!typeRoom) 
               return res.status(400).send({ reqStatus: false, msg: 'Type room not found' });
     }

     const roomModified = await Model.findByIdAndUpdate( _id, {...req.body}, {new: true} )

     if( !roomModified ) 
          return res.status(400).send( { reqStatus: false, msg: `${nameModel} not found` } );
                                                    
     res.status(200).send({ reqStatus: true, 
                            result: roomModified, 
                            msg: `${nameModel} updated id - ${ roomModified._id }` });
}

const deleteOne = async (req, res) => {
     const { _id } = req.params;

     if ( validateMongoId( _id ) ) 
          return res.status(400).send( { reqStatus: false, msg: 'Id is invalid' } );

     const roomDeleted = await Model.findByIdAndDelete( _id );

     if (!roomDeleted)
          return res.status(404).send( { reqStatus: false, msg: `${nameModel} not found` } );

     res.status(200).send( { 
                              reqStatus: true, 
                              result: roomDeleted ,
                              msg: `Room deleted with id ${roomDeleted._id}`
                            } 
                         );
}

module.exports = {
     findAll,
     findById,
     create,
     update,
     deleteOne
}