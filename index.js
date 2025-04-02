const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const token = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.commands = new Collection();
client.reactionRoles = new Map();

client.once(Events.ClientReady, (readyClient) => {
  console.log(`¡Listo! Logeado como ${readyClient.user.tag}`);
});

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  const roleMapping = client.reactionRoles.get(reaction.message.id);
  if (!roleMapping) return;

  const roleId = roleMapping[reaction.emoji.name];
  if (!roleId) return;

  const guild = reaction.message.guild;
  const member = await guild.members.fetch(user.id);
  const role = await guild.roles.fetch(roleId);

  if (role) {
    try {
      await member.roles.add(role);
    } catch (error) {
      console.error("Failed to add role:", error);
    }
  }
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (user.bot) return;

  const roleMapping = client.reactionRoles.get(reaction.message.id);
  if (!roleMapping) return;

  const roleId = roleMapping[reaction.emoji.name];
  if (!roleId) return;

  const guild = reaction.message.guild;
  const member = await guild.members.fetch(user.id);
  const role = await guild.roles.fetch(roleId);

  if (role) {
    try {
      await member.roles.remove(role);
    } catch (error) {
      console.error("Failed to remove role:", error);
    }
  }
});

client.login(token);
