function main() {
    const path = require('path');
    const express = require('express');
    const cookieParser = require('cookie-parser');
    // const cors = require('cors');

    const PORT = process.env.PORT || 3000;
    const config = require('./config');
    if (config.credentials.client_id == null || config.credentials.client_secret == null) {
        console.error('Credenziali AUTODESK FORGE mancanti.');
        return;
    }
    const auth = require('./routes/auth/auth');
    const reqTurista = require('./routes/database/reqTurista');
    const reqUtenteLoggato = require('./routes/database/reqUtenteLoggato');
    const reqOperatore = require('./routes/database/reqOperatore');
    const reqGestore = require('./routes/database/reqGestore');
    const reqAmministratore = require('./routes/database/reqAmministratore');

    const {controllaLoggedIn, consentiAccesso, controllaRuoli} = require('./routes/auth/middleware');

    let app = express();
    // app.use(cors());
    app.use(cookieParser(process.env.COOKIE_SECRET));
    // per deploy
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('client/dist'));
    }
    // per localhost:3000, ma poi sarà eliminabile
    else {
        app.use(express.static(path.join(__dirname, 'public')));
    }
    app.use(express.json({ limit: '50mb' }));
    app.use('/api/forge/oauth', require('./routes/oauth'));
    app.use('/api/forge/oss', require('./routes/oss'));
    app.use('/auth', auth);
    app.use('/t', reqTurista);
    app.use('/l', controllaLoggedIn, consentiAccesso, reqUtenteLoggato);
    app.use('/o', controllaLoggedIn, controllaRuoli(process.env.LIVELLO_2), reqOperatore);
    app.use('/g', controllaLoggedIn, controllaRuoli(process.env.LIVELLO_3), reqGestore);
    app.use('/a', controllaLoggedIn, controllaRuoli(process.env.LIVELLO_4), reqAmministratore);
    // handler errori
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(err.statusCode).json(err);
    });

    app.listen(PORT, () => { console.log(`Server in ascolto sulla porta ${PORT}`); });
}

main();
