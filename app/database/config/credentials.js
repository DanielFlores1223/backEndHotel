const user = 'test-123';
const password ='test123';
const db = 'hotel'

const credentials = {
     DB_URI: `mongodb+srv://${user}:${password}@cluster0.qy3ju.mongodb.net/${db}?retryWrites=true&w=majority`,
}

module.exports = {
     credentials
}