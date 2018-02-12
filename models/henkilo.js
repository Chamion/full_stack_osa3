const mongoose = require('mongoose')

url = 'mongodb://admin:Adminihme8%3D%3DD@ds151452.mlab.com:51452/puhelinluettelo'

mongoose.connect(url)

const Henkilo = mongoose.model('Henkilo', {
	name: String,
	number: String
})

module.exports = Henkilo