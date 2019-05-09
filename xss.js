const app = require('express')()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.listen(3000, err => {
    if (err) throw err
    console.log('Listening on port 3000')
})

let n = 0

const graffitis = []
const ccs = {}

app.use(bodyParser())
app.use(cookieParser())
app.use((req, res, next) => {
    res.setHeader('content-type', 'text/html')
    return next()
})
app.use((req, res, next) => {
    const { name } = req.cookies
    if (name && !ccs[name]) {
        res.clearCookie('name')
        return res.redirect('/')
    }
    return next()
})
app.post('/graffiti', (req, res, next) => {
    const { name } = req.cookies
    const { text } = req.body
    if (!name) return unauthorized(req, res, next)
    graffitis.push({name, text})
    res.redirect('/')
})
app.post('/login', (req, res, next) => {
    const { name, cc } = req.body
    ccs[name] = cc
    res.cookie('name', name)
    res.redirect('/')
})
app.post('/logout', (req, res, next) => {
    res.clearCookie('name')
    res.redirect('/')
})
app.get('/cc', (req, res, next) => {
    const { name } = req.cookies
    if (!name) return unauthorized(req, res, next)
    res.send(`${name} credit card: ${ccs[name]}`)
})

app.get('/', (req, res, next) => {
    const { name } = req.cookies
    if (!name) return loggedOut(req, res, next)
    return loggedIn(req, res, next)
})

function header() {
    return '<h1>Ancient Graffiti Project: Richard Addition</h1>'
}
function loginForm() {
    return `
    <form action="/login" method="POST">
        Name: <input name="name"/></br>
        Credit Card: <input name="cc"/></br>
        <button>Log in to submit your own ancient graffiti</button>
    </form>`
}
function ccLink () {
    return `<a href="/cc">your credit card info</a>`
}
function renderGraffitis() {
    return `<h2>Trending ancient graffitis</h2>` +
        graffitis
            .map(({text, name}) => `<p><span>${text}</span> (submitted by ${name})</p>`)
            .slice(-3)
            .join('\n')
}
function graffitiForm() {
    return `
        <h2>Write your ancient graffiti here</h2>
    <form action="/graffiti" method="POST">
        <textarea name="text" style="width:400px;height:140px"></textarea>
        <button>Submit</button>
    </form>`
}
function logOutForm () {
    return `<form action="/logout" method="POST">
        <button>log out</button>
    </form>`
}
function unauthorized(req, res, next) {
    res.status(401)
    return res.send(`
        You are not logged in. <a href="../">back</a>
    `)
}
function loggedOut(req, res, next) {
    return res.send(`
    ${header()}
    ${renderGraffitis()}
    ${loginForm()}
`)
}
function loggedIn (req, res, next) {
    return res.send(`
    ${logOutForm()}
    ${header()}
    ${ccLink()}
    ${graffitiForm()}
    ${renderGraffitis()}
    `)
}
