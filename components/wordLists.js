const WordListSources = [
	"Swadesh 100",
	"Swadesh 207",
	"Swadesh-Yakhontov",
	"Swadesh-Woodward",
	"Dolgopolsky",
	"Leipzig-Jakarta",
	"ASJP"
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
			"Leipzig-Jakarta"
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
		word: "at",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "back",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "bad",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
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
			"Leipzig-Jakarta"
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
			"Leipzig-Jakarta"
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
			"Leipzig-Jakarta"
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
			"ASJP"
		]
	},
	{
		word: "blow (verb)",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
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
			"Swadesh 207"
		]
	},
	{
		word: "brother",
		lists: [
			"Swadesh-Woodward"
		]
	},
	{
		word: "burn (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
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
		word: "child",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "child (kin term)",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "claw",
		lists: [
			"Swadesh 100"
		]
	},
	{
		word: "cloud (not fog)",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
		]
	},
	{
		word: "cold",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
		]
	},
	{
		word: "come (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
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
			"Leipzig-Jakarta"
		]
	},
	{
		word: "cut (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "dance",
		lists: [
			"Swadesh-Woodward"
		]
	},
	{
		word: "day",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "dead",
		lists: [
			"Dolgopolsky"
		]
	},
	{
		word: "die (verb)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"ASJP"
		]
	},
	{
		word: "dig (verb)",
		lists: [
			"Swadesh 207"
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
			"ASJP"
		]
	},
	{
		word: "dry (substance)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
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
			"Swadesh-Woodward"
		]
	},
	{
		word: "ear",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "earth (soil)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "eat (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "egg",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
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
			"ASJP"
		]
	},
	{
		word: "fall (verb)",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
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
		word: "father",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
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
		word: "few",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "fight (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "fingernail",
		lists: [
			"Swadesh 207",
			"Dolgopolsky"
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
			"ASJP"
		]
	},
	{
		word: "fish (noun)",
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
			"Swadesh 207"
		]
	},
	{
		word: "flower",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "fly (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "fog",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "foot (not leg)",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
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
		word: "freeze (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "fruit",
		lists: [
			"Swadesh 207"
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
		word: "give (verb)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "go (verb)",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "good",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
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
		word: "guts",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "hair (on head of humans)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "hand",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"ASJP"
		]
	},
	{
		word: "hard",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "head (anatomic)",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
		]
	},
	{
		word: "hear (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "heart",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Dolgopolsky"
		]
	},
	{
		word: "heavy",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
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
			"Swadesh 100"
		]
	},
	{
		word: "house",
		lists: [
			"Leipzig-Jakarta"
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
			"Swadesh-Woodward"
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
		word: "kill (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "knee",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "know (verb)",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "lake",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "laugh (verb)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "leaf (botanics)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "left (not right)",
		lists: [
			"Swadesh 207"
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
		word: "lie (on side, recline, as in a bed)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "live (verb)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
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
			"Leipzig-Jakarta"
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
		word: "man (adult male)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
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
		word: "moon",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "mother",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "mountain (not hill)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"ASJP"
		]
	},
	{
		word: "mouth",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
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
			"Leipzig-Jakarta"
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
			"ASJP"
		]
	},
	{
		word: "night (dark time)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP"
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
			"ASJP"
		]
	},
	{
		word: "old",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
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
			"ASJP"
		]
	},
	{
		word: "pig",
		lists: [
			"Swadesh-Woodward"
		]
	},
	{
		word: "play (verb)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "pull (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "push (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "rain (noun)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
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
			"Swadesh 207"
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
		word: "round",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
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
			"Leipzig-Jakarta"
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
		word: "sand",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "say (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "scratch (verb)",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "sea",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "see (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "seed (noun)",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
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
		word: "short",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "sing (verb)",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
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
			"Swadesh-Woodward"
		]
	},
	{
		word: "skin/hide",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "sky",
		lists: [
			"Swadesh 207"
		]
	},
	{
		word: "sleep (verb)",
		lists: [
			"Swadesh 100",
			"Swadesh 207"
		]
	},
	{
		word: "small",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Leipzig-Jakarta"
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
		word: "smooth",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
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
		word: "soil",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "some",
		lists: [
			"Swadesh 207"
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
			"Leipzig-Jakarta"
		]
	},
	{
		word: "star",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta",
			"ASJP"
		]
	},
	{
		word: "stick",
		lists: [
			"Swadesh 207"
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
			"ASJP"
		]
	},
	{
		word: "straight",
		lists: [
			"Swadesh 207"
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
			"ASJP"
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
			"Swadesh 207"
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
		word: "take (verb)",
		lists: [
			"Leipzig-Jakarta"
		]
	},
	{
		word: "tear/teardrop",
		lists: [
			"Dolgopolsky"
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
			"Leipzig-Jakarta"
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
			"Swadesh-Woodward"
		]
	},
	{
		word: "think (verb)",
		lists: [
			"Swadesh 207"
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
			"Swadesh 207"
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
			"ASJP"
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
			"ASJP"
		]
	},
	{
		word: "tree (not log)",
		lists: [
			"Swadesh 100",
			"Swadesh 207",
			"Swadesh-Woodward",
			"ASJP"
		]
	},
	{
		word: "turn (intransitive) (verb)",
		lists: [
			"Swadesh 207"
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
			"Swadesh 207"
		]
	},
	{
		word: "warm",
		lists: [
			"Swadesh 207",
			"Swadesh-Woodward"
		]
	},
	{
		word: "wash (verb)",
		lists: [
			"Swadesh 207"
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
			"Swadesh-Woodward"
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
			"Swadesh-Woodward"
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
			"Leipzig-Jakarta"
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
		word: "wind",
		lists: [
			"Swadesh-Yakhontov",
			"Swadesh 207",
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "wing",
		lists: [
			"Swadesh 207",
			"Leipzig-Jakarta"
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
			"Swadesh-Woodward"
		]
	},
	{
		word: "wood",
		lists: [
			"Swadesh-Woodward",
			"Leipzig-Jakarta"
		]
	},
	{
		word: "work",
		lists: [
			"Swadesh-Woodward"
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
	}
];

export default {
	sources: WordListSources,
	words: WordList
};
