//TODO: ADD IMAGE
const Model = require('../models/TypeRooms');
const { validateMongoId } = require('../common/functions/validation-common');

const nameModel = 'Type Rooms';

const findAll = async ( req, res ) => {
     const result = await Model.find();

     if ( !result ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     res.status(201).send( { reqStatus: true, 
                                    result, 
                                    msg: `${nameModel} found all` } );
}

const findOneById = async ( req, res ) => {
     const { _id } = req.params;

     if ( validateMongoId( _id ) ) 
          return res.status(400).send( { reqStatus: false, msg: 'Id is invalid' } );

     const result = await Model.findById( _id );

     if ( !result ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
                                    result, 
                                    msg: `${nameModel} - name - ${ result.name } was found` } );
}

const create = async ( req, res ) => {
     //TODO: add image
     const newModel = new Model( { ...req.body } );

     await newModel.save()
                     .then( data => {
                         res.status(201).send( { reqStatus: true, 
                              result: data, 
                              msg: `${nameModel} - name - ${ data.name } was created`} );
                     })
                     .catch( err => {
                         res.status(400).send( { reqStatus: false, err } );
                     })

}

const update = async ( req, res ) => {
     //TODO: add image
     const { _id } = req.params; 

     if ( validateMongoId( _id ) ) 
          return res.status(400).send( { reqStatus: false, msg: 'Id is invalid' } );

     const newModel = new Model( { ...req.body } ); 

     const modelReview = await newModel.validate()
                                        .then( data => { return { validate: true, data } } )
                                        .catch( err => { return { validate: false, err} } );

     if ( !modelReview.validate ) return res.status(400).send( { reqStatus: false, errors: modelReview.err.errors } );

     const result = await Model.findByIdAndUpdate(_id, { ...req.body });

     if ( !result ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
                                    result, 
                                    msg: `${nameModel} - name - ${ result.name } was updated` } );

}

const deleteOne = async ( req, res ) => {
     const { _id } = req.params;

     if ( validateMongoId( _id ) ) 
          return res.status(400).send( { reqStatus: false, msg: 'Id is invalid' } );

     const result = await Model.findByIdAndDelete( _id );

     if ( !result ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
                                    result, 
                                    msg: `${nameModel} - name - ${ result.name } was deleted` } );
     
}

module.exports = {
     findAll,
     findOneById,
     create,
     update,
     deleteOne,
}