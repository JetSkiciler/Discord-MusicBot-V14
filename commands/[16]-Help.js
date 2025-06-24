const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Tüm komutları ve açıklamalarını listeler"),

  async execute(interaction) {
    const commandsPath = path.join(__dirname); // `commands/` klasörü
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    const fields = [];

    for (const file of commandFiles) {
      // Yardım komutunun kendisini dahil etme
      if (file === "help.js") continue;

      const command = require(path.join(commandsPath, file));
      if (!command.data?.name || !command.data?.description) continue;

      fields.push({
        name: `/${command.data.name}`,
        value: command.data.description || "Açıklama yok.",
        inline: false
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("📖 Komut Listesi")
      .setDescription("Mevcut tüm komutlar aşağıda listelenmiştir.")
      .addFields(fields)
      .setColor(0x5865F2)
      .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
