const Model = require('../models/AdditionalServices');
const { validateMongoId } = require('../common/functions/validation-common');
const nameModel = 'Additional Service';

const findAll = async ( req, res ) => {
     const result = await Model.find();

     if ( !result ) return res.status(404).send( { success: false, msg: 'Error in the request' } );

     return res.status(200).send( { success: true, 
                                    result, 
                                    msg: `${nameModel} found all` } );
}

const findOneById = async ( req, res ) => {
     const { _id } = req.params;

     if ( validateMongoId( _id ) ) 
          return res.status(400).send( { success: false, msg: 'Id is invalid' } );

     const result = await Model.findById( _id );

     if ( !result ) return res.status(400).send( { success: false, msg: 'Error in the request' } );

     return res.status(200).send( { success: true, 
                                    result, 
                                    msg: `${nameModel} - name - ${ result.name } was found` } );
}

const create = async ( req, res ) => {

     try {
          const newModel = new Model( { ...req.body } );
          const result = await newModel.save();

          if ( !result ) return res.status(400).send( { success: false, msg: 'Error in the request' } );

          res.status(201).send( { success: true, 
                                  result, 
                                  msg: `${nameModel} - name - ${ result.name } was created` } );
     } catch (error) {
          res.status(400).send( { success: false, error ,msg: `${nameModel} was not created` } );
     }
}

const update = async ( req, res ) => {
     
     try {
          const { _id } = req.params; 

          if ( validateMongoId( _id ) ) 
               return res.status(400).send( { success: false, msg: 'Id is invalid' } );

          const result = await Model.findByIdAndUpdate(_id, { ...req.body });

          if ( !result ) return res.status(400).send( { success: false, msg: 'Error in the request' } );

          res.status(200).send( { success: true, 
                                  result, 
                                  msg: `${nameModel} - name - ${ result.name } was updated` } );
     } catch (error) {
          res.status(400).send( { success: false, error, msg: `${nameModel} was not updated` } );
     }
}


const deleteOne = async ( req, res ) => {

     try {
          const { _id } = req.params;

          if ( validateMongoId( _id ) ) 
               return res.status(400).send( { success: false, msg: 'Id is invalid' } );
     
          const result = await Model.findByIdAndDelete( _id );
     
          if ( !result ) return res.status(400).send( { success: false, msg: 'Error in the request' } );
     
          res.status(201).send( { success: true, 
                                  result, 
                                  msg: `${nameModel} - name - ${ result.name } was deleted` } );    

     } catch (error) {
          res.status(400).send( { success: false, error, msg: `${nameModel} was not deleted` } );
     }
}



module.exports = {
     findAll,
     findOneById,
     create,
     update,
     deleteOne,
}