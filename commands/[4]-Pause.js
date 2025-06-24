const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Çalan müziği duraklat"),

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

    if (queue.paused) {
      return interaction.reply({
        content: "⏸️ Müzik zaten duraklatılmış.",
        ephemeral: true
      });
    }

    queue.pause();

    const botUser = interaction.client.user;

    const embed = new EmbedBuilder()
      .setColor(0xFFD700) // sarı ton
      .setTitle("⏸️ Müzik Duraklatıldı")
      .setDescription("Müzik geçici olarak durduruldu. Devam ettirmek için `/resume` komutunu kullan.")
      .setFooter({
        text: `${botUser.username} müzik sistemi`,
        iconURL: botUser.displayAvatarURL()
      });

    await interaction.reply({ embeds: [embed] });
  }
};
