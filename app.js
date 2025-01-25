const express = require('express');
const path = require('path')
const app = express();
const PORT = 5500;

app.use(express.static('src'));
app.use('/css', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/css')))
app.use('/assets', express.static(path.join(__dirname, '/public')))
app.use('/scripts', express.static(path.join(__dirname, 'src/scripts')))
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')))
app.use('/select/css', express.static(path.join(__dirname, '/node_modules/choices.js/public/assets/styles')))
app.use('/select/js', express.static(path.join(__dirname, '/node_modules/choices.js/public/assets/scripts')))

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log('Listening port: ' + PORT);
});

app.get('/', (req, res) => {
    res.redirect('/login');
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/pages/login.html');
});

app.get('/registration', (req, res) => {
    res.sendFile(__dirname + '/src/pages/registration.html');
});

app.get('/patients', (req, res) => {
    res.sendFile(__dirname + '/src/pages/patients.html');
});

app.get('/patient/:id', (req, res) => {
    res.sendFile(__dirname + '/src/pages/patient-card.html');
});

app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/src/pages/profile.html');
});

app.get('/consultations', (req, res) => {
    res.sendFile(__dirname + '/src/pages/consultation.html');
});

app.get('/inspection/create', (req, res) => {
    res.sendFile(__dirname + '/src/pages/inspection-create.html');
});

app.get('/inspection/:id', (req, res) => {
    res.sendFile(__dirname + '/src/pages/inspection-page.html');
});

app.get('/not-found', (req, res) => {
    res.sendFile(__dirname + '/src/pages/not-found.html')
})

app.get('/reports', (req, res) => {
    res.sendFile(__dirname + '/src/pages/reports.html')
})

app.get('/error', (req, res) => {
    res.sendFile(__dirname + '/src/pages/server-error.html')
})

app.all('*',(req, res) => {
    res.status(404).sendFile(__dirname + '/src/pages/not-found.html')
})