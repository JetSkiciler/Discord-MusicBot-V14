const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function createProgressBar(current, total, size = 20) {
  const percentage = current / total;
  const progress = Math.round(size * percentage);
  const bar = "▬".repeat(progress) + "🔘" + "▬".repeat(size - progress);
  return bar;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Şu anda çalan şarkıyı göster"),

  async execute(interaction, distube) {
    const userVoiceChannel = interaction.member.voice.channel;

    if (!userVoiceChannel) {
      return interaction.reply({
        content: "🔊 Bu komutu kullanmak için bir ses kanalına katılmalısın.",
        ephemeral: true
      });
    }

    const queue = distube.getQueue(interaction.guildId);
    if (!queue || !queue.songs.length) {
      return interaction.reply({
        content: "🎶 Şu anda çalan bir şarkı yok.",
        ephemeral: true
      });
    }

    if (queue.voiceChannel.id !== userVoiceChannel.id) {
      return interaction.reply({
        content: "🚫 Bu komutu kullanmak için müziğin çaldığı ses kanalında olmalısın.",
        ephemeral: true
      });
    }

    const song = queue.songs[0];
    const botUser = interaction.client.user;

    const currentTime = queue.currentTime; // saniye
    const totalTime = song.duration; // saniye
    const progressBar = createProgressBar(currentTime, totalTime);

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle("🎧 Şu Anda Çalan")
      .setDescription(`[${song.name}](${song.url})`)
      .addFields(
        { name: "⏱️ Süre", value: `${queue.formattedCurrentTime} / ${song.formattedDuration}`, inline: true },
        { name: "🎶 İlerleme", value: progressBar, inline: false },
        { name: "🎤 Yükleyen", value: song.uploader.name || "Bilinmiyor", inline: true }
      )
      .setThumbnail(song.thumbnail)
      .setFooter({
        text: `${botUser.username} Müzik`,
        iconURL: botUser.displayAvatarURL()
      });

    await interaction.reply({ embeds: [embed] });
  }
};
