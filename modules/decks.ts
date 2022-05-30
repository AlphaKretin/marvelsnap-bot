import { MessageEmbed } from "discord.js";
import fetch from "make-fetch-happen";
import { decksource, deckurl, embed } from "../config.json";

interface APIDeck {
	username: string;
	deck_name: string;
	desc_description: string;
	primary_color?: string;
	main_deck: string;
	submit_date: string;
	edit_date: string;
	deck_views: number;
	deckNum: number;
	comments: number;
	cover_card: string;
	userid: number;
	deck_price?: string;
	pretty_url: string;
	format: string;
}

interface APIError {
	error: string;
}

function isError(response: APIDeck[] | APIError): response is APIError {
	return (response as APIError).error !== undefined;
}

export async function searchDecks(name: string | null, card: string | null): Promise<MessageEmbed | null> {
	let url = `${decksource}?`;
	if (name) {
		url += `name=${encodeURIComponent(name)}`;
		if (card) {
			url += "&";
		}
	}
	if (card) {
		url += `cardcode=${encodeURIComponent(card)}`;
	}
	const deckResponse = await fetch(url);
	const decks = (await deckResponse.json()) as APIDeck[] | APIError;
	if (isError(decks)) {
		return null;
	} else {
		if (decks.length < 1) {
			return null;
		}
		const fiveDecks = decks.slice(0, 5);
		const deckStrings = fiveDecks.map(
			d => `[${d.deck_name}](${deckurl + d.pretty_url}) created by ${d.username} (${d.deck_views} 👁️)`
		);
		const deckEmbed = new MessageEmbed().setTitle("Decks").setDescription(deckStrings.join("\n")).setColor(embed);
		return deckEmbed;
	}
}
