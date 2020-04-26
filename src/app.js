const express = require('express')
const app = express()

const bot = require('bot')
bot.setup(app)

const port = process.env.PORT || 1234

app.listen(port, function() {
    console.log(`app started listening on port ${port}`)
})
