const express = require('express')
const session = require('express-session')
const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

const mustache = require('mustache-express')

app.use(express.urlencoded())
app.use(express.static('public'))

app.use(session({
    secret: 'KEY',
    saveUninitialized: true,
    resave: true
}))

app.engine('mustache', mustache())

app.set('views', './views')

app.set('view engine', 'mustache')

const savedAccounts = []
const currentChatrooms = []
let count = 0

function authenticateAccount(req, res, next) {
    if (req.session) {
        if (req.session.currentUser) {
            next()
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}

app.get('/', (req, res) => {
    res.redirect('/home-page')
})

app.get('/home-page', (req, res) => {
    if (req.session.currentUser) {
        res.render('home-page', { username: req.session.currentUser })
    } else {
        res.render('home-page')
    }

})

app.get('/trip-form', authenticateAccount, (req, res) => {
    res.render('new-trip-form')
})

app.post('/new-trip', authenticateAccount, (req, res) => {
    const currentAccount = savedAccounts.findIndex((account) => {
        return account.name == req.session.currentUser
    })
    const tripName = req.body.tripName
    const tripImage = req.body.tripImage
    const tripDeparture = req.body.tripDeparture
    const tripReturn = req.body.tripReturn
    let id = count

    savedAccounts[currentAccount].tripsSaved.push({ id: id, tripName: tripName, tripImage: tripImage, tripDeparture: tripDeparture, tripReturn: tripReturn })
    count++
    res.redirect('/home-page')
})

app.post('/delete-trip', authenticateAccount, (req, res) => {
    const currentAccount = savedAccounts.findIndex((account) => {
        return account.name == req.session.currentUser
    })
    const itemToDelete = req.body.id
    console.log(itemToDelete)

    for (let index = 0; index < savedAccounts[currentAccount].tripsSaved.length; index++) {
        const element = savedAccounts[currentAccount].tripsSaved[index];
        if (element.id == itemToDelete) {
            savedAccounts[currentAccount].tripsSaved.splice(index, 1)
        }

    }
    res.redirect('/trip-list')
})

app.get('/trip-list', authenticateAccount, (req, res) => {
    const currentAccount = savedAccounts.findIndex((account) => {
        return account.name == req.session.currentUser
    })

    res.render('trip-list-page', { trips: savedAccounts[currentAccount].tripsSaved })
})

app.get('/login', (req, res) => {
    if(req.session.currentUser == null)
    {
        req.session.currentUser = ""
    }
    res.render('log-in')
})

app.post('/login/register', (req, res) => {
    
    const username = req.body.name
    const password = req.body.password
    savedAccounts.push({ name: username, password: password, tripsSaved: [] })

    res.render('log-in', { success: `Account with username of ${username} has been created` })
})

app.post('/login', (req, res) => {
    const selectedName = savedAccounts.find((account) => {
        return account.name == req.body.name && account.password == req.body.password
    })
    if (selectedName) {
        if (req.session) {
            req.session.currentUser = selectedName.name
            console.log(selectedName)
            console.log(req.session.currentUser)
            res.redirect('/home-page')

        }

    } else {
        res.render('login', { error: 'Username or password entered is invalid' })
    }
})

app.post('/logout', (req, res) => {
    if(req.session) {
        req.session.currentUser = null
    }
    res.redirect('/home-page')
})


//Chat page
app.get('/chatroom', authenticateAccount, (req, res) => {
    res.sendFile(`${__dirname}/client-pages/comment-page.html`)
})

app.get('/chatroom/info', (req, res) => {
    res.json({username: req.session.currentUser, currentRooms: currentChatrooms})
})

io.on('connection', (socket) => {
    console.log('User is connected')
   
    socket.on('Main', (chat) => {
        console.log(chat)
        // server sends message to the client 
        io.emit('Main', chat)
    })
})

http.listen(2080, () => {

})