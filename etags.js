const server = require('http').createServer((req,res) => {
    if (req.headers['if-none-match'] === 'abc') {
        res.writeHead(304, {
            etag: 'abc'
        })
        res.end()
        return
    }
    res.writeHead(200, {
        etag: 'abc'
    })
    res.write('richard was here')
    res.end() 
})
server.listen(3000)
