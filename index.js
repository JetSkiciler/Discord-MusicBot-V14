const { Client, GatewayIntentBits, EmbedBuilder, Collection } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { SpotifyPlugin } = require("@distube/spotify");

const fs = require("node:fs");
const path = require("node:path");
const { token } = require("./config.json");



// Discord istemcisi
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Komutları yükle
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Komut etkileşimi
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client.distube);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({ content: "Komut çalıştırılamadı.", ephemeral: true });
    }
  }
});

// Bot hazır
client.once("ready", () => {
  console.log(`✅ Bot aktif: ${client.user.tag}`);
});

// DisTube kurulumu
client.distube = new DisTube(client, {
  searchSongs: 5,
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  plugins: [
    new YtDlpPlugin(),
    new SpotifyPlugin({ parallel: true, emitEventsAfterFetching: true })
  ]
});

// Müzik oynadığında istatistikleri güncelle
client.distube.on("playSong", async (queue, song) => {
  const userId = song.user?.id;
  if (userId) {
    await UserStats.findOneAndUpdate(
      { userId },
      {
        $inc: {
          totalTracksPlayed: 1,
          totalListeningTime: song.duration,
          [`favoriteTracks.${song.name}`]: 1,
          [`favoriteArtists.${song.uploader?.name || "Bilinmiyor"}`]: 1
        }
      },
      { upsert: true, new: true }
    );
  }

  const embed = new EmbedBuilder()
    .setColor(0x00AEFF)
    .setTitle("🎶 Şarkı Başladı")
    .setDescription(`[${song.name}](${song.url})`)
    .setThumbnail(song.thumbnail)
    .addFields(
      { name: "⏱️ Süre", value: song.formattedDuration, inline: true },
      { name: "🎤 Kanal", value: song.uploader?.name || "Bilinmiyor", inline: true },
      { name: "🎧 İsteyen", value: song.user?.username || "Bilinmiyor", inline: true }
    )
    .setFooter({ text: `📻 Kuyruk: ${queue.songs.length - 1} şarkı daha`, iconURL: song.user?.displayAvatarURL() });

  queue.textChannel.send({ embeds: [embed] }).catch(console.error);
});

// Kuyruk bitince 5 dakika sonra ayrıl
client.distube.on("finish", async queue => {
  const voiceChannel = queue.voiceChannel;
  const textChannel = queue.textChannel;
  const humanMembers = voiceChannel.members.filter(member => !member.user.bot);
  if (humanMembers.size > 0) return;

  textChannel?.send("💤 Müzik bitti ve kimse yok. 5 dakika içinde biri gelmezse ayrılıyorum.");
  setTimeout(() => {
    const stillEmpty = voiceChannel.members.filter(m => !m.user.bot).size === 0;
    if (stillEmpty) {
      queue.voice.leave();
      textChannel?.send("👋 Kimse gelmedi, ses kanalından ayrıldım.");
    }
  }, 5 * 60 * 1000);
});

client.login(token);
