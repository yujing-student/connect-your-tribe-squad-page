// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'
// https://fdnd.directus.app/items/person
// Haal alle squads uit de WHOIS API op

const squadData = await fetchJson(apiUrl + '/squad')
// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', 'views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Maak een GET route voor de index
app.get('/', function (request, response) {
    // Haal alle personen uit de WHOIS API op
    try {/*als de fetch niet lukt om een reden vang de error op en laat het zien zodat een error display word */
        fetchJson(apiUrl + '/person').then((apiData) => {
            // apiData bevat gegevens van alle personen uit alle squads
            // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view
            // todo https://dev.to/yemiklein/how-to-implement-pagination-in-rest-api-5deg#:~:text=Implementing%20pagination%20in%20a%20REST,number%20of%20results%20per%20page. hier naar kijken dat je per pagina iets doet
            // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
            response.render('index', {persons: apiData.data, squads: squadData.data})
            // console.log(squadData.data)
        })
    } catch (error) {
        console.log(error)
    }

})
// Squad pagina
// Haal alle personen uit de betreffende squad uit de WHOIS API op

app.get('/squad', function (request, response) {

    fetchJson('https://fdnd.directus.app/items/person/').then((apiData) => {
        response.render('squad', {persons: apiData.data})
    })

})

// Maak een POST route voor de index
app.post('/', function (request, response) {
    // Er is nog geen afhandeling van POST, redirect naar GET op /
    response.redirect(303, '/')
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
    // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
    fetchJson(apiUrl + '/person/' + request.params.id).then((apiData) => {
        // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
        response.render('person', {person: apiData.data, squads: squadData.data})
    })
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})
