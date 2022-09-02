const WordListSources = [
	"Swadesh 100",
	"Swadesh 207",
	"Swadesh-Yakhontov",
	"Swadesh-Woodward",
	"Dolgopolsky",
	"Leipzig-Jakarta",
	"ASJP",
	"Landau 200"
];

const WordList = [
	{
		word: "1st-person plural pronoun (we)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"ASJP"
		]
	},
	{
		word: "1st-person singular pronoun (I)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Dolgopolsky",
			"ASJP"
		]
	},
	{
		word: "2nd-person plural pronoun (you)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "2nd-person singular pronoun (you)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Dolgopolsky",
			"ASJP"
		]
	},
	{
		word: "3rd-person plural pronoun (they)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "3rd-person singular pronoun (he/she/it/him/her)",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "afraid",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "air",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "all (of a number)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "and",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "angry",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "animal",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "ant",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "arm",
		lists: [
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "ash(es)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "ask (a question)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "at",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "baby",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "back (of object/building)",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "bad",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "bark (of a tree)",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
		]
	},
	{
		word: "because",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "belly (lower part of body, abdomen)",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
		]
	},
	{
		word: "big",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "bird",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "bite (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "bitter",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "black (color)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "blood",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "blow (breathe out)",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "body",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "bone",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "bottom (of object/mountain)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "boy (male child)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "boy (young man)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "break/shatter (verb)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "breast (woman's)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "breathe (verb)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "brother",
		lists: [
			"Swadesh-Woodward"
		]
	},
	{
		word: "build (construct)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "burn (something)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "carry (verb)",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "cat",
		lists: [
			"Swadesh-Woodward"
		]
	},
	{
		word: "child (reciprocal of parent)",
		lists: [
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "child (young human)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "claw",
		lists: [
			"Swadesh 100"
		]
	},
	{
		word: "climb (a mountain, hill)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "climb (a tree)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "close (one's eyes)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "clothes",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "cloud (not fog)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "cold",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "come (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "cook (verb)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "correct",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "count (verb)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "crush/grind (verb)",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "cry/weep (verb)",
		lists: [
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "cut (verb)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "dance (verb)",
		lists: [
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "daughter (of a father)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "daughter (of a mother)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "day/daytime",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "dead",
		lists: [
			"Dolgopolsky"
		]
	},
	{
		word: "deep (vertically)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "die (verb)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "dig (verb)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "dirty",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "do/make (verb)",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "dog",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "drink (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "dry (substance)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "dull (as a knife)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "dust",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "ear",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "earth (ground, dirt)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "eat (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "egg",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "evening",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "eye (noun)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Dolgopolsky",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "face",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "fall (verb)",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "far",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "fast",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "father",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "fear (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "feather (large, not down)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "feel (through touch)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "few",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "fight (verb)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "finger",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "fingernail",
		lists: [
			"Swadesh 207",
			"Dolgopolsky",
			"Landau 200"
		]
	},
	{
		word: "fire (noun)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "fish (animal)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "five",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "flesh (meat)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "float (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "flow (verb)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "flower",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "fly (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "fog",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "food",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "foot (part of body; not leg)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "forest",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "four",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "freeze (something)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "friend",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "front (of object/building)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "fruit",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "full",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"ASJP"
		]
	},
	{
		word: "girl (female child)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "girl (young woman)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "give (verb)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "go (on foot)",
		lists: [
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "good",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "grass",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "grease/fat",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "green (color)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "grow (intransitive verb)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "guts",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "hair (mass on head of humans)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "hand",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "happy",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "hard",
		lists: [
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "head (anatomic)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "hear (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "heart",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Dolgopolsky",
			"Landau 200"
		]
	},
	{
		word: "heavy",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "here",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "hide (verb)",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "high (in altitude)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "hit/beat (verb)",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "hold (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "horn (animal part)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "hot",
		lists: [
			"Swadesh 100",
			"Landau 200"
		]
	},
	{
		word: "house (noun)",
		lists: [
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "how",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "hunt (verb)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "hurt/injure (verb)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "husband",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "ice",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "if",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "in",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "kick (verb)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "kill (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "kill/murder",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "knee",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "know (a person)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "know (information)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "lake",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "laugh (verb)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "leaf (fallen off)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "leaf (on plant)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "left (not right)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "leg",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "lie (on back)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "lie (on side, recline, as in a bed)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "life (experience of living)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "light (natural)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "live (verb)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "liver",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "long (not wide)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "louse/nit",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Dolgopolsky",
			"ASJP"
		]
	},
	{
		word: "love (as a friend)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "love (romantically)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "low (in altitude)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "man (adult male)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "many",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
		]
	},
	{
		word: "meat",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "meet (for the first time)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "mind (center of thoughts and emotions)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "moon",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "morning (early morning)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "morning (late morning)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "mother",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "mountain (not hill)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "mouth",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "music",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "name (noun)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Dolgopolsky",
			"ASJP"
		]
	},
	{
		word: "narrow",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "navel",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "near",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "neck (not nape)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "new",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "night/nighttime",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "no/not",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Dolgopolsky"
		]
	},
	{
		word: "nose",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "old (not new)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "older brother (of a brother)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "older brother (of a sister)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "older sister (of a brother)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "older sister (of a sister)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "one",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "open (one's eyes)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "other",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "path/road/trail (not street)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"ASJP"
		]
	},
	{
		word: "person (individual human)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "pig",
		lists: [
			"Swadesh-Woodward"
		]
	},
	{
		word: "plant",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "play (a game)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "pull (verb)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "push (verb)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "rain (noun)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "red (color)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "right (not left)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "river",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "river (flowing into another river)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "river (flowing into the sea)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "root (botanics)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "rope",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "rotten",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "rough (of surface)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "round (spherical)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "rub (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "run (verb)",
		lists: [
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "sad",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "salt",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "salt (in sea)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "sand",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "say (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "scratch (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "sea/ocean",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "see (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "seed (in fruit)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "seed (to be planted)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "sew (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "shade/shadow",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "sharp (as a knife)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "short (height)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "short (length)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "sing (verb)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "sister",
		lists: [
			"Swadesh-Woodward"
		]
	},
	{
		word: "sit (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "skin/hide",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "sky",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "sleep (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "slow",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "small",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "smell (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "smoke (noun, of fire)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "smooth (adjective)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "snake",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "snow",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "soft",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "soil",
		lists: [
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "some",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "son (of a father)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "son (of a mother)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "speak/talk (verb)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "spit (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "split (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "squeeze (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "stab (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "stand (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "star",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "stick",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "stone/rock",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "straight",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "suck (verb)",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "sun",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "sweet",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "swell (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "swim (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "tail",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "take (pick up and carry)",
		lists: [
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "tear/teardrop",
		lists: [
			"Dolgopolsky",
			"Landau 200"
		]
	},
	{
		word: "thank",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "that",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
		]
	},
	{
		word: "there",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "thick",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "thigh",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "thin",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "think (verb)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "this",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "three",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "throw (verb)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "tie (verb)",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "tongue (part of body)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Dolgopolsky",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "tooth",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Dolgopolsky",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "top (of object/mountain)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "touch (verb)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "tree (not log)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"ASJP",
			"Landau 200"
		]
	},
	{
		word: "turn (intransitive verb)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "two/pair",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Dolgopolsky",
			"ASJP"
		]
	},
	{
		word: "vomit (verb)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "walk (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "warm",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "wash (body parts)",
		lists: [
			"Swadesh 207",
			"Landau 200"
		]
	},
	{
		word: "water (as drink or for cooking, cold)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "water (as drink or for cooking, hot)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "water (cold, moving)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "water (cold, not moving)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "water (hot, moving)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "water (hot, not moving)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "water (noun)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Dolgopolsky",
			"ASJP"
		]
	},
	{
		word: "wet",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "what?",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Dolgopolsky"
		]
	},
	{
		word: "when?",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "where?",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "white (color)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "who?",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Dolgopolsky"
		]
	},
	{
		word: "wide",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "wife",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "wind (noun)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "wing (anatomic)",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "wipe (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "with",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "woman",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Landau 200"
		]
	},
	{
		word: "wood",
		lists: [
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"Landau 200"
		]
	},
	{
		word: "work",
		lists: [
			"Swadesh-Woodward"
		]
	},
	{
		word: "world",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "worm",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "year",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "yellow (color)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "yesterday",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "younger brother (of a brother)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "younger brother (of a sister)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "younger sister (of a brother)",
		lists: [
			"Landau 200"
		]
	},
	{
		word: "younger sister (of a sister)",
		lists: [
			"Landau 200"
		]
	}
];

export default {
	sources: WordListSources,
	words: WordList
};
