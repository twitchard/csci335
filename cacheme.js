const app = require('express')()

app.listen(3000, err => {
    if (err) throw err
    console.log('Listening on port 3000')
})

let n = 0

const chemistryTypes = {
    bio: "Biochemistry",
    inorganic: "Inorganic Chemistry",
    organic: "Organic Chemistry",
    'organic-etc': "Organic, Cage-Free, No Pesticides Chemistry",
    'alchemy': "Alchemy",
}

app.get('/', (req, res, next) => {
    res.send(`
    <h1>ChemTutor: Richard Edition</h1>
    <h3>Which chemistry would you like today?</h3>
    ` +
    Object.keys(chemistryTypes).map(c =>
        `<a href="/chemistry/${c}">${chemistryTypes[c]}</a>`
    ).join('<br/>\n'))
})

app.get('/chemistry/:chem', (req, res, next) => {
    console.log(req.params)
    setTimeout(()=> res.send(
    `Enjoy your ${chemistryTypes[req.params.chem]}!!</br><a href="../">back</a>`
    ), 7000)
    const start = Date.now()
    // Block for 2 seconds
    while (Date.now() < start + 2000) {}
})
