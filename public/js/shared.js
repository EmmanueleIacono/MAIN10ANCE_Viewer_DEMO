"use strict";
// FUNZIONI UTILI E/O CONDIVISE TRA PIU' FILE JS

// GENERAZIONE DI PALETTE DI COLORI

function creaColori(nColori, hueStart, hueEnd, sat, lum) {
    const listaHue = intervalliHue(nColori, hueStart, hueEnd);
    const listaHex = listaHue.map((hue) => (hslToHex(hue, sat, lum)));
    return listaHex;
}

function intervalliHue(intervalli, hueMin, hueMax) {
    let intList = [];
    const distanza = (hueMax-hueMin)/(intervalli-1);
    for (let i = hueMin; i<=hueMax; i+=distanza) {
        const numeroInt = Math.round(i);
        intList.push(numeroInt);
    }
    return intList;
}

function hslToHex(h, s, l) { // copiata: non sono sicuro di COME funzioni, ma funziona
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// GENERAZIONE DI UN NUMERO RANDOM TRA DUE ESTREMI

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
