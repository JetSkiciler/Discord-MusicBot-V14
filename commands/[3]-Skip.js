const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Sonraki şarkıya geç"),

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
        content: "🎶 Şu anda çalan bir şarkı yok.",
        ephemeral: true
      });
    }

    // Kullanıcının kanalı, şarkının çaldığı kanalla aynı mı?
    if (queue.voiceChannel.id !== userVoiceChannel.id) {
      return interaction.reply({
        content: "🚫 Bu komutu kullanmak için şarkının çaldığı ses kanalında olmalısın.",
        ephemeral: true
      });
    }

    await queue.skip();
    await interaction.reply("⏭️ Sonraki şarkıya geçildi.");
  }
};
