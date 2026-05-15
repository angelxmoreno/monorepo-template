const IRREGULAR_PLURALS: Record<string, string> = {
	person: "people",
	child: "children",
	mouse: "mice",
	goose: "geese",
	foot: "feet",
	tooth: "teeth",
	louse: "lice",
	ox: "oxen",
	cactus: "cacti",
	focus: "foci",
	syllabus: "syllabi",
	fungus: "fungi",
	nucleus: "nuclei",
	analysis: "analyses",
	basis: "bases",
	crisis: "crises",
	thesis: "theses",
	phenomenon: "phenomena",
	criterion: "criteria",
	datum: "data",
	index: "indices",
	matrix: "matrices",
	vertex: "vertices",
};

export function toSnakeCaseAcronymSafe(str: string): string {
	return str
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
		.replace(/([a-z\d])([A-Z])/g, "$1_$2")
		.toLowerCase();
}

function pluralize(word: string): string {
	if (IRREGULAR_PLURALS[word] !== undefined) {
		return IRREGULAR_PLURALS[word];
	}

	if (word.endsWith("s") || word.endsWith("x") || word.endsWith("z")) {
		return `${word}es`;
	}
	if (word.endsWith("sh") || word.endsWith("ch")) {
		return `${word}es`;
	}
	if (
		word.endsWith("y") &&
		word.length > 1 &&
		!isVowel(word[word.length - 2])
	) {
		return `${word.slice(0, -1)}ies`;
	}

	return `${word}s`;
}

function isVowel(char: string | undefined): boolean {
	return char !== undefined && ["a", "e", "i", "o", "u"].includes(char);
}

export function createSafeTableName(targetName: string): string {
	const stripped = targetName.replace(/Entity$/, "");
	const snake = toSnakeCaseAcronymSafe(stripped);
	return pluralize(snake);
}
