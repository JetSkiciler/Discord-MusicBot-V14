const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Çalma listesini karıştır"),

  async execute(interaction, distube) {
    const voiceChannel = interaction.member.voice.channel;
    const queue = distube.getQueue(interaction.guildId);

    if (!voiceChannel || !queue || queue.songs.length < 2) {
      return interaction.reply({ content: "🎶 Karıştırılacak birden fazla şarkı yok.", ephemeral: true });
    }

    if (queue.voiceChannel.id !== voiceChannel.id) {
      return interaction.reply({ content: "🚫 Aynı ses kanalında olmalısın.", ephemeral: true });
    }

    queue.shuffle();

    const embed = new EmbedBuilder()
      .setColor(0xF39C12)
      .setTitle("🔀 Çalma Listesi Karıştırıldı")
      .setDescription("Şarkılar rastgele sıraya alındı.")
      .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  }
};
