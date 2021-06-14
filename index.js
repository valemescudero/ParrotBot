const Discord = require("discord.js");
const client = new Discord.Client();

const sing = require("./interactions/sing.js");
const giveMe = require("./interactions/giveMe.js");
const say = require("./interactions/say.js");
const miscellaneous = require("./interactions/miscellaneous.js");
const vote = require("./interactions/vote.js");
const musicPlayer = require("./musicPlayer.js");

let userBan = {
  culiaoactual: "",
};
let serverConn = {
  connection: {}
};

client.login(process.env.TOKEN);
client.on("ready", () => { console.log(`The parrot has spoken sailors.`) })

client.on("message", async msg => {
  if (msg.content.startsWith("$Callate loro de mierda")) {
    return;
  }

  if (msg.author.bot || !msg.content.startsWith("$")) return;

  client.on('guildMemberAdd', member => say.greetings(member))

  if (`<@!${msg.author.id}>` === userBan.culiaoactual) {
    msg.reply("A vos no te hago caso culiao");
    return;
  }

  switch (msg.content.split(" ")[0]) {
    case "$hey": say.quote(msg); break;
    case "$deployer": await sing.deployer(msg, serverConn); break;
    case "$fullstack": await sing.fullstack(msg, serverConn); break;
    case "$b": await sing.birdIsTheWord(msg, serverConn); break;
    case "$peron": await sing.marchaPeronista(msg, serverConn); break;
    case "$cat": giveMe.cats(msg); break;
    case "$noticia": giveMe.news(msg); break;
    case "$rucula":
    case "$rúcula": giveMe.dollarPrice(msg); break;
    case "$bitcoin": giveMe.BTCPrice(msg); break;
    case "$despertame": miscellaneous.despertameEn(msg);break;
    case "$vote": await vote.vote(msg); break;
    case "$tocate": await (new musicPlayer.MusicPlayer()).tocate(msg); break;
    case "$pasala": await (new musicPlayer.MusicPlayer()).pasala(msg); break;
    case "$cortala": await (new musicPlayer.MusicPlayer()).cortala(msg); break;
  }
  
  if (msg.content.startsWith("$Callate loro de mierda")) {
    sing.callate(msg, serverConn);
  };

  if (msg.content.startsWith("$A la tabla")) {
    miscellaneous.aLaTabla(userBan, msg);
    console.log(userBan)
  };

  if (msg.content.startsWith("$Volve") && msg.content.endsWith("no te fajamos mas")) {
    miscellaneous.traemeAlCuliao(userBan, msg);
  };
})
