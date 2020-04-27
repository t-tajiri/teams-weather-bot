const { ActivityHandler, MessageFactory } = require('botbuilder')
const teams = require('botbuilder-teams')

class MyBot extends ActivityHandler {
  constructor() {
    super()

    this.onMessage(async (context, next) => {
      const echoText = `You said ${ context.activity.text }`

      await context.sendActivity(MessageFactory.text(echoText, echoText))

      await next()
    })

    this.onConversationUpdate(async (context, next) => {
      const updateText = '[conversation Update event detected]'
      await context.sendActivity(MessageFactory.text(updateText, updateText))

      await next()
    })
  }
}

module.exports.MyBot = MyBot