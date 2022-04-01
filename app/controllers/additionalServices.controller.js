const Model = require('../models/AdditionalServices');
const { validateMongoId } = require('../common/functions/validation-common');
const nameModel = 'Additional Service';

const findAll = async ( req, res ) => {
     const result = await Model.find();

     if ( !result ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
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
     
     const newModel = new Model( { ...req.body } );
     const result = await newModel.save();

     if ( !result ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
                                    result, 
                                    msg: `${nameModel} - name - ${ result.name } was created` } );

}

const update = async ( req, res ) => {
     
     const { _id } = req.params; 

     if ( validateMongoId( _id ) ) 
          return res.status(400).send( { reqStatus: false, msg: 'Id is invalid' } );

     const newModel = new Model( { ...req.body } ); 
     const { name, description, price } = newModel; 

     if ( name === '' || 
          description === '' || 
          ( price === '' || price === null) ) 
          return res.status(400).send( { reqStatus: false, msg: 'All fields are required' } );

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