
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear a specified number of messages')
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Number of messages to clear')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    
    try {
      await interaction.channel.bulkDelete(amount);
      await interaction.reply({
        content: `✅ Se han eliminado ${amount} mensajes.`,
        ephemeral: true
      });
    } catch (error) {
      await interaction.reply({
        content: '❌ ¡Hubo un error al intentar eliminar los mensajes!',
        ephemeral: true
      });
    }
  },
};
