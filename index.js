'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const  axios = require ('axios');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
    
  }
   function ColetandoDados() {
  	return axios.get("https://sheet.best/api/sheets/4f484cc3-c568-47fc-b445-b5ddc18c997b");
}
  
    function coletaLocal(agent) {
    const cidade = agent.parameters.cidade;
    return ColetandoDados().then(res => {
      res.data.map(local => {
        if(local.cidade == cidade)
          agent.add(`${local.cidade} ${local.nome} ${local.endereco} ${local.telefone}`);
      });
  });
    }
  

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('4️⃣ Onde Comprar os produtos OhMy', coletaLocal);
  agent.handleRequest(intentMap);
});
