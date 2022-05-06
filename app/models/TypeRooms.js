const mongoose = require('mongoose');

const TypeRoomsSchema = mongoose.Schema(
     {
          name: {
               type: String,
               required: true,
          },
          guests: {
               type: Number,
               required: true
          },
          features: {
               type: String,
               required: true,
          },
          price: {
               type: Number,
               required: true
          },
          picture: []
     }
);

module.exports = mongoose.model('TypeRomms', TypeRoomsSchema);