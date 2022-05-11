const { validateMongoId } = require('./validation-common');
const fs = require('fs-extra');

const waitSearchIds = async (arrayIds, Model) => {
     try {
          let arraySuccess = []
          let arrayErrorsId = [];

          await arrayIds.reduce( async (previousPromise ,idRoom) => {
          
               await previousPromise

               if ( validateMongoId( idRoom ) ) 
                    return arrayErrorsId = [...arrayErrorsId, { success: false, msg: 'Id is invalid', idRoom }];
                    
     
               const roomFound = await Model.findOne( {_id: idRoom} );

               if (!roomFound) 
                    return arrayErrorsId = [...arrayErrorsId, { success: false, msg: 'Id room not found', idRoom }];
     
               arraySuccess = [...arraySuccess, idRoom];

               return Promise.resolve()
          }, Promise.resolve());

          return { success: true, arraySuccess, arrayErrorsId}
     
     } catch (error) {
          throw { success: false, error, msg: 'There is an error!' };     
     }
}

const waitUpdateStatus = async (arrayIds, Model, status) => {

     try {
          let arraySuccess = []
          let arrayErrorsId = [];

          await arrayIds.reduce( async (previousPromise ,idRoom) => {
          
               await previousPromise

               if ( validateMongoId( idRoom ) ) 
                    return arrayErrorsId = [...arrayErrorsId, { success: false, msg: 'Id is invalid', idRoom }];

               
               const roomUpdated = await Model.findByIdAndUpdate( idRoom, { status }, { new: true } );

               if (!roomUpdated) 
                    return arrayErrorsId = [...arrayErrorsId, { success: false, msg: 'Id room not found', idRoom }];
     
               arraySuccess = [...arraySuccess, roomUpdated];

               return Promise.resolve()

          }, Promise.resolve());

          return { success: true, arraySuccess, arrayErrorsId}
     
     } catch (error) {
          throw { success: false, error, msg: 'There is an error!' };     
     }
}

const waitDeleteImagesFs = async (arrayPaths = []) => {
     try {
         await arrayPaths.reduce( async (previousPromise, path) => {
          
               await previousPromise

                    await fs.remove(`./${path}`);    

               return Promise.resolve()
          }, Promise.resolve());

          return { success: true, arrayPaths, msg: `All paths removed` }
     
     } catch (error) {
          throw { success: false, error, msg: 'There is an error!' };     
     }
}

const waitCreateDatesOffRooms = async (arrayIds = [], fechasOff = [], Model) => {
     try {
          await arrayIds.reduce( async (previousPromise, _id) => {
           
                await previousPromise
                    const room = await Model.findById(_id);
                    room.daysOff = [ ...room.daysOff, ...fechasOff ];
                    
                    await room.save();
                return Promise.resolve()
           }, Promise.resolve());
 
           return { success: true, arrayIds, msg: `All Dates were added in each room` }
      
      } catch (error) {
           throw { success: false, error, msg: 'There is an error!' };     
      }
}

module.exports = {
     waitSearchIds,
     waitUpdateStatus,
     waitDeleteImagesFs,
     waitCreateDatesOffRooms
}