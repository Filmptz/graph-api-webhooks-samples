const EventEmitter = require('eventemitter3')
const express = require('express')
const router = express.Router()
const { FB } = require('fb/lib/fb')

const emitter = new EventEmitter()

router
	.get('/', function (req, res) {
		res.writeHead(200, {
			Connection: 'keep-alive',
			'Content-Type': 'text/event-stream; charset=UTF-8',
			'Cache-Control': 'no-cache'
		})
		res.write('Start Streaming Message\n\n')
 
		FB.setAccessToken('EAACZCmYt8wZBEBAPaFqgtb7pa90RB7VZB1ALZBf9ZB4KfCn4gbXu65sKD7IJZACPRVJByjGGbKkLxNjIHvRSUgh1YG4hInKbupiZAlgbDyqdwlI5MnuSxQHft8gUyIi3suB4lXtDkaf74rNSCQW6jRtfRa7DVOZA0YhRU9S03XEvHehahShMys9DDjvMZAnZC6KpsxtVskFSEhUQZDZD')
		const onMessage = async (data) => {
			res.write(
				`data: ${JSON.stringify({
					sender: {
						ig_id: data.entry[0].messaging[0].sender.id,
						profile_url: (await FB.api(`${data.entry[0].messaging[0].sender.id}`)).profile_pic
						? (await FB.api(`${data.entry[0].messaging[0].sender.id}`)).profile_pic
						: ''
					},
					text: data.entry[0].messaging[0].message.text
						? data.entry[0].messaging[0].message.text
						: false,
					timestamp: data.entry[0].messaging[0].timestamp
				})}\n\n`
			)
		}
		emitter.on('message', onMessage)

		req.on('close', function () {
			emitter.removeListener('message', onMessage)
		})
	})

	.get('/:user_ig_id', function (req, res) {
		res.writeHead(200, {
			Connection: 'keep-alive',
			'Content-Type': 'text/event-stream; charset=UTF-8',
			'Cache-Control': 'no-cache'
		})
		res.write('Start Streaming Message\n\n')

		const onMessage = (data) => {
			if (data.entry[0].messaging[0].sender.id === req.params.user_ig_id) {
				res.write(
					`data: ${JSON.stringify({
						sender: data.entry[0].messaging[0].sender.id,
						text: data.entry[0].messaging[0].message.text
							? data.entry[0].messaging[0].message.text
							: false,
						timestamp: data.entry[0].messaging[0].timestamp
					})}\n\n`
				)
			}
		}
		emitter.on('message', onMessage)

		req.on('close', function () {
			emitter.removeListener('message', onMessage)
		})
	})

	.get('/instagram', function (req, res) {
		if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.TOKEN) {
			res.send(req.query['hub.challenge'])
		} else {
			res.sendStatus(400)
		}
	})

	.post('/instagram', function (req, res) {
        console.log(req.body)
		// Process the Instagram updates here
		emitter.emit('message', req.body)
		res.sendStatus(200)
	})

module.exports = router
