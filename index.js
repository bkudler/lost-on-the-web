const express = require('express');
const engine = require('express-handlebars');
const shuffle = require('./helpers/shuffle')
const app = express()
const Xray = require('x-ray');
const x = Xray()
const port = 3000


app.engine('handlebars', engine.engine());
app.set('view engine', 'handlebars');
app.set('views', './public');

const bodyParser = require('body-parser')
app.use(express.json());      
app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public/index.html'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    app.use(express.static('public'))
})



app.post('/search', (req, res) => {
    app.use(express.static('public'))
    const website = req.body.query;
    let final_links = [];
    x(website, {
        links:['a@href']
    })((err, result) => {
        let last_shuffled_links = [];
        for(let i = 0; i < 8; i++ ){
            let shuffled_links = shuffle.shuffle(result.links);
            let n = ((Math.random() + 1) * shuffled_links.length)/2;
            let first_n_links = shuffled_links.slice(0, n);
            final_links = final_links.concat(first_n_links);
            if(i/8 > Math.random()){
                final_links.push(last_shuffled_links[Math.random() * last_shuffled_links.length])
            }
            last_shuffled_links = shuffled_links;
        }
        final_links = final_links.filter((link) => link !== undefined)
        const no_links = (final_links.length === 0);
        res.render('search', {links: final_links, no_links: no_links});
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
