const  { Client, Intents } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();


const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

function ready() {
  console.log(`login as ${bot.user.tag}`);
  
  setInterval (async function () {
    const Guilds = bot.guilds.cache.map(guild => guild.id);
    
    for (let guildid of Guilds)
    {
      const guild = bot.guilds.cache.get(guildid);
      const ChannelWantSend = guild.channels.cache.find(channel => channel.name === 'bot');
      const result = await fetch(
        process.env.URL + "/Offers/" + guild ,
      );
      const offerlist = await result.json();
      for (let offer of offerlist){
         const res = await  fetch(process.env.URL + "/Offers/update/" + guild, {
                                method: 'POST',
                                body: JSON.stringify(offer),
                                headers: { 'Content-Type': 'application/json' }
        }); 
        if (res != null){
          const offerupdated = await res.json;
          ChannelWantSend.send(`\n ${offer.name} \n Link: ${offer.link} \n R$ ${offer.lastprice}`,);
        }        
      } 
    }       
  },10000);  
}


bot.on("ready", ready);
bot.login(process.env.DISCORD_TOKEN);