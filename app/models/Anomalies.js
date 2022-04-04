const mongoose = require('mongoose');

const AnomaliesSchema = new mongoose.Schema({
    description: {
         type: String,
         required: true
    },
    status: {
         type: String,
         enum: {
               values: ['solved', 'no solved'],
               message: '{VALUE} only has two values "solved" or "no solved"'
         }    
    },
    rooms: []

});

module.exports = mongoose.model('Anomalies', AnomaliesSchema);