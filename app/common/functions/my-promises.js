const { validateMongoId } = require('./validation-common');

const waitSearchIds = async (arrayIds, Model) => {
     try {
          let arraySuccess = []
          let arrayErrorsId = [];

          await arrayIds.reduce( async (previousPromise ,idRoom) => {
          
               await previousPromise

               if ( validateMongoId( idRoom ) ) 
                    return arrayErrorsId = [...arrayErrorsId, { reqStatus: false, msg: 'Id is invalid', idRoom }];
                    
     
               const roomFound = await Model.findOne( {_id: idRoom} );

               if (!roomFound) 
                    return arrayErrorsId = [...arrayErrorsId, { reqStatus: false, msg: 'Id room not found', idRoom }];
     
               arraySuccess = [...arraySuccess, idRoom];

               return Promise.resolve()
          }, Promise.resolve());

          return { reqStatus: true, arraySuccess, arrayErrorsId}
     
     } catch (error) {
          throw { reqStatus: false, msg: 'There is an error!' };     
     }
}

const waitUpdateStatus = async (arrayIds, Model, status) => {

     try {
          let arraySuccess = []
          let arrayErrorsId = [];

          await arrayIds.reduce( async (previousPromise ,idRoom) => {
          
               await previousPromise

               if ( validateMongoId( idRoom ) ) 
                    return arrayErrorsId = [...arrayErrorsId, { reqStatus: false, msg: 'Id is invalid', idRoom }];

               
               const roomUpdated = await Model.findByIdAndUpdate( idRoom, { status }, { new: true } );

               if (!roomUpdated) 
                    return arrayErrorsId = [...arrayErrorsId, { reqStatus: false, msg: 'Id room not found', idRoom }];
     
               arraySuccess = [...arraySuccess, roomUpdated];

               return Promise.resolve()

          }, Promise.resolve());

          return { reqStatus: true, arraySuccess, arrayErrorsId}
     
     } catch (error) {
          throw { reqStatus: false, msg: 'There is an error!' };     
     }
}

module.exports = {
     waitSearchIds,
     waitUpdateStatus
}