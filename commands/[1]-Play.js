const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Bir şarkı çal")
    .addStringOption(option =>
      option.setName("query").setDescription("Şarkı adı veya bağlantısı").setRequired(true)
    ),

  async execute(interaction, distube) {
    const query = interaction.options.getString("query");
    const userVoiceChannel = interaction.member.voice.channel;

    if (!userVoiceChannel) {
      return interaction.reply({
        content: "🔊 Bir ses kanalına katılmalısın!",
        ephemeral: true
      });
    }

    const queue = distube.getQueue(interaction.guildId);

    // Eğer sırada şarkı varsa ve farklı bir kanalda çalıyorsa
    if (queue && queue.voiceChannel.id !== userVoiceChannel.id) {
      return interaction.reply({
        content: `⚠️ Şu anda başka bir ses kanalında müzik çalıyor. Lütfen aynı kanala katıl.`,
        ephemeral: true
      });
    }

    await interaction.reply(`🎵 Aranıyor: \`${query}\``);
    distube.play(userVoiceChannel, query, {
      textChannel: interaction.channel,
      member: interaction.member
    });
  }
};
