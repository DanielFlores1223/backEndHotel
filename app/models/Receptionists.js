const mongoose = require('mongoose');

const ReceptionistSchema = new mongoose.Schema(
     {
          idUser: {
               type: String,
               required: true
          },
          changeDB: [
               {
                    dateChange: Date ,
                    procedure: String ,
                    IdDocument: String,

               }
          ]
     }
);

module.exports = mongoose.model('Receptionists', ReceptionistSchema);