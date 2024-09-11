const ambito = process.env.AMBITO;

////////////////////////// DA OTTIMIZZARE, AMBITO PRESO DA DB NON DA ENV //////////////////////////
// console.log(ambito);

// async function getSchemaAmbitoByUser() {
//   const res = await fetch('https://jsonplaceholder.typicode.com/users');
//   const resJson = await res.json();
//   return resJson;
// }

// const ambitoNew = async () => await getSchemaAmbitoByUser();
// console.log(ambitoNew);

module.exports = {ambito};
