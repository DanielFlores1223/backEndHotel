//TODO: ADD IMAGE
const Model = require('../models/TypeRooms');

const nameModel = 'Type Rooms';

const findAll = async ( req, res ) => {
     const resComplete = await Model.find();

     if ( !resComplete ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     res.status(201).send( { reqStatus: true, 
                                    resComplete, 
                                    msg: `${nameModel} found all` } );
}

const findOneById = async ( req, res ) => {
     const { _id } = req.params;

     const resComplete = await Model.findById( _id );

     if ( !resComplete ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
                                    resComplete, 
                                    msg: `${nameModel} - name - ${ resComplete.name } was found` } );
}

const create = async ( req, res ) => {
     //TODO: add image
     const newModel = new Model( { ...req.body } );

     await newModel.save()
                     .then( data => {
                         res.status(201).send( { reqStatus: true, 
                              data, 
                              msg: `${nameModel} - name - ${ data.name } was created`} );
                     })
                     .catch( err => {
                         res.status(400).send( { reqStatus: false, err } );
                     })

}

const update = async ( req, res ) => {
     //TODO: add image
     const { _id } = req.params; 

     const newModel = new Model( { ...req.body } ); 

     const modelReview = await newModel.validate()
                                        .then( data => { return { validate: true, data } } )
                                        .catch( err => { return { validate: false, err} } );

     if ( !modelReview.validate ) return res.status(400).send( { reqStatus: false, errors: modelReview.err.errors } );

     const resComplete = await Model.findByIdAndUpdate(_id, { ...req.body });

     if ( !resComplete ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
                                    resComplete, 
                                    msg: `${nameModel} - name - ${ resComplete.name } was updated` } );

}

const deleteOne = async ( req, res ) => {
     const { _id } = req.params;

     const resComplete = await Model.findByIdAndDelete( _id );

     if ( !resComplete ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
                                    resComplete, 
                                    msg: `${nameModel} - name - ${ resComplete.name } was deleted` } );
     
}

module.exports = {
     findAll,
     findOneById,
     create,
     update,
     deleteOne,
}