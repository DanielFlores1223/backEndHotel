const Model = require('../models/Anomalies');
const nameModel = 'Anomalie';

const Room = require('../models/Rooms');
const { validateMongoId } = require('../common/functions/validation-common');
const { waitSearchIds, waitUpdateStatus } = require('../common/functions/my-promises');

const findAll = async(req, res) => {
     const anomalies = await Model.find({});

     if ( !anomalies ) 
          return res.status(404).send({ reqStatus: false, msg: `${nameModel}s not found` });

     res.status(200),send({ reqStatus: true, result: anomalies, msg: `${nameModel}s found` });
}

const findOneById = async(req, res) => {
     const { _id } = req.params;

     const anomalie = await Model.findById(_id);

     if (!anomalie) 
          return res.status(404).send({ reqStatus: false, msg: `${nameModel} not found` });

     res.status(200),send({ reqStatus: true, result: anomalie, msg: `${nameModel} found with id - ${anomalie._id}` });
}

const create = async(req, res) => {

     const { rooms } = req.body;
     const arrayIds = rooms.split(',');
     req.body.rooms = [];
     
     const correctIds = await waitSearchIds(arrayIds, Room);

     if ( !correctIds.reqStatus )
         return res.status(404).send( correctIds )

     if (correctIds.arrayErrorsId.length > 0) 
          return res.status(400).send({ reqStatus: false, msg: correctIds.arrayErrorsId });

     req.body.rooms = correctIds.arraySuccess;
     const newModel = new Model({...req.body});

     const modelCreated = await newModel.save()
                                        .then(
                                              data => { return { reqStatus: true, 
                                                result: data, 
                                                msg: `${nameModel} - name - ${ data._id } was created`} } )
                                        .catch( err => { return { reqStatus: false, 
                                                   msg: err } } );;

     if (!modelCreated.reqStatus) 
         return res.status(400).send(modelCreated);
                                              
    //Update room status to "in repaired" because they have anomalies
    const correctUpdateStatus = await waitUpdateStatus( arrayIds, Room, 'in reparied' );
    
    if ( !correctUpdateStatus.reqStatus || correctUpdateStatus.arrayErrorsId.length > 0  ) 
       return res.status(400).send(correctUpdateStatus);

    res.status(201).send({...modelCreated, roomsUpdated: correctUpdateStatus.arraySuccess});
}

const update = async(req, res) => {
     const { _id } = req.params;

     if ( validateMongoId( _id ) ) 
          return res.status(400).send( { reqStatus: false, msg: 'Id is invalid' } );

     const anomalieFound = await Model.findById(_id);

     if (!anomalieFound) 
          return res.status(404).send({ reqStatus: false, msg: `${nameModel} not found` });

     const { status, rooms } = req.body;
     
     if( status && status === 'solved' ) {
          const arrayIds = anomalieFound.rooms;
          
          //Update room status to "solved" because they have anomalies
          const correctUpdateStatus = await waitUpdateStatus( arrayIds, Room, 'available' );
    
          if ( !correctUpdateStatus.reqStatus || correctUpdateStatus.arrayErrorsId.length > 0  ) 
               return res.status(400).send(correctUpdateStatus);
     }

     if ( rooms ) {
          const arrayIds = rooms.split(',');

          const correctIds = await waitSearchIds(arrayIds, Room);

          if ( !correctIds.reqStatus )
               return res.status(404).send( correctIds )

          if (correctIds.arrayErrorsId.length > 0) 
               return res.status(400).send({ reqStatus: false, msg: correctIds.arrayErrorsId });
     
          req.body.rooms = [...anomalieFound.rooms, ...correctIds.arraySuccess];

          const arrayIds2 = req.body.rooms;
          
          //Update room status to "solved" because they have anomalies
          const correctUpdateStatus = await waitUpdateStatus( arrayIds2, Room, 'in reparied' );
    
          if ( !correctUpdateStatus.reqStatus || correctUpdateStatus.arrayErrorsId.length > 0  ) 
               return res.status(400).send(correctUpdateStatus);
     }

     const anomalieModified = await Model.findByIdAndUpdate(_id, { ...req.body }, { new: true } );

     if( !anomalieModified ) 
          return res.status(400).send( { reqStatus: false, msg: `${nameModel} not found` } );
                                                    
     res.status(200).send({ reqStatus: true, 
                            result: anomalieModified, 
                            msg: `${nameModel} updated id - ${ anomalieModified._id }` });

}

module.exports = {
     findAll,
     findOneById,
     create,
     update,
}