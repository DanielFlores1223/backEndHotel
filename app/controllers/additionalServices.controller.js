const Model = require('../database/models/AdditionalServices');
const nameModel = 'Additional Service';

const findAll = async ( req, res ) => {
     const resComplete = await Model.find();

     if ( !resComplete ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
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

     const newModel = new Model( { ...req.body } );
     const resComplete = await newModel.save();

     if ( !resComplete ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
                                    resComplete, 
                                    msg: `${nameModel} - name - ${ resComplete.name } was updated` } );

}

const update = async ( req, res ) => {
     const { _id } = req.params;
     
     const newModel = new Model( { ...req.body } );
     const { name, description, price } = newModel; 

     if ( name === '' || 
          description === '' || 
          ( price === '' || price === null) ) 
          return res.status(400).send( { reqStatus: false, msg: 'All fields are required' } );

     const resComplete = await Model.findByIdAndUpdate(_id, { ...req.body });

     if ( !resComplete ) return res.status(400).send( { reqStatus: false, msg: 'Error in the request' } );

     return res.status(201).send( { reqStatus: true, 
                                    resComplete, 
                                    msg: `${nameModel} - name - ${ resComplete.name } was created` } );

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