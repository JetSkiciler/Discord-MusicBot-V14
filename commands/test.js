const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ownerId } = require("../config.json");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("⏱️ Botun tepki süresi ve sistem hızını test eder"),

  async execute(interaction, distube) {
    if (interaction.user.id !== ownerId) {
      return interaction.reply({ content: "❌ Bu komutu sadece bot sahibi kullanabilir.", ephemeral: true });
    }

    const start = Date.now();
    const apiPing = interaction.client.ws.ping;

    await interaction.deferReply();

    const beforeQueue = Date.now();
    const queue = distube.getQueue(interaction.guildId);
    const afterQueue = Date.now();
    const processingMs = afterQueue - beforeQueue;

    const end = Date.now();
    const totalMs = end - start;

    const embed = new EmbedBuilder()
      .setTitle("🧪 Bot Performans Testi")
      .setColor(0x3498db)
      .addFields(
        { name: "📡 Discord API Ping", value: `${apiPing}ms`, inline: true },
        { name: "⚙️ İşlem Süresi", value: `${processingMs}ms`, inline: true },
        { name: "⏱️ Toplam Tepki Süresi", value: `${totalMs}ms`, inline: true }
      )
      .setFooter({ text: interaction.client.user.username });

    await interaction.editReply({ embeds: [embed] });
  }
};
