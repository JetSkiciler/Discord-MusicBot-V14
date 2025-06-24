const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Şarkının belli bir saniyesine atla")
    .addIntegerOption(option =>
      option.setName("saniye")
        .setDescription("Gitmek istediğin süre (saniye)")
        .setRequired(true)
        .setMinValue(0)
    ),

  async execute(interaction, distube) {
    const voiceChannel = interaction.member.voice.channel;
    const queue = distube.getQueue(interaction.guildId);

    if (!voiceChannel || !queue || !queue.songs.length) {
      return interaction.reply({ content: "🎶 Şu anda çalan bir şarkı yok.", ephemeral: true });
    }

    if (queue.voiceChannel.id !== voiceChannel.id) {
      return interaction.reply({ content: "🚫 Müzik başka bir kanalda çalıyor.", ephemeral: true });
    }

    const seekTime = interaction.options.getInteger("saniye");

    if (seekTime > queue.songs[0].duration) {
      return interaction.reply({ content: "❌ Girdiğin süre şarkının süresini aşıyor.", ephemeral: true });
    }

    queue.seek(seekTime);

    const embed = new EmbedBuilder()
      .setColor(0x2ECC71)
      .setTitle("⏩ İleri Sarıldı")
      .setDescription(`Şarkı **${seekTime} saniye** ileri alındı.`)
      .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  }
};
