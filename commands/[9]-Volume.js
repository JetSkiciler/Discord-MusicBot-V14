const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Ses seviyesini ayarla (0-200)")
    .addIntegerOption(option =>
      option.setName("seviye")
        .setDescription("Yeni ses seviyesi (0-200)")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(200)
    ),

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

    const volume = interaction.options.getInteger("seviye");
    queue.setVolume(volume);

    // Ana mesaj
    await interaction.reply(`🔊 Ses seviyesi **${volume}%** olarak ayarlandı.`);

    // Eğer 100'den büyükse embed uyarısı gönder
    if (volume > 100) {
      const botUser = interaction.client.user;

      const warningEmbed = new EmbedBuilder()
        .setColor(0xFFA500) // turuncu
        .setTitle("⚠️ Yüksek Ses Seviyesi Uyarısı")
        .setDescription("100'ün üzerindeki ses seviyeleri **bozulma**, **cızırtı** veya **rahatsız edici** ses sorunlarına neden olabilir.\n\nLütfen dikkatli kullanın.")
        .setFooter({
          text: "Tavsiye edilen maksimum seviye: %100",
          iconURL: botUser.displayAvatarURL()
        });

      await interaction.followUp({ embeds: [warningEmbed], ephemeral: true });
    }
  }
};
