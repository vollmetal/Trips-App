const express = require('express')
const app = express()

const mustache = require('mustache-express')

app.use(express.urlencoded())
app.use(express.static('css'))

app.engine('mustache', mustache())

app.set('views', './views')

app.set('view engine', 'mustache')

const tripsSaved = []
let count = 0

app.get('/', (req, res) => {
    res.redirect('/trip-from')
})

app.get('/home-page', (req, res) => {
    res.render('home-page', req.body.message)    
})

app.get('/trip-from', (req, res) => {
    res.render('new-trip-form')
})

app.post('/new-trip', (req, res) => {
    const tripName = req.body.tripName
    const tripImage = req.body.tripImage
    const tripDeparture = req.body.tripDeparture
    const tripReturn = req.body.tripReturn
    let id = count

    tripsSaved.push({id: id, tripName: tripName, tripImage: tripImage, tripDeparture: tripDeparture, tripReturn: tripReturn})
    count++
    res.redirect('/home-page')
})

app.post('/delete-trip', (req, res) => {
    const itemToDelete = req.body.id
    console.log(itemToDelete)
    
    for (let index = 0; index < tripsSaved.length; index++) {
        const element = tripsSaved[index];
        if(element.id == itemToDelete)
        {
            tripsSaved.splice(index, 1)
        }
        
    }
    res.redirect('/trip-list')
})

app.get('/trip-list', (req, res) => {
    
    res.render('trip-list-page', {trips: tripsSaved})
})

app.listen(2080, () => {

})