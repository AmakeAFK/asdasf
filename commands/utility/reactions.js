
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { guildId, a, b, c, d } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactions')
    .setDescription('Creates a message with reactions that give roles')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    if (interaction.guildId !== guildId) {
      return interaction.reply({ content: 'This command can only be used in the designated server.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Selección de Clase')
      .setDescription('¡Reacciona para obtener tu rol de clase!')
      .addFields(
        { name: '🇦', value: '3ra', inline: true },
        { name: '🇧', value: '3rb', inline: true },
        { name: '🇨', value: '3rc', inline: true },
        { name: '🇩', value: '3rd', inline: true }
      )
      .setTimestamp();

    const message = await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '¡Mensaje de roles creado!', ephemeral: true });

    try {
      await message.react('🇦');
      await message.react('🇧');
      await message.react('🇨');
      await message.react('🇩');

      const roleMapping = {
        '🇦': a,
        '🇧': b,
        '🇨': c,
        '🇩': d
      };

      interaction.client.reactionRoles.set(message.id, roleMapping);
    } catch (error) {
      console.error('Failed to setup reaction roles:', error);
      await message.delete();
      await interaction.followUp({ content: '¡Error al configurar los roles!', ephemeral: true });
    }
  },
};
