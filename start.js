const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Credenziali AUTODESK FORGE mancanti.');
    return;
}
const auth = require('./routes/auth/auth');
const reqTurista = require('./routes/database/reqTurista');
const reqUtenteLoggato = require('./routes/database/reqUtenteLoggato');
const reqManutentore = require('./routes/database/reqManutentore');
const reqGestore = require('./routes/database/reqGestore');

const {controllaLoggedIn, consentiAccesso, controllaRuoli} = require('./routes/auth/middleware');

let app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/auth', auth);
app.use('/', reqTurista);
app.use('/', reqUtenteLoggato);
app.use('/', reqManutentore);
app.use('/', reqGestore);
// app.use('/',/* controllaLoggedIn, */require('./routes/database/serverBIM-GIS'));
// app.use('/', require('./routes/database/DBServizio').appServizio);
// handler errori
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
    // LA PARTE SOTTO ARRIVA DAL TUTORIAL, NON SO SE USARLA -> ALTERNATIVA A RIGA SOPRA, CHE INVECE ARRIVA DA TUTORIAL FORGE
    // res.status(err.statusCode || res.statusCode || 500);
    // res.json({
    //         message: err.message,
    //     });
});
app.listen(PORT, () => { console.log(`Server in ascolto sulla porta ${PORT}`); });
