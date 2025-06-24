client.on("interactionCreate", async interaction => {
  const distube = client.distube;

  // Slash komutları
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, distube);
    } catch (error) {
      console.error(error);
      if (!interaction.replied) {
        await interaction.reply({ content: "Komut çalıştırılamadı.", ephemeral: true });
      }
    }
  }

  // Select menu: filtre menüsü
  if (interaction.isStringSelectMenu() && interaction.customId === "select_filter") {
    const queue = distube.getQueue(interaction.guildId);
    if (!queue) {
      return interaction.reply({ content: "🎶 Şu anda müzik çalmıyor.", ephemeral: true });
    }

    const selected = interaction.values[0];

    if (selected === "off") {
      await distube.setFilter(interaction.guildId, false);
    } else {
      await distube.setFilter(interaction.guildId, selected);
    }

    const embed = new EmbedBuilder()
      .setColor(0x00BFFF)
      .setTitle("🎛️ Ses Efekti Güncellendi")
      .setDescription(`Uygulanan efekt: **${selected === "off" ? "Kapatıldı" : selected}**`)
      .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});
