const user = 'Daniel12';
const password ='taison23';
const db = 'hotel'

const credentials = {
     DB_URI: `mongodb+srv://${user}:${password}@cluster0.qy3ju.mongodb.net/${db}?retryWrites=true&w=majority`,
}

module.exports = {
     credentials
}