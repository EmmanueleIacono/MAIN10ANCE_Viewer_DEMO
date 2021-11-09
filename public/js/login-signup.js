const aLogin = document.getElementById('login-a');
const aSignup = document.getElementById('signup-a');
const contenitoreSignup = document.getElementById('contenitoreSignup');
const contenitoreLogin = document.getElementById('contenitoreLogin');

aLogin.addEventListener('click', () => {
    contenitoreSignup.style.display = 'none';
    contenitoreLogin.style.display = 'block';
});

aSignup.addEventListener('click', () => {
    contenitoreLogin.style.display = 'none';
    contenitoreSignup.style.display = 'block';
});

// redirectSeLoggato();

$(() => {
    $('#formLogin').submit(async (ev) => {
        ev.preventDefault();
        const username = $('#userLogin').val();
        const pw = $('#pwLogin').val();
        const infoUser = {
            username,
            pw
        }
        try {
            const res = await login(infoUser);
            const resJson = await res.json();
            if (res.status !== 200) {
                mostraErrore(resJson.message);
            }
            else {
                nascondiErrore();
                localStorage.user_id = resJson.id;
                localStorage.bim_vw_sets = resJson.bim_vw_sets;
                localStorage.usr_vw = resJson.usr_vw;
                alert(resJson.message);
                location.reload();
            }
        }
        catch(e) {
            mostraErrore(e);
        }
    });
    $('#formSignup').submit(async (ev) => {
        ev.preventDefault();
        const username = $('#userSignup').val();
        const pw = $('#pwSignup').val();
        const infoUser = {
            username,
            pw
        }
        console.log('signup');
        console.log(infoUser);
        // try {
        //     const res = await signup(infoUser);
        //     const resJson = await res.json();
        //     if (res.status !== 200) {
        //         mostraErrore(resJson.message);
        //     }
        //     else {
        //         nascondiErrore();
        //         alert(resJson.message);
        //         window.location = `/login.html`;
        //     }
        // }
        // catch(e) {
        //     mostraErrore(e);
        // }
    });
});

function login(user) {
    return fetch("/auth/login", {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(user)});
}

function signup(user) {
    return fetch("/auth/signup", {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(user)});
}

async function logout() {
    const resRaw = await fetch("/auth/logout", {method: "GET", headers: {"content-type": "application/json"} });
    const res = await resRaw.json();
    localStorage.removeItem('user_id');
    localStorage.removeItem('bim_vw_sets');
    alert(res.message);
    location.reload();
}

function mostraErrore(errore) {
    console.log(errore);
    const h3Errore = $('#messaggio-errore');
    h3Errore.text(errore);
    h3Errore.show();
}

function nascondiErrore() {
    $('#messaggio-errore').hide();
}

function redirectSeLoggato() { // DA RISCRIVERE PER APP MAIN10ANCE
    if (localStorage.user_id) {
        window.location = `/utente.html`;
    }
}
