const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

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


let persons = [
	{
		"name": "Arto Hellas",
		"number": "040-123456",
		"id": 1
	},
	{
		"name": "Martti Tienari",
		"number": "040-123456",
		"id": 2
	},
	{
		"name": "Arto Järvinen",
		"number": "040-123456",
		"id": 3
	},
	{
		"name": "Lea Kutvonen",
		"number": "040-123456",
		"id": 4
	}
]

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
	var uusi_id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
	while(persons.find( person => {
		return person.id === uusi_id
	}) !== undefined
	) {
		uusi_id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
	}
	persons.push({
		"name": req.body.name,
		"number": req.body.number,
		"id": uusi_id
	})
	res.status(200).json({
		id: uusi_id
	})
})

app.get('/api/persons/:id', (req, res) => {
	res_json = persons.find( person => {
		return person.id === Number(req.params.id)
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
		return person.id === Number(req.params.id)
	})
	if(to_delete === -1) {
		res.status(404).json({
			error: "ID:llä ei löytynyyt ketään henkilöä."
		})
	} else {
		delete persons.splice(to_delete, 1)
		res.status(204).send()
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
