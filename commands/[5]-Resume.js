const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Durdurulan müziği devam ettir"),

  async execute(interaction, distube) {
    const userVoiceChannel = interaction.member.voice.channel;

    if (!userVoiceChannel) {
      return interaction.reply({
        content: "🔊 Bu komutu kullanmak için bir ses kanalına katılmalısın.",
        ephemeral: true
      });
    }

    const queue = distube.getQueue(interaction.guildId);
    if (!queue) {
      return interaction.reply({
        content: "🎶 Şu anda çalan bir müzik yok.",
        ephemeral: true
      });
    }

    if (queue.voiceChannel.id !== userVoiceChannel.id) {
      return interaction.reply({
        content: "🚫 Bu komutu kullanmak için müziğin çaldığı ses kanalında olmalısın.",
        ephemeral: true
      });
    }

    if (!queue.paused) {
      return interaction.reply({
        content: "▶️ Müzik zaten oynatılıyor.",
        ephemeral: true
      });
    }

    queue.resume();

    const botUser = interaction.client.user;

    const embed = new EmbedBuilder()
      .setColor(0x00FF99) // yeşil ton
      .setTitle("▶️ Müzik Devam Ettirildi")
      .setDescription("Müzik kaldığı yerden çalmaya devam ediyor.")
      .setFooter({
        text: `${botUser.username} müzik sistemi`,
        iconURL: botUser.displayAvatarURL()
      });

    await interaction.reply({ embeds: [embed] });
  }
};
