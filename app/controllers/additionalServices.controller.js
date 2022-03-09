const Model = require('../database/models/AdditionalServices');

const createAddtionalService = async ( req, res ) => {

     const newModel = new Model( { ...req.body } );
     const resComplete = await newModel.save();

     if ( !resComplete ) return res.status(400).send( { reqStatus: false } );

     return res.status(201).send( { reqStatus: true, resComplete } );

}

const updateAdditionalService = async ( req, res ) => {
     const { _id } = req.params;

     //const resComplete = Model.findByIdAndUpdate(_id, {  })

}


module.exports = {
     createAddtionalService,
}