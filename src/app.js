const restify = require('restify')
const path = require('path')
const dotenv = require('dotenv')
const { BotFrameworkAdapter } = require('botbuilder')
const { MyBot } = require('./bot')

const ENV_FILE = path.join(__dirname, '.env')
dotenv.config({ path: ENV_FILE })

const port = process.env.PORT || 1234
const app = restify.createServer()
app.listen(port, () => {
  console.log(`app started listening on port ${port}`)
})

const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
})

const onTurnErrorHandler = async (context, error) => {
  console.error(`\n [onTurnError] unhandled error: ${ error }`)

  await context.sendTraceActivity(
      'OnTurnError Trace',
      `${ error }`,
      'https://www.botframework.com/schemas/error',
      'TurnError'
  )

  await context.sendActivity('The bot encountered an error.')
}

adapter.onTurnErrorHandler = onTurnErrorHandler

const myBot = new MyBot()

app.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async context => {
    await myBot.run(context)
  })
})

app.on('upgrade', (req, socket, head) => {
  const streamingAdapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
  })

  streamingAdapter.onTurnError = onTurnErrorHandler

  streamingAdapter.useWebSocket(req, socket, head, async context => {
    await myBot.run(context)
  })
})