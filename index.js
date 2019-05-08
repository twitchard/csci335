const app = require('express')()

app.listen(3000, err => {
    if (err) throw err
    console.log('Listening on port 3000')
})

let n = 0

app.use((req, res, next) => {
    console.log(`Start: ${req.method} - ${req.path}`)
    const start = Date.now()
    res.on('finish', ()=>console.log(
        `Finished serving ${req.method} - ${req.path} in ${Date.now()-start}`
    ))
    return next()
})
app.post('/chemistry', (req, res, next) => {
    if (Math.random() > 0.8) {
        res.status(500)
        res.setHeader('content-type', 'application/text')
        res.send('you foool! you will never titrate me!')
        return
    }
    res.status(200)
    res.setHeader('content-type', 'application/json')
    n++
    const message = `congratulations you made 1 chemistry, there are ${n} total chemistries`
    setTimeout(() => {
        res.send(JSON.stringify({ message, n }))
    }, 3000 * Math.random())
    const stop = Date.now() + (100 * Math.random())
    while (Date.now() < stop) {}
})
app.get('/', (req, res, next) => {
    res.setHeader('content-type', 'text/html')
    res.send(
`<html>
    <body>
        <h1>ChemTutor: Richard Edition</h1>
        <button type="button" onclick="chemistry()">Do some chemistry</button>
        <button type="button" onclick="clearThem()">all right thats enough chemistries</button>
        <h3>There have been <span id="n">${n}</span> total chemistries</h3>
        <div id="chemistries">
        </div>
        <script>
        function clearThem () {
            console.log('clearing')
            const elm = document.getElementById('chemistries')
            Array.prototype.slice.apply(elm.children).map(c => elm.removeChild(c))
        }
        function newChemistry ({message, n}) {
            const elm = document.createElement('p')
            elm.innerText = message
            document.getElementById('chemistries').appendChild(elm)
            document.getElementById('n').innerText = String(n)
        }
        function newError (m) {
            const elm = document.createElement('p')
            elm.innerText = 'chemistry did not succeed: ' + m
            document.getElementById('chemistries').appendChild(elm)
        }
        function chemistry() {
            const http = new XMLHttpRequest()
            http.open('POST', window.location.origin + '/chemistry')
            http.onreadystatechange = function () {
                console.log(this)
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        newChemistry(JSON.parse(http.responseText))
                    } else {
                        newError(http.responseText)
                    }
                }
            }
            http.send()
        }
        </script>
    </body>
</html>`)
})
