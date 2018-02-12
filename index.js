const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Henkilo = require('./models/henkilo')

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.json())
morgan.token('body', function getBody (req) {
	return JSON.stringify(req.body)
})
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
	tokens.body(req, res), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))
app.use(cors())
app.use(express.static('build'))

const formatHenkilo = (henkilo) => {
	const formattedHenkilo = { ...henkilo._doc, id: henkilo._id }
	delete formattedHenkilo._id
	delete formattedHenkilo.__v
	return formattedHenkilo
}

let persons = []

Henkilo
	.find({})
	.then( res => {
		res.forEach( henkilo => {
			persons.push(formatHenkilo(henkilo))
		})
	})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.post('/api/persons', (req, res) => {
	if(req.body.name === undefined) {
		res.status(400).json({
			error: "Parametri name puuttuu."
		})
		return
	}
	if(req.body.number === undefined) {
		res.status(400).json({
			error: "Parametri number puuttuu."
		})
		return
	}
	if(persons.find( person => {
		return person.name === req.body.name
	}) !== undefined
	) {
		res.status(405).json({
			error: "Henkilö on jo puhelinluettelossa."
		})
		return
	}
	const henkilo = new Henkilo({
		name: req.body.name,
		number: req.body.number
	})
	henkilo
		.save()
		.then(a => {
			Henkilo
				.find({ name: req.body.name })
				.then( result => {
					uusi_henkilo = formatHenkilo(result[0])
					persons.push(uusi_henkilo)
					res.status(200).json({
						id: uusi_henkilo.id
					})
				})
		})
})

app.get('/api/persons/:id', (req, res) => {
	res_json = persons.find( person => {
		return String(person.id) === req.params.id
	})
	if(res_json === undefined) {
		res.status(404).json({
			error: "ID:llä ei löytynyyt ketään henkilöä."
		})
	} else {
		res.json(res_json)
	}
})

app.delete('/api/persons/:id', (req, res) => {
	to_delete = persons.findIndex( person => {
		return String(person.id) === req.params.id
	})
	if(to_delete === -1) {
		res.status(404).json({
			error: "ID:llä ei löytynyyt ketään henkilöä."
		})
	} else {
		Henkilo
			.findByIdAndRemove(req.params.id)
			.then(a => {
				delete persons.splice(to_delete, 1)
				res.status(204).send()
			})
	}
})

app.get('/info', (req, res) => {
	res.render('info', {
		lkm: persons.length,
		aika: new Date()
	})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
