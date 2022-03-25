const mongoose = require('mongoose');

const AdditionalServicesSchema = new mongoose.Schema( 
     {
          name: {
               type: String,
               required: true,
          },
          price: {
               type: Number,
               required: true,  
          },
          description: {
               type: String,
               required: true,
          }
     }
)

module.exports = mongoose.model('AdditionalServices', AdditionalServicesSchema);