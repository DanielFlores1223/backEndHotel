const Model = require('../models/TypeRooms');
const { validateMongoId } = require('../common/functions/validation-common');
const { waitDeleteImagesFs } = require('../common/functions/my-promises');

const nameModel = 'Type Rooms';

const findAll = async ( req, res ) => {
     const result = await Model.find();

     if ( !result ) return res.status(400).send( { success: false, msg: 'Error in the request' } );

     res.status(201).send( { success: true, 
                                    result, 
                                    msg: `${nameModel} found all` } );
}

const findOneById = async ( req, res ) => {
     const { _id } = req.params;

     if ( validateMongoId( _id ) ) 
          return res.status(400).send( { success: false, msg: 'Id is invalid' } );

     const result = await Model.findById( _id );

     if ( !result ) return res.status(400).send( { success: false, msg: 'Error in the request' } );

     return res.status(201).send( { success: true, 
                                    result, 
                                    msg: `${nameModel} - name - ${ result.name } was found` } );
}

const create = async ( req, res ) => {
     try {
          console.log(req.body.image);
          console.log(req.files)
          let arrayPaths = [];
          const { files } = req;
          let errorType = false;

          if (!files || files.length === 0)
               return res.status(400).send({ success: false, msg: 'There are not images', ot: req.body.image });

          files.forEach( image => {

               const filetType = image.mimetype.split('/');
               if ( !filetType[0] === 'image' ) 
                    errorType = true;

               arrayPaths = [...arrayPaths, image.path];
          });

          if ( errorType )
               return res.status(400).send({ success: false, msg: 'every file have to be images' });

          req.body.picture = arrayPaths;

          const newModel = new Model( { ...req.body } );

          const result = await newModel.save();

          res.status(201).send( { success: true, 
                                  result, 
                                  msg: `${nameModel} - name - ${ result.name } was created`} );
     } catch (error) {
          res.status(400).send( { success: false, error ,msg: 'Error in the request' } );
     
     }
}

const update = async ( req, res ) => {
     const { _id } = req.params; 

     if ( validateMongoId( _id ) ) 
          return res.status(400).send( { success: false, msg: 'Id is invalid' } );

     const newModel = new Model( { ...req.body } ); 

     const modelReview = await newModel.validate()
                                        .then( data => { return { validate: true, data } } )
                                        .catch( err => { return { validate: false, err} } );

     if ( !modelReview.validate ) return res.status(400).send( { success: false, msg: modelReview.err.errors } );

     const result = await Model.findByIdAndUpdate(_id, { ...req.body });

     if ( !result ) return res.status(400).send( { success: false, msg: 'Error in the request' } );

     return res.status(201).send( { success: true, 
                                    result, 
                                    msg: `${nameModel} - name - ${ result.name } was updated` } );

}

const deleteOne = async ( req, res ) => {
     try {
          const { _id } = req.params;

          if ( validateMongoId( _id ) ) 
               return res.status(400).send( { success: false, msg: 'Id is invalid' } );

          const typeRoom = await Model.findById(_id);
     
          if (!typeRoom) 
               return res.status(404).send( { success: false, msg: `${nameModel} not found` } );

          await waitDeleteImagesFs( typeRoom.picture );
          const result = await Model.findByIdAndDelete( _id );

          if ( !result ) return res.status(400).send( { success: false, msg: 'Error in the request' } );

          res.status(200).send( { success: true, 
                                  result, 
                                  msg: `${nameModel} - name - ${ result.name } was deleted` } );

     } catch (error) {
          res.status(400).send( { success: false, error ,msg: 'Error in the request' } );
     }
     
}

const addPictures = async (req, res) => {
     try {
          const { _id } = req.params;
          let arrayPaths = [];
          const { files } = req;
          let errorType = false;

          if (!files)
               return res.status(400).send({ success: false, msg: 'There are not images' });

          files.forEach( image => {

               const filetType = image.mimetype.split('/');
               if ( !filetType[0] === 'image' ) 
                    errorType = true;

               arrayPaths = [...arrayPaths, image.path];
          });

          if ( errorType )
               return res.status(400).send({ success: false, msg: 'every file have to be images' });

          const typeRoom = await Model.findById(_id);

          if (!typeRoom)
               return res.status(404).send( { success: false, msg: `${nameModel} not found` } );

          const allPaths = [ ...typeRoom.picture, ...arrayPaths ];
          const result = await Model.findByIdAndUpdate( _id, { picture: allPaths }, { new: true } );

          res.status(200).send( { success: true, 
                                  result, 
                                  msg: `${nameModel} - Images uploaded`} );

     } catch (error) {
          res.status(400).send( { success: false, error ,msg: 'Error in the request' } );
     }
}

const deleteOnePicture = async (req, res) => {

     try {
          const { _id } = req.params;
          const { path } = req.body;
          const typeRoom = await Model.findById(_id);
          const { picture } = typeRoom;

          const pathFound = picture.indexOf(path);

          if ( pathFound === -1 )
               return res.status(404).send( { success: false, msg: 'Path not found' } );

          const newPictures = picture.filter( p => p !== path );

          const result = await Model.findByIdAndUpdate( _id, { picture: newPictures }, { new: true } );

          await waitDeleteImagesFs( [ path ] );

          res.status(200).send( { success: true, 
                                  result, 
                                  msg: `${nameModel} - name - ${ result.name }, picture deleted` } );

     } catch (error) {
          res.status(400).send( { success: false, error ,msg: 'Error in the request' } );
     }
}

module.exports = {
     findAll,
     findOneById,
     create,
     update,
     deleteOne,
     deleteOnePicture,
     addPictures
}