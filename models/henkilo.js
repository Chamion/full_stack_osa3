const mongoose = require('mongoose')

url = process.env.MONGODB_URI

mongoose.connect(url)

const Henkilo = mongoose.model('Henkilo', {
	name: String,
	number: String
})

module.exports = Henkilo