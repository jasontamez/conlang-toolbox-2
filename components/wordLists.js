const WordListSources = [
	"Swadesh 100",
	"Swadesh 207",
	"Swadesh-Yakhontov",
	"Swadesh-Woodward",
	"Dogolposky",
	"Leipzig-Jakarta",
	"ASJP"
];

const WordList = [
	{
		word: "1st-person plural pronoun (we)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		ASJP: true
	},
	{
		word: "1st-person singular pronoun (I)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true,
		ASJP: true
	},
	{
		word: "2nd-person plural pronoun (you)",
		"Swadesh 207": true
	},
	{
		word: "2nd-person singular pronoun (you)",
		"Swadesh-Yakhontov": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true,
		ASJP: true
	},
	{
		word: "3rd-person plural pronoun (they)",
		"Swadesh 207": true
	},
	{
		word: "3rd-person singular pronoun (he/she/it/him/her)",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "all (of a number)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "and",
		"Swadesh 207": true
	},
	{
		word: "animal",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "ant",
		"Leipzig-Jakarta": true
	},
	{
		word: "arm",
		"Leipzig-Jakarta": true
	},
	{
		word: "ash(es)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "at",
		"Swadesh 207": true
	},
	{
		word: "back",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "bad",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "bark (of a tree)",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "because",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "belly (lower part of body, abdomen)",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "big",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "bird",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "bite (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "bitter",
		"Leipzig-Jakarta": true
	},
	{
		word: "black (color)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "blood",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "blow (verb)",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "bone",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "breast (woman's)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "breathe (verb)",
		"Swadesh 207": true
	},
	{
		word: "brother",
		"Swadesh-Woodward": true
	},
	{
		word: "burn (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "carry (verb)",
		"Leipzig-Jakarta": true
	},
	{
		word: "cat",
		"Swadesh-Woodward": true
	},
	{
		word: "child",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "child (kin term)",
		"Leipzig-Jakarta": true
	},
	{
		word: "claw",
		"Swadesh 100": true
	},
	{
		word: "cloud (not fog)",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "cold",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "come (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "correct",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "count (verb)",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "crush/grind (verb)",
		"Leipzig-Jakarta": true
	},
	{
		word: "cry/weep (verb)",
		"Leipzig-Jakarta": true
	},
	{
		word: "cut (verb)",
		"Swadesh 207": true
	},
	{
		word: "dance",
		"Swadesh-Woodward": true
	},
	{
		word: "day",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "dead",
		Dogolposky: true
	},
	{
		word: "die (verb)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		ASJP: true
	},
	{
		word: "dig (verb)",
		"Swadesh 207": true
	},
	{
		word: "dirty",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "do/make (verb)",
		"Leipzig-Jakarta": true
	},
	{
		word: "dog",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "drink (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "dry (substance)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "dull (as a knife)",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "dust",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "ear",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "earth (soil)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "eat (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "egg",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "eye (noun)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true,
		ASJP: true
	},
	{
		word: "fall (verb)",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "far",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "father",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "fear (verb)",
		"Swadesh 207": true
	},
	{
		word: "feather (large, not down)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "few",
		"Swadesh 207": true
	},
	{
		word: "fight (verb)",
		"Swadesh 207": true
	},
	{
		word: "fingernail",
		"Swadesh 207": true,
		Dogolposky: true
	},
	{
		word: "fire (noun)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "fish (noun)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "five",
		"Swadesh 207": true
	},
	{
		word: "flesh (meat)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "float (verb)",
		"Swadesh 207": true
	},
	{
		word: "flow (verb)",
		"Swadesh 207": true
	},
	{
		word: "flower",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "fly (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "fog",
		"Swadesh 207": true
	},
	{
		word: "foot (not leg)",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "forest",
		"Swadesh 207": true
	},
	{
		word: "four",
		"Swadesh 207": true
	},
	{
		word: "freeze (verb)",
		"Swadesh 207": true
	},
	{
		word: "fruit",
		"Swadesh 207": true
	},
	{
		word: "full",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		ASJP: true
	},
	{
		word: "give (verb)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "go (verb)",
		"Leipzig-Jakarta": true
	},
	{
		word: "good",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "grass",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "grease/fat",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "green (color)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "guts",
		"Swadesh 207": true
	},
	{
		word: "hair (on head of humans)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "hand",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		ASJP: true
	},
	{
		word: "hard",
		"Leipzig-Jakarta": true
	},
	{
		word: "head (anatomic)",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "hear (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "heart",
		"Swadesh 100": true,
		"Swadesh 207": true,
		Dogolposky: true
	},
	{
		word: "heavy",
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "here",
		"Swadesh 207": true
	},
	{
		word: "hide (verb)",
		"Leipzig-Jakarta": true
	},
	{
		word: "hit/beat (verb)",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "hold (verb)",
		"Swadesh 207": true
	},
	{
		word: "horn (animal part)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "hot",
		"Swadesh 100": true
	},
	{
		word: "house",
		"Leipzig-Jakarta": true
	},
	{
		word: "how",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "hunt (verb)",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "husband",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "ice",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "if",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "in",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "kill (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "knee",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "know (verb)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "lake",
		"Swadesh 207": true
	},
	{
		word: "laugh (verb)",
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "leaf (botanics)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "left (not right)",
		"Swadesh 207": true
	},
	{
		word: "leg",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "lie (on side, recline, as in a bed)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "live (verb)",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "liver",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "long (not wide)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "louse/nit",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true,
		ASJP: true
	},
	{
		word: "man (adult male)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "many",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "moon",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "mother",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "mountain (not hill)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		ASJP: true
	},
	{
		word: "mouth",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "name (noun)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true,
		ASJP: true
	},
	{
		word: "narrow",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "navel",
		"Leipzig-Jakarta": true
	},
	{
		word: "near",
		"Swadesh 207": true
	},
	{
		word: "neck (not nape)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "new",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "night (dark time)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "no/not",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true
	},
	{
		word: "nose",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "old",
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "one",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "other",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "path/road/trail (not street)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		ASJP: true
	},
	{
		word: "person (individual human)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		ASJP: true
	},
	{
		word: "pig",
		"Swadesh-Woodward": true
	},
	{
		word: "play (verb)",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "pull (verb)",
		"Swadesh 207": true
	},
	{
		word: "push (verb)",
		"Swadesh 207": true
	},
	{
		word: "rain (noun)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "red (color)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "right (not left)",
		"Swadesh 207": true
	},
	{
		word: "river",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "root (botanics)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "rope",
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "rotten",
		"Swadesh 207": true
	},
	{
		word: "round",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "rub (verb)",
		"Swadesh 207": true
	},
	{
		word: "run (verb)",
		"Leipzig-Jakarta": true
	},
	{
		word: "salt",
		"Swadesh-Yakhontov": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "sand",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "say (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "scratch (verb)",
		"Swadesh 207": true
	},
	{
		word: "sea",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "see (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "seed (noun)",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "sew (verb)",
		"Swadesh 207": true
	},
	{
		word: "shade/shadow",
		"Leipzig-Jakarta": true
	},
	{
		word: "sharp (as a knife)",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "short",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "sing (verb)",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "sister",
		"Swadesh-Woodward": true
	},
	{
		word: "sit (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "skin/hide",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "sky",
		"Swadesh 207": true
	},
	{
		word: "sleep (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "small",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "smell (verb)",
		"Swadesh 207": true
	},
	{
		word: "smoke (noun, of fire)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "smooth",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "snake",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "snow",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "soil",
		"Leipzig-Jakarta": true
	},
	{
		word: "some",
		"Swadesh 207": true
	},
	{
		word: "spit (verb)",
		"Swadesh 207": true
	},
	{
		word: "split (verb)",
		"Swadesh 207": true
	},
	{
		word: "squeeze (verb)",
		"Swadesh 207": true
	},
	{
		word: "stab (verb)",
		"Swadesh 207": true
	},
	{
		word: "stand (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "star",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "stick",
		"Swadesh 207": true
	},
	{
		word: "stone/rock",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		ASJP: true
	},
	{
		word: "straight",
		"Swadesh 207": true
	},
	{
		word: "suck (verb)",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "sun",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		ASJP: true
	},
	{
		word: "sweet",
		"Leipzig-Jakarta": true
	},
	{
		word: "swell (verb)",
		"Swadesh 207": true
	},
	{
		word: "swim (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "tail",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "take (verb)",
		"Leipzig-Jakarta": true
	},
	{
		word: "tear/teardrop",
		Dogolposky: true
	},
	{
		word: "that",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "there",
		"Swadesh 207": true
	},
	{
		word: "thick",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "thigh",
		"Leipzig-Jakarta": true
	},
	{
		word: "thin",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "think (verb)",
		"Swadesh 207": true
	},
	{
		word: "this",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "three",
		"Swadesh 207": true
	},
	{
		word: "throw (verb)",
		"Swadesh 207": true
	},
	{
		word: "tie (verb)",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "tongue (part of body)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true,
		ASJP: true
	},
	{
		word: "tooth",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true,
		ASJP: true
	},
	{
		word: "tree (not log)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		ASJP: true
	},
	{
		word: "turn (intransitive) (verb)",
		"Swadesh 207": true
	},
	{
		word: "two/pair",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		Dogolposky: true,
		ASJP: true
	},
	{
		word: "vomit (verb)",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "walk (verb)",
		"Swadesh 100": true,
		"Swadesh 207": true
	},
	{
		word: "warm",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "wash (verb)",
		"Swadesh 207": true
	},
	{
		word: "water (noun)",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true,
		ASJP: true
	},
	{
		word: "wet",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "what?",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true
	},
	{
		word: "when?",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "where?",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "white (color)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "who?",
		"Swadesh-Yakhontov": true,
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true,
		Dogolposky: true
	},
	{
		word: "wide",
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "wife",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "wind",
		"Swadesh-Yakhontov": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "wing",
		"Swadesh 207": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "wipe (verb)",
		"Swadesh 207": true
	},
	{
		word: "with",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "woman",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "wood",
		"Swadesh-Woodward": true,
		"Leipzig-Jakarta": true
	},
	{
		word: "work",
		"Swadesh-Woodward": true
	},
	{
		word: "worm",
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "year",
		"Swadesh-Yakhontov": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "yellow (color)",
		"Swadesh 100": true,
		"Swadesh 207": true,
		"Swadesh-Woodward": true
	},
	{
		word: "yesterday",
		"Leipzig-Jakarta": true
	}
];

export default {
	sources: WordListSources,
	words: WordList
};
