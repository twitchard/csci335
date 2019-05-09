const app = require('express')()
const net = require('net')
const util = require('util')
const redis = require('redis').createClient()
const getFromRedis = util.promisify(redis.get.bind(redis))
const setInRedisWithTTL = util.promisify(redis.setex.bind(redis))

const SEVEN_SECONDS = 7

const start = Date.now()
function log(message) {
    const t = Math.floor((Date.now() - start) / 1000)
    console.log(`t=${t}: ${message}`)
}

// Inefficient fib
function fib(n) {
    if (n < 2) return 1
    return fib(n-1) + fib(n-2)
}

app.get('/fib/:n', (req, res, next) => {
    const n = Number(req.params.n)
    log(`Calculating fib(${n})...`)
    const value = String(fib(n))
    log(`Finished! fib(${n}) = ${value}.`)
    res.send(value)
})

app.get('/cached_fib/:n', async (req, res, next) => {
    const n = Number(req.params.n)
    log(`Looking up fib:${n} in the cache...`)
    let value = await getFromRedis(`fib:${n}`)
    if (!value) {
        log(`Not in cache. Calculating fib(${n})...`)
        value = String(fib(n))
        log(`Finished! fib(${n}) = ${value}, storing in cache...`)
        await setInRedisWithTTL(`fib:${n}`, SEVEN_SECONDS, value)
        log(`Stored fib(${n}) = ${value} in cache.`)
    } else {
        log(`got it! fib(${n}) = ${value}.`)
    }
    res.send(value)
})
app.listen(3000)
