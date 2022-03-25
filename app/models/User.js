const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
     {
          email :{ 
               type: String,
               unique: true, 
               required: true
          },
          password: {
               type: String, 
               required: true
          },
          role : {
               type: String, 
               required: true,
               /*Admin, Receptionist,  customer */
               enum: {
                    values: ['Admin', 'Receptionist', 'Customer'],
                    message: '{VALUE} only has three values "Admin", "Receptionist", "Customer"'
               }
          }, 
          name : {
               type: String, 
               required: true
          }, 
          lastName : {
               type: String, 
               required: true
          }, 
          numberPhone: {
               type: String,
               required: true
          },
          status: {
               type: Boolean,
               default: true
          }
     }
);

module.exports = mongoose.model('Users', UserSchema);