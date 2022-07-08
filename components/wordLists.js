const WordListSources = [
	["Swadesh 100", "s100"],
	["Swadesh 207", "s207"],
	["Swadesh-Yakhontov", "sy"],
	["Swadesh-Woodward", "ssl"],
	["Dogolposky", "d"],
	["Leipzig-Jakarta", "lj"],
	["ASJP", "asjp"]
];

const WordList = [
	{
		word: "1st-person plural pronoun (we)",
		s100: true,
		s207: true,
		asjp: true
	},
	{
		word: "1st-person singular pronoun (I)",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		word: "2nd-person plural pronoun (you)",
		s207: true
	},
	{
		word: "2nd-person singular pronoun (you)",
		sy: true,
		s207: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		word: "3rd-person plural pronoun (they)",
		s207: true
	},
	{
		word: "3rd-person singular pronoun (he/she/it/him/her)",
		s207: true,
		lj: true
	},
	{
		word: "all (of a number)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "and",
		s207: true
	},
	{
		word: "animal",
		s207: true,
		ssl: true
	},
	{
		word: "ant",
		lj: true
	},
	{
		word: "arm",
		lj: true
	},
	{
		word: "ash(es)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "at",
		s207: true
	},
	{
		word: "back",
		s207: true,
		lj: true
	},
	{
		word: "bad",
		s207: true,
		ssl: true
	},
	{
		word: "bark (of a tree)",
		s100: true,
		s207: true
	},
	{
		word: "because",
		s207: true,
		ssl: true
	},
	{
		word: "belly (lower part of body, abdomen)",
		s100: true,
		s207: true
	},
	{
		word: "big",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "bird",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "bite (verb)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "bitter",
		lj: true
	},
	{
		word: "black (color)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "blood",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		word: "blow (verb)",
		s207: true,
		lj: true
	},
	{
		word: "bone",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "breast (woman's)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "breathe (verb)",
		s207: true
	},
	{
		word: "brother",
		ssl: true
	},
	{
		word: "burn (verb)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "carry (verb)",
		lj: true
	},
	{
		word: "cat",
		ssl: true
	},
	{
		word: "child",
		s207: true,
		ssl: true
	},
	{
		word: "child (kin term)",
		lj: true
	},
	{
		word: "claw",
		s100: true
	},
	{
		word: "cloud (not fog)",
		s100: true,
		s207: true
	},
	{
		word: "cold",
		s100: true,
		s207: true
	},
	{
		word: "come (verb)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "correct",
		s207: true,
		ssl: true
	},
	{
		word: "count (verb)",
		s207: true,
		ssl: true
	},
	{
		word: "crush/grind (verb)",
		lj: true
	},
	{
		word: "cry/weep (verb)",
		lj: true
	},
	{
		word: "cut (verb)",
		s207: true
	},
	{
		word: "dance",
		ssl: true
	},
	{
		word: "day",
		s207: true,
		ssl: true
	},
	{
		word: "dead",
		d: true
	},
	{
		word: "die (verb)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		asjp: true
	},
	{
		word: "dig (verb)",
		s207: true
	},
	{
		word: "dirty",
		s207: true,
		ssl: true
	},
	{
		word: "do/make (verb)",
		lj: true
	},
	{
		word: "dog",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		word: "drink (verb)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "dry (substance)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "dull (as a knife)",
		s207: true,
		ssl: true
	},
	{
		word: "dust",
		s207: true,
		ssl: true
	},
	{
		word: "ear",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "earth (soil)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "eat (verb)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "egg",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "eye (noun)",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		word: "fall (verb)",
		s207: true,
		lj: true
	},
	{
		word: "far",
		s207: true,
		lj: true
	},
	{
		word: "father",
		s207: true,
		ssl: true
	},
	{
		word: "fear (verb)",
		s207: true
	},
	{
		word: "feather (large, not down)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "few",
		s207: true
	},
	{
		word: "fight (verb)",
		s207: true
	},
	{
		word: "fingernail",
		s207: true,
		d: true
	},
	{
		word: "fire (noun)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		word: "fish (noun)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		word: "five",
		s207: true
	},
	{
		word: "flesh (meat)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "float (verb)",
		s207: true
	},
	{
		word: "flow (verb)",
		s207: true
	},
	{
		word: "flower",
		s207: true,
		ssl: true
	},
	{
		word: "fly (verb)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "fog",
		s207: true
	},
	{
		word: "foot (not leg)",
		s100: true,
		s207: true
	},
	{
		word: "forest",
		s207: true
	},
	{
		word: "four",
		s207: true
	},
	{
		word: "freeze (verb)",
		s207: true
	},
	{
		word: "fruit",
		s207: true
	},
	{
		word: "full",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		asjp: true
	},
	{
		word: "give (verb)",
		sy: true,
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "go (verb)",
		lj: true
	},
	{
		word: "good",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "grass",
		s207: true,
		ssl: true
	},
	{
		word: "grease/fat",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "green (color)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "guts",
		s207: true
	},
	{
		word: "hair (on head of humans)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "hand",
		sy: true,
		s100: true,
		s207: true,
		asjp: true
	},
	{
		word: "hard",
		lj: true
	},
	{
		word: "head (anatomic)",
		s100: true,
		s207: true
	},
	{
		word: "hear (verb)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "heart",
		s100: true,
		s207: true,
		d: true
	},
	{
		word: "heavy",
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "here",
		s207: true
	},
	{
		word: "hide (verb)",
		lj: true
	},
	{
		word: "hit/beat (verb)",
		s207: true,
		lj: true
	},
	{
		word: "hold (verb)",
		s207: true
	},
	{
		word: "horn (animal part)",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "hot",
		s100: true
	},
	{
		word: "house",
		lj: true
	},
	{
		word: "how",
		s207: true,
		ssl: true
	},
	{
		word: "hunt (verb)",
		s207: true,
		ssl: true
	},
	{
		word: "husband",
		s207: true,
		ssl: true
	},
	{
		word: "ice",
		s207: true,
		ssl: true
	},
	{
		word: "if",
		s207: true,
		ssl: true
	},
	{
		word: "in",
		s207: true,
		lj: true
	},
	{
		word: "kill (verb)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "knee",
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "know (verb)",
		sy: true,
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "lake",
		s207: true
	},
	{
		word: "laugh (verb)",
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "leaf (botanics)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		word: "left (not right)",
		s207: true
	},
	{
		word: "leg",
		s207: true,
		lj: true
	},
	{
		word: "lie (on side, recline, as in a bed)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "live (verb)",
		s207: true,
		ssl: true
	},
	{
		word: "liver",
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "long (not wide)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "louse/nit",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		word: "man (adult male)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "many",
		s100: true,
		s207: true
	},
	{
		word: "moon",
		sy: true,
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "mother",
		s207: true,
		ssl: true
	},
	{
		word: "mountain (not hill)",
		s100: true,
		s207: true,
		ssl: true,
		asjp: true
	},
	{
		word: "mouth",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "name (noun)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		word: "narrow",
		s207: true,
		ssl: true
	},
	{
		word: "navel",
		lj: true
	},
	{
		word: "near",
		s207: true
	},
	{
		word: "neck (not nape)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "new",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		word: "night (dark time)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		word: "no/not",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true
	},
	{
		word: "nose",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "old",
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "one",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "other",
		s207: true,
		ssl: true
	},
	{
		word: "path/road/trail (not street)",
		s100: true,
		s207: true,
		asjp: true
	},
	{
		word: "person (individual human)",
		s100: true,
		s207: true,
		ssl: true,
		asjp: true
	},
	{
		word: "pig",
		ssl: true
	},
	{
		word: "play (verb)",
		s207: true,
		ssl: true
	},
	{
		word: "pull (verb)",
		s207: true
	},
	{
		word: "push (verb)",
		s207: true
	},
	{
		word: "rain (noun)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "red (color)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "right (not left)",
		s207: true
	},
	{
		word: "river",
		s207: true,
		ssl: true
	},
	{
		word: "root (botanics)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "rope",
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "rotten",
		s207: true
	},
	{
		word: "round",
		s100: true,
		s207: true
	},
	{
		word: "rub (verb)",
		s207: true
	},
	{
		word: "run (verb)",
		lj: true
	},
	{
		word: "salt",
		sy: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "sand",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "say (verb)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "scratch (verb)",
		s207: true
	},
	{
		word: "sea",
		s207: true,
		ssl: true
	},
	{
		word: "see (verb)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "seed (noun)",
		s100: true,
		s207: true
	},
	{
		word: "sew (verb)",
		s207: true
	},
	{
		word: "shade/shadow",
		lj: true
	},
	{
		word: "sharp (as a knife)",
		s207: true,
		ssl: true
	},
	{
		word: "short",
		s207: true,
		ssl: true
	},
	{
		word: "sing (verb)",
		s207: true,
		ssl: true
	},
	{
		word: "sister",
		ssl: true
	},
	{
		word: "sit (verb)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "skin/hide",
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		word: "sky",
		s207: true
	},
	{
		word: "sleep (verb)",
		s100: true,
		s207: true
	},
	{
		word: "small",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "smell (verb)",
		s207: true
	},
	{
		word: "smoke (noun, of fire)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "smooth",
		s207: true,
		ssl: true
	},
	{
		word: "snake",
		s207: true,
		ssl: true
	},
	{
		word: "snow",
		s207: true,
		ssl: true
	},
	{
		word: "soil",
		lj: true
	},
	{
		word: "some",
		s207: true
	},
	{
		word: "spit (verb)",
		s207: true
	},
	{
		word: "split (verb)",
		s207: true
	},
	{
		word: "squeeze (verb)",
		s207: true
	},
	{
		word: "stab (verb)",
		s207: true
	},
	{
		word: "stand (verb)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "star",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		word: "stick",
		s207: true
	},
	{
		word: "stone/rock",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		word: "straight",
		s207: true
	},
	{
		word: "suck (verb)",
		s207: true,
		lj: true
	},
	{
		word: "sun",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		asjp: true
	},
	{
		word: "sweet",
		lj: true
	},
	{
		word: "swell (verb)",
		s207: true
	},
	{
		word: "swim (verb)",
		s100: true,
		s207: true
	},
	{
		word: "tail",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "take (verb)",
		lj: true
	},
	{
		word: "tear/teardrop",
		d: true
	},
	{
		word: "that",
		s100: true,
		s207: true
	},
	{
		word: "there",
		s207: true
	},
	{
		word: "thick",
		s207: true,
		lj: true
	},
	{
		word: "thigh",
		lj: true
	},
	{
		word: "thin",
		s207: true,
		ssl: true
	},
	{
		word: "think (verb)",
		s207: true
	},
	{
		word: "this",
		sy: true,
		s100: true,
		s207: true,
		lj: true
	},
	{
		word: "three",
		s207: true
	},
	{
		word: "throw (verb)",
		s207: true
	},
	{
		word: "tie (verb)",
		s207: true,
		lj: true
	},
	{
		word: "tongue (part of body)",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		word: "tooth",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		word: "tree (not log)",
		s100: true,
		s207: true,
		ssl: true,
		asjp: true
	},
	{
		word: "turn (intransitive) (verb)",
		s207: true
	},
	{
		word: "two/pair",
		sy: true,
		s100: true,
		s207: true,
		d: true,
		asjp: true
	},
	{
		word: "vomit (verb)",
		s207: true,
		ssl: true
	},
	{
		word: "walk (verb)",
		s100: true,
		s207: true
	},
	{
		word: "warm",
		s207: true,
		ssl: true
	},
	{
		word: "wash (verb)",
		s207: true
	},
	{
		word: "water (noun)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		word: "wet",
		s207: true,
		ssl: true
	},
	{
		word: "what?",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true
	},
	{
		word: "when?",
		s207: true,
		ssl: true
	},
	{
		word: "where?",
		s207: true,
		ssl: true
	},
	{
		word: "white (color)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "who?",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true
	},
	{
		word: "wide",
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "wife",
		s207: true,
		ssl: true
	},
	{
		word: "wind",
		sy: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		word: "wing",
		s207: true,
		lj: true
	},
	{
		word: "wipe (verb)",
		s207: true
	},
	{
		word: "with",
		s207: true,
		ssl: true
	},
	{
		word: "woman",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "wood",
		ssl: true,
		lj: true
	},
	{
		word: "work",
		ssl: true
	},
	{
		word: "worm",
		s207: true,
		ssl: true
	},
	{
		word: "year",
		sy: true,
		s207: true,
		ssl: true
	},
	{
		word: "yellow (color)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		word: "yesterday",
		lj: true
	}
];

export default {
	sources: WordListSources,
	words: WordList
};
