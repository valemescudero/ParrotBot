const ytdl = require('ytdl-core');

class MusicPlayer {

  constructor() {
    this.queue = new Map();
    if (MusicPlayer._instance) return MusicPlayer._instance;

    MusicPlayer._instance = this;
    return this;
  }

  async tocate(msg) {
    const args = msg.content.split(" ");

    const voiceChannel = msg.member.voice.channel;

    const songInfo = await ytdl.getInfo(args[1]);

    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    // obtengo la queue del server
    this.serverQueue = this.queue.get(msg.guild.id);

    if (!this.serverQueue) {
      const queueContruct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };

      // Asocio server de discord con queue
      this.queue.set(msg.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        let connection = await voiceChannel.join();
        queueContruct.connection = connection;
        this.play(msg.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(msg.guild.id);
        return msg.channel.send(err);
      }
    } else {
      this.serverQueue.songs.push(song);
      return msg.channel.send(`${song.title} la toco en un rato!`);
    }
  }

  async pasala(msg) {
    if (!this.serverQueue)
      return msg.channel.send("No hay canciones gato!");
    this.serverQueue.connection.dispatcher.end();
  }

  async play(guild, song) {
    this.serverQueue = this.queue.get(guild.id);
    if (!song) {
      this.serverQueue.voiceChannel.leave();
      this.queue.delete(guild.id);
      return;
    }

    const dispatcher = this.serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        this.serverQueue.songs.shift();
        this.play(guild, this.serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(this.serverQueue.volume / 5);
    this.serverQueue.textChannel.send(`Ahora suena: ${song.title}`);
  }

  async cortala(msg) {
    if (!this.serverQueue)
      return msg.channel.send("No hay canciones gato!");
      
    this.serverQueue.songs = [];
    this.serverQueue.connection.dispatcher.end();
  }
}

module.exports = {
  MusicPlayer
};