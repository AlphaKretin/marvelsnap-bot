"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const auth_json_1 = require("./auth.json");
const commands = [
    new builders_1.SlashCommandBuilder()
        .setName("card")
        .setDescription("Search for a Marvel Snap card.")
        .addStringOption(option => option.setName("name").setDescription("The name of the card.").setRequired(true))
].map(command => command.toJSON());
const rest = new rest_1.REST({ version: "9" }).setToken(auth_json_1.token);
rest
    .put(v9_1.Routes.applicationGuildCommands(auth_json_1.clientId, auth_json_1.guildId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
//# sourceMappingURL=command.js.map