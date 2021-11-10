(() => {
    if (localStorage.user_id) {
        loggedInDisplaySettings();
        set_bim_vw(localStorage.bim_vw_sets);
        set_usr_vw(localStorage.usr_vw);
    }
})();

function loggedInDisplaySettings() {
    $('#apriTabLogin').hide();
    $('#navbarLogout').show();
    $('#navbarLogout').on('click', logout);
    impostaUsernameNav();
}

function impostaUsernameNav() {
    $('#liUsernameNavbar').show();
    $('#liUsernameNavbar').text(localStorage.user_id);
}

function set_bim_vw(settingsString) {
    const viewerCol = settingsString.split('-')[0];
    const explorerCol = settingsString.split('-')[1];
    const bimVw = document.getElementById('pannello-main-bim');
    const bimExp = document.getElementById('pannello-db');
    const bimVwClsString = bimVw.className.replace(/col-sm-\d/g, `col-sm-${viewerCol}`);
    const bimExpClsString = bimExp.className.replace(/col-sm-\d/g, `col-sm-${explorerCol}`);
    bimVw.className = bimVwClsString;
    bimExp.className = bimExpClsString;
}

function set_usr_vw(settingsString) {
    const settingsList = settingsString.split(',');
    settingsList.forEach(sett => {
        $(`#${sett}`).show();
    });
}
