// Importeer het npm pakket express uit de node_modules map
import express, {json} from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Haal alle squads uit de WHOIS API op
const squadData = await fetchJson('https://fdnd.directus.app/items/squad')
const everyone = await fetchJson('https://fdnd.directus.app/items/person/')
const klasDNaam = 'https://fdnd.directus.app/items/person/?filter={%22squad_id%22:3}&sort=name'
const messages = []
let filteredDataSquadD = everyone.data.filter(person => person.squad_id === 3);/*klas D*/
let filteredDataSquadF = everyone.data.filter(person => person.squad_id === 5);/*klas f*/
let filteredDataSquadE = everyone.data.filter(person => person.squad_id === 4);
let everything = everyone.data;
// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));

// Maak een GET route voor de index
app.get('/', async function (request, response) {
    // Haal alle personen uit de WHOIS API op
    try {
        const userQuery = await request.query;
        const filteredStudent = await everyone.data.filter((info) => {

            let isValid = true;
            for (let key in userQuery) {
                // console.log(`dit is de key ${key}`)
                // console.log(`dit is de userquery dus de invoer ${JSON.stringify(userQuery)}`)
                // console.log(`dit is de info dus de invoer ${JSON.stringify(info)}`)
                isValid = isValid && info[key] == userQuery[key];
                //     gebruik maken van == instead of === omdat dit false is https://www.freecodecamp.org/news/loose-vs-strict-equality-in-javascript/
            }
            return isValid;
        });
        // res.json({data: filteredStudent})
        // res.render('index', );
        response.render('index', {
            datastudent: filteredStudent, dataD: filteredDataSquadD,
            dataf: filteredDataSquadF, dataE: filteredDataSquadE,
            squads: squadData.data, data: everything,
            persons: everyone.data
        });
        // https://dev.to/callmefarad/simple-query-search-in-node-express-api-4c0e
        // res.redirect('/student');
    } catch (err) {
        response.send(err.message)
    }
})

// Maak een POST route voor person
app.post('/', function (request, response) {
    // Er is nog geen afhandeling van POST, redirect naar GET op /
    messages.push(request.body.bericht)
    // gebruik maken van person variable omdat er anders weer undefined staat
    const person = everyone.data;
    response.redirect('/person/' + person.id);


})

// Maak een GET route voor een detailpagina met een request parameter id


app.get('/person/:id', function (request, response) {
    fetchJson('https://fdnd.directus.app/items/person/' + request.params.id)
        .then((apiData) => {

            if (apiData.data) {

                try {
                    apiData.data.custom = JSON.parse(apiData.data.custom)
                } catch (e) {
                    console.log(e)
                }
                let info = apiData.data;
                response.render('person', {person: info, squads: squadData.data, messages: messages});


            } else {
                // console.log('No data found for person with id: ' + request.params.id);
            }
        })
        .catch((error) => {
            console.error('Error fetching person data:', error);
        });
});


app.post('/person/:id/', function (request, response) {
    // Stap 1: Haal de huidige data op, zodat we altijd up-to-date zijn, en niks weggooien van anderen
    // Haal eerst de huidige gegevens voor deze persoon op, uit de WHOIS API
    fetchJson('https://fdnd.directus.app/items/person/' + request.params.id)
        .then((apiData) => {

            // Het custom field is een String, dus die moeten we eerst
            // omzetten (= parsen) naar een Object, zodat we er mee kunnen werken
            try {
                apiData.data.custom = JSON.parse(apiData.data.custom)
            } catch (e) {
                apiData.data.custom = {}
            }


            // Stap 2: Gebruik de data uit het formulier
            // Deze stap zal voor iedereen net even anders zijn, afhankelijk van de functionaliteit

            // Controleer eerst welke actie is uitgevoerd, aan de hand van de submit button
            // Dit kan ook op andere manieren, of in een andere POST route
            if (request.body.actie == 'verstuur') {

                // Als het custom object nog geen messages Array als eigenschap heeft, voeg deze dan toe
                if (!apiData.data.custom.messages) {
                    apiData.data.custom.messages = []
                }

                // Voeg een nieuwe message toe voor deze persoon, aan de hand van het bericht uit het formulier
                apiData.data.custom.messages.push(request.body.message)

            }
            else if (request.body.actie == 'vind-ik-leuk') {
                apiData.data.custom.like = true
                console.log('er is geklikt op vind ik leuk'+ apiData.data.custom.like);
            }

            else if (request.body.actie == 'vind-ik-niet-leuk') {

                apiData.data.custom.like = false
                console.log('er is een 2de klik op vind ik leuk'+ apiData.data.custom.like);

            }

            fetchJson('https://fdnd.directus.app/items/person/' + request.params.id, {
                method: 'PATCH',
                body: JSON.stringify({
                    custom: apiData.data.custom
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }).then((patchresponse) => {
                console.log(patchresponse);
                response.redirect(303, '/person/' + request.params.id)
            })


        })
})


app.get("/zoeken", async (req, res) => {
    //     // data.data.custom = JSON.parse(data.data.custom);
    // in de request is de url /zoeken?id ingegeven nummer
    try {
        const userQuery = await req.query; /*dit is het id wat de gebruiker ingeeft bij het zoekvak*/

        const filteredStudent = await everyone.data.filter((informationStudent) => { /*dit is een array met daarin de filter waarin de gegevens van een specifieke student staan*/


            let isValid = true;
            for (let key in userQuery) {
                console.log(`dit is de key :${key}`)/*ook wel het id*/
                console.log(`dit is de userquery dus de invoer ${JSON.stringify(userQuery)}`)/*het id nummer user id*/
                console.log(`dit is de info dus de opgehaalde informatie van die persoon ${JSON.stringify(informationStudent)}`)
                isValid = isValid && informationStudent[key] == userQuery[key];/*is de ingegeveninformatie juist*/
                //     gebruik maken van == instead of === omdat dit false is
                //     https://www.freecodecamp.org/news/loose-vs-strict-equality-in-javascript/
            }
            return isValid;
        });
        // res.json({data: filteredStudent})
        // res.render('index', );

        res.render('zoeken', {
            datastudent: filteredStudent,
            dataD: filteredDataSquadD,
            dataf: filteredDataSquadF,
            dataE: filteredDataSquadE,
            squads: squadData.data,
            data: everything
        });
        // https://dev.to/callmefarad/simple-query-search-in-node-express-api-4c0e
        // res.redirect('/student');
    } catch (err) {
        res.send(err.message)
    }
});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})