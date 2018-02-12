const mongoose = require('mongoose')

function lisaa() {
	const henkilo = new Henkilo({
		name: process.argv[2],
		number: process.argv[3]
	})

	console.log('lisätään henkilö ' + process.argv[2] + ' numero ' + process.argv[3] + ' luetteloon')

	henkilo
		.save()
		.then(res => {
			console.log('Henkilön tiedot tallennettu.')
			mongoose.connection.close()
		})
}

function lue() {
	Henkilo
		.find({})
		.then(res => {
			res.forEach(note => {
				console.log(note)
			})
			mongoose.connection.close()
		})
}

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
const url = 'mongodb://admin:Adminihme8%3D%3DD@ds151452.mlab.com:51452/puhelinluettelo'

mongoose.connect(url)

const Henkilo = mongoose.model('Henkilo', {
	name: String,
	number: String
})

if(process.argv[2] === undefined) {
	lue()
} else {
	lisaa()
}
