const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Müziği durdurur"),

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
        content: "🚫 Müzik başka bir ses kanalında çalıyor. Bu komutu kullanmak için o kanalda olmalısın.",
        ephemeral: true
      });
    }

    queue.stop();
    await interaction.reply("⏹️ Müzik durduruldu.");
  }
};
