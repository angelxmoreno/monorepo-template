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

const SIBILANT_SUFFIXES = new Set(["s", "x", "z", "sh", "ch"]);

function endsWithSibilant(word: string): boolean {
	return SIBILANT_SUFFIXES.values().some((suffix) => word.endsWith(suffix));
}

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function isVowel(char: string | undefined): boolean {
	return char !== undefined && VOWELS.has(char);
}

function endsWithConsonantY(word: string): boolean {
	return (
		word.endsWith("y") && word.length > 1 && !isVowel(word[word.length - 2])
	);
}

function pluralize(word: string): string {
	const irregular = IRREGULAR_PLURALS[word];
	if (irregular !== undefined) return irregular;
	if (endsWithSibilant(word)) return `${word}es`;
	if (endsWithConsonantY(word)) return `${word.slice(0, -1)}ies`;
	return `${word}s`;
}

export function toSnakeCaseAcronymSafe(str: string): string {
	return str
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
		.replace(/([a-z\d])([A-Z])/g, "$1_$2")
		.toLowerCase();
}

export function createSafeTableName(targetName: string): string {
	const stripped = targetName.replace(/Entity$/, "");
	const snake = toSnakeCaseAcronymSafe(stripped);
	return pluralize(snake);
}
