// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'
// https://fdnd.directus.app/items/person
// Haal alle squads uit de WHOIS API op
const allstudents = 'https://fdnd.directus.app/items/person'
const klasDNaam='https://fdnd.directus.app/items/person/?filter={%22squad_id%22:3}&sort=name'


const squadData = await fetchJson(apiUrl + '/squad')
// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')
// app.set('index')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

// Maak een GET route voor de index
const messages = []
app.get('/', function (request, response) {
    // Haal alle personen uit de WHOIS API op
    fetchJson(allstudents).then((apiData) => {
        // apiData bevat gegevens van alle personen uit alle squads
        // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view
        // todo als er tijd is https://dev.to/yemiklein/how-to-implement-pagination-in-rest-api-5deg#:~:text=Implementing%20pagination%20in%20a%20REST,number%20of%20results%20per%20page. hier naar kijken dat je per pagina iets doet
        // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
        response.render('index',
            {persons: apiData.data,
                squads: squadData.data,

            })
        // console.log(squadData.data)
    })


})

// Maak een POST route voor de index
app.post('/', function (request, response) {
    // Er is nog geen afhandeling van POST, redirect naar GET op /
    console.log(messages)
    messages.push(request.body.bericht)
    response.redirect(303, '/')
})
// Squad pagina
// Haal alle personen uit de betreffende squad uit de WHOIS API op

app.get('/squad', function (request, response) {

    fetchJson(klasDNaam).then((apiData) => {/*haal de d klas op*/
        response.render('squad', {persons: apiData.data})
    })


})



// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
    // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
    fetchJson(`${apiUrl}/person/` + request.params.id).
    then((apiData) => {//de paramms id het studentennummer

        // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
        response.render('person',
            {person: apiData.data,
                squads: squadData.data
                ,
                messages: messages})
    })
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})
