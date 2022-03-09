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
               required: true
          }, 
          name : {
               type: String, 
               required: true
          }, 
          lastName : {
               type: String, 
               required: true
          }, 
          numerPhone: {
               type: String,
               required: true
          },
          status: {
               type: Boolean,
               default: true
          }
     }
);

module.exports = mongoose.model('user', UserSchema);