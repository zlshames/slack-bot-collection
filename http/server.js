const bodyParser = require('koa-bodyparser')
const koa = require('koa')
const koaRouter = require('koa-router')
const commands = require('./commands')
const utils = require('./utils')

// Instantiate koa and koa-router
const app = new koa()
const router = koaRouter()

// Enable bodyparser and router
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

// Possible commands
cmdMap = {
    'btc': commands.bitcoin,
    'gif': commands.gif,
    'weather': commands.weather
}

// Apply error handling middleware
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.status = 400
        ctx.body = `The following error has occurred: ${ err }`
    }
})

// Main route to handle requests
router.post('/', async (ctx, next) => {
    // Parse request
    const body = ctx.request.body
    const command = body.text.split(' ')[0].trim().toLowerCase()
    let input = ''
    if (body.text.split(' ').length > 1) {
        input = body.text.substring(body.text.indexOf(' ') + 1, body.text.length)
    }
    
    // Declare return variables
    let result = "The server responded strangely... Report this to Zach."
    let status = 200

    // If the command isn't valid, return
    if (cmdMap.hasOwnProperty(command)) {
        result =  await cmdMap[command](input)
    } else {
        result = utils.buildResponse('ephemeral', `An unknown command was passed: ${ command }`)
    }

    ctx.status = status
    ctx.body = result 
})

const host = "127.0.0.1"
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Available on http://${ host }:${ port }`)
})