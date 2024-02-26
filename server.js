// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Haal alle squads uit de WHOIS API op
const squadData = await fetchJson('https://fdnd.directus.app/items/squad')
const everyone = await fetchJson('https://fdnd.directus.app/items/person/')
const klasDNaam='https://fdnd.directus.app/items/person/?filter={%22squad_id%22:3}&sort=name'
// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

// Maak een GET route voor de index
app.get('/', async function (request, response) {
    // Haal alle personen uit de WHOIS API op
    let filteredDataSquadD = everyone.data.filter(person => person.squad_id === 3);/*klas D*/
    let filteredDataSquadF = everyone.data.filter(person => person.squad_id === 5);/*klas f*/
    let filteredDataSquadE = everyone.data.filter(person => person.squad_id === 4);
    let everything = everyone.data;


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

// Maak een POST route voor de index
app.post('/', function (request, response) {
    // Er is nog geen afhandeling van POST, redirect naar GET op /
    messages.push(request.body.bericht)
    // gebruik maken van person variable omdat er anders weer undefined staat
    const person = everyone.data;
    response.redirect('/person/' + person.id);


})

// Maak een GET route voor een detailpagina met een request parameter id

const messages = []
app.get('/person/:id', function (request, response) {
    fetchJson('https://fdnd.directus.app/items/person/' + request.params.id)
        .then((apiData) => {

            if (apiData.data) {
                let info = apiData.data;
                response.render('person', {info: info, squads: squadData.data, messages: messages});


            } else {
                // console.log('No data found for person with id: ' + request.params.id);
            }
        })
        .catch((error) => {
            // console.error('Error fetching person data:', error);
        });
});
app.get("/zoeken", async (req, res) => {
    //     // data.data.custom = JSON.parse(data.data.custom);
    // in de request is de url /zoeken?id ingegeven nummer
    try{
        const userQuery = await req.query; /*dit is het id wat de gebruiker ingeeft bij het zoekvak*/

        const filteredStudent = await everyone.data.filter((informationStudent)=>{ /*dit is een array met daarin de filter waarin de gegevens van een specifieke student staan*/


            let isValid = true;
            for( let key in userQuery) {
                console.log(`dit is de key :${key}`)/*ook wel het id*/
                console.log(`dit is de userquery dus de invoer ${JSON.stringify(userQuery)}`)/*het id nummer user id*/
                console.log(`dit is de info dus de opgehaalde informatie van die persoon ${JSON.stringify(informationStudent)}`)
                isValid = isValid && informationStudent[key] == userQuery[key];/*is de ingegeveninformatie juist*/
                //     gebruik maken van == instead of === omdat dit false is https://www.freecodecamp.org/news/loose-vs-strict-equality-in-javascript/
            }
            return isValid;
        });
        // res.json({data: filteredStudent})
        // res.render('index', );

        let filteredDataSquadD = everyone.data.filter(person => person.squad_id === 3);/*klas D*/
        let filteredDataSquadF = everyone.data.filter(person => person.squad_id === 5);/*klas f*/
        let filteredDataSquadE = everyone.data.filter(person => person.squad_id === 4);
        let everything = everyone.data;

        res.render('zoeken',{datastudent: filteredStudent,
            dataD: filteredDataSquadD,
            dataf: filteredDataSquadF,
            dataE: filteredDataSquadE,
            squads: squadData.data,
            data:everything});
        // https://dev.to/callmefarad/simple-query-search-in-node-express-api-4c0e
        // res.redirect('/student');
    }catch(err){
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