import { Client } from "discord.js";
import { token, admins } from "./auth.json";
import { prefix, maxSearch } from "./config.json";
import { cleanString, messageCapSlice, errhand } from "./modules/util";
import { searchCard, updateCardNames } from "./modules/cards.js";

process.on("unhandledRejection", errhand);

const bot = new Client({ intents: ["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES"] });

async function update(): Promise<void> {
	const proms: Array<Promise<void>> = [];
	proms.push(updateCardNames().then(() => console.log("Card names updated")));
	await Promise.all(proms);
}

bot.on("messageCreate", m => {
	const msg = m; // assert channel is in cache as code previously assumed
	if (msg.author.bot) {
		return;
	}
	if (msg.content.startsWith(prefix)) {
		const command = cleanString(msg.content);
		// Admin-only commands
		if (admins.includes(msg.author.id)) {
			// Update command. Admin-only, updates the list of tags from the source.
			if (command.startsWith("update")) {
				msg.reply({ content: "Updating!", allowedMentions: { repliedUser: false } }).then(m => {
					update().then(
						() => {
							m.edit("Update complete!");
						},
						err => {
							m.edit(`Error!\n\`\`\`\n${err}\`\`\``);
						}
					);
				});
				return;
			}

			if (command.startsWith("server")) {
				const count = bot.guilds.cache.size;
				const guildList = messageCapSlice(bot.guilds.cache.map(g => `${g.name} (Users: ${g.memberCount})`).join("\n"));
				msg
					.reply(
						`I am in ${count} cached servers. Type \`.servers list\` to see the whole list. This will send you ${guildList.length} Direct Message(s).`
					)
					.then(async () => {
						if (command.includes("list")) {
							const chan = await msg.author.createDM();
							for (const mes of guildList) {
								await chan.send(mes);
							}
						}
					})
					.catch(errhand);
			}
		}
	}
	const queryReg = /\[([^[]+?)\]/g; // declare anew in-scope to reset index
	let result = queryReg.exec(msg.content);
	const results = [];
	while (result !== null) {
		results.push(result[1]);
		result = queryReg.exec(msg.content);
	}
	if (results.length > 0) {
		const max = Math.min(results.length, maxSearch);
		for (let i = 0; i < max; i++) {
			if (results[i].length > 1 || results[i] === "7") {
				searchCard(results[i], msg).catch(errhand);
			}
		}
	}
});

bot.on("error", errhand);

bot.on("warn", errhand);

bot.on("ready", () => {
	console.log("Logged in as %s - %s", bot.user?.username || "null", bot.user?.id || "null");
	update().then(() => console.log("Ready to go!"));
});

bot.login(token);
