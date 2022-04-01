const idMongoRegex = require('../regular-expressions/idMongo.regex');

const validateMongoId = ( _id ) => {
     if ( !_id.match(idMongoRegex) )
          return true;
          
     return false;
}

module.exports = {
     validateMongoId
}