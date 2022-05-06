const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const RoomSchema = mongoose.Schema({
     name: {
          type: String,
          required: true,
          unique: true
     },
     floor: {
          type: Number,
          required: true
     },
     status: {
          type: String,
          enum: {
               values: ['available', 'unavailable', 'in repaired'],
               message: '{VALUE} only has three values "available", "unavailable", "in repaired"'
          }
     },
     idTypeRoom: {
          type: ObjectId,
          required: true,
          ref: 'TypeRomms'
     },
     daysOff: []
});

module.exports = mongoose.model('Rooms', RoomSchema);