import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { clientId, guildId, token } from "./auth.json";

const commands = [
	new SlashCommandBuilder()
		.setName("card")
		.setDescription("Search for a Marvel Snap card.")
		.addStringOption(option => option.setName("name").setDescription("The name of the card.").setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
	.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);
