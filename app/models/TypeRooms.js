const mongoose = require('mongoose');

const TypeRoomsSchema = mongoose.Schema(
     {
          name: {
               type: String,
               required: true,
               enum: {
                    values: ['Simple', 'Junior', 'Suite Imperial' ],
                    message: '{VALUE} only has three values "Sencilla", "Junior" or "Suite Imperial"'
               }
          },
          features: {
               type: String,
               required: true,
          },
          price: {
               type: Number,
               required: true
          },
          //picture: []
     }
);

module.exports = mongoose.model('TypeRomms', TypeRoomsSchema);