
## MAIN10ANCE_Viewer_DEMO

Repository for the Main10ance project web-app   

### APP DEMO
First demo version of the app.  
Branch: **master**  
Deployed at: <https://main10ance-app-demo.onrender.com/>  

## TO DO:
- [x] Rimuovere viewer modelli su Planner
- [ ] Togliere possibilità di lasciare campo vuoto su categoria in registrazione schede "attività precedenti" --> ma aggiungere campo "altro"

DA 14/06/2024:
- [x] Nuove entità da appunti Esteban
- [ ] Nuova entità per elementi sia decorativi che strutturali, non ricadenti in "apparato_decorativo"
- [ ] Ragionare su degli "aggregatori" che permettano di considerare degli insiemi di elementi anche appartenenti a entità diverse
- [x] Tirare fuori tabelle "glossario" e "frase_di_rischio" da ambito sacrimonti e mettere in uno schema comune (es. "servizio"), e permettere di associare a ciascuna frase di rischio uno o più ambiti specifici
- [x] aggiungere tre nuove colonne a tabella "frase_di_rischio" per indicare ambiti, entità e aggregatori (uno o più ambiti, entità e aggregatori)

DA 22/05/2024:
- [ ] Creare nuovo ambito "bormidagotica" con stessa funzionalità di "patrimonio_diffuso"
    - [x] Creare nuovo ambito "bormidagotica" duplicando "sacrimonti"
    - [x] Creare nuovo utente gestore associato ad ambito "bormidagotica" per prove
    - [ ] Creare funzionalità simile a "patrimonio_diffuso", con possibilità gestore di aggiungere marker a quell'ambito
- [x] Verificare dicitura "Edificio 0" per Portico Via Crucis Ghiffa

DA 08/05/2024:
- [ ] Creare filtri per programmazione, esecuzione e storico:
    - [ ] Ricerca per classi oggetti, edificio, e SE POSSIBILE frasi di rischio
- [ ] Fare in modo che alcune parole "chiave" compaiano in grassetto su tabella frasi di rischio in pianificazione

DA 24/04/2024:
- [x] Cambiare ordine e logica schede controllo (prima st_cons, sempre compilabile, poi cl_racc, poi liv_urg)
    - [x] st_cons sempre compilabile
    - [x] se st_cons = cc0 --> "sbloccati" cr0 e cr1, e NASCONDO campo liv_urg
    - [x] se st_cons = cc1 --> "sbloccati" cr0, cr1, cr2, e mostro tutti i liv_urg
    - [x] se st_cons = cc2 o cc3 --> "sbloccati" solo cr2 e cr3, e mostro tutti i liv_urg
    - [x] applicare questo filtro sia su attività precedenti sia su attività di controllo
- [x] Modificare ordine in cui compaiono campi su Planner -> Esecuzione (tutti i tipi di schede)
    - [x] Dall'alto: Località, Edificio, Classe oggetti, Tipo di attività, Strumentazione, Costo, Ore [RINOMINARE IN "Durata"?]...
    - [x] Al fondo: Note, Documenti, Operatore, Data programmazione, Data esecuzione/int.

ALTRO:
- [ ] Add un tab per permettere di scaricare documenti utili a utenti ---> NO, ASPETTARE
- [ ] Add "schede conoscenza" su Planner con questioni/domande aperte e chiuse
- [ ] Possibilità di documentare avanzamento degrado e "stratificazione" del fenomeno nel tempo tramite foto
    - [ ] Data e condizioni atmosferiche per ogni caricamento
    - [ ] Caricamento in fase di controllo, in base a una frase di rischio specifico
    - [ ] Caricamento immagine associato alla scheda di controllo che registro
- [ ] Verificare corretto funzionamento programmazione ex-tempore
    - [ ] Aggiungere possibilità di selezione frase di rischio
    - [ ] Possibilità di selezionare più frasi di rischio per controllo straordinario
    - [ ] Necessità di specificare "causa" del controllo straordinario (es. evento meteorologico straordinario)
    - [ ] Necessità di avere un elenco di possibili "cause"

- [ ] Controllo straordinario con menu a tendina per selezione evento straordinario (voce "A seguito di:")
    - [ ] Evento metereologico straordinario (potrebbe IN FUTURO generarsi da sè)
    - [ ] Sopralluogo o visita
    - [ ] Segnalazione (unico caso in cui la scheda "controllo straordinario" si genera da sè)
    - [ ] Altro