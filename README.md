
## MAIN10ANCE_Viewer_DEMO

Repository for the Main10ance project web-app   

### APP DEMO
First demo version of the app.  
Branch: **master**  
Deployed at: <https://main10ance-app-demo.onrender.com/>  

## TO DO:
- [ ] Togliere possibilità di lasciare campo vuoto su categoria in registrazione schede "attività precedenti" --> ma aggiungere campo "altro"

DA 14/06/2024:
- [ ] Nuova entità per elementi sia decorativi che strutturali, non ricadenti in "apparato_decorativo"
- [ ] Ragionare su degli "aggregatori" che permettano di considerare degli insiemi di elementi anche appartenenti a entità diverse

DA 22/05/2024:
- [ ] Creare nuovo ambito "bormidagotica" con stessa funzionalità di "patrimonio_diffuso"
    - [x] Creare nuovo ambito "bormidagotica" duplicando "sacrimonti"
    - [x] Creare nuovo utente gestore associato ad ambito "bormidagotica" per prove
    - [ ] Creare funzionalità simile a "patrimonio_diffuso", con possibilità gestore di aggiungere marker a quell'ambito

ALTRO:
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