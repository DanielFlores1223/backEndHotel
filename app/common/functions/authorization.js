const jwt = require('jsonwebtoken');
const credential = '@GTSK123SO98*/@23-SD243Q'

const createToken = ( userId, role, access ) => {
     const token = jwt.sign(
          {
              _id: userId,
              role,
              access
          },
          credential,
          { expiresIn: '1hr'}
      );
  
      return token;
}

module.exports = {
     createToken
}