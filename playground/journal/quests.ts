export type Danger = "MODERATE" | "HIGH";

export interface Emblem {
  shape: "diamond" | "square";
  fill: string;
  edge: string;
}

export interface Quest {
  id: string;
  title: string;
  danger: Danger;
  isNew: boolean;
  emblem: Emblem;
  objective: string;
  description: string;
  marker: string;
}

export interface QuestSection {
  id: string;
  title: string;
  quests: readonly Quest[];
}

const ORANGE: Emblem = { shape: "diamond", fill: "#f0a024", edge: "#ffd070" };
const GREEN: Emblem = { shape: "diamond", fill: "#18c060", edge: "#6cf0a0" };
const WATSON: Emblem = { shape: "square", fill: "#16110f", edge: "#d63a3a" };
const SOUTH: Emblem = { shape: "square", fill: "#0a0a0a", edge: "#2aa060" };
const SAN_DOM: Emblem = { shape: "square", fill: "#3338c8", edge: "#e8e8ff" };
const PACIFICA: Emblem = { shape: "square", fill: "#c8389a", edge: "#ffc8f0" };

const EPISTROPHY_TEXT =
  "Over the mountains, through the woods, nestled on the hills beyond North Oak – that's where your pal Delamain lost one of his cabs. He's a goddamn talking car himself and, apparently, has more cars of his own. I dunno, but I just say we continue this little fairy tale, find that cab, save the princess and claim half the kingdom.";

function epistrophy(
  district: string,
  emblem: Emblem,
  isNew = true,
  tail = "FIND THE DELAMAIN CAB IN",
): Quest {
  const slug = district.toLowerCase().replaceAll(" ", "-");
  return {
    id: `epistrophy-${slug}`,
    title: `EPISTROPHY: ${district}`,
    danger: "HIGH",
    isNew,
    emblem,
    objective: `${tail} ${district === "BADLANDS" ? "THE BADLANDS" : `${district}`}.`,
    description:
      district === "BADLANDS"
        ? EPISTROPHY_TEXT
        : `A cab went quiet near ${district.toLowerCase()}. ${EPISTROPHY_TEXT}`,
    marker: "DELAMAIN CAB",
  };
}

export const SECTIONS: readonly QuestSection[] = [
  {
    id: "gigs",
    title: "GIGS",
    quests: [
      {
        id: "automatic-love",
        title: "AUTOMATIC LOVE",
        danger: "MODERATE",
        isNew: false,
        emblem: ORANGE,
        objective: "MEET THE SOURCE AT THE DRIVE-IN.",
        description:
          "Someone at the old drive-in has a lonely machine that needs a fixer. The pay is decent and the client is very polite. Too polite.",
        marker: "DRIVE-IN",
      },
    ],
  },
  {
    id: "side-jobs",
    title: "SIDE JOBS",
    quests: [
      epistrophy("THE GLEN", GREEN),
      epistrophy("BADLANDS", SOUTH),
      epistrophy("NORTHSIDE", WATSON),
      epistrophy("RANCHO CORONADO", SAN_DOM),
      epistrophy("COASTVIEW", PACIFICA),
      epistrophy("NORTH OAK", ORANGE),
      epistrophy("WELLSPRINGS", GREEN),
      epistrophy("KABUKI", WATSON),
    ],
  },
];

export const QUESTS: readonly Quest[] = SECTIONS.flatMap((section) => section.quests);
export const DEFAULT_QUEST_ID = "epistrophy-badlands";
export const INITIAL_HOVER_ID = "epistrophy-northside";

export function questById(id: string): Quest {
  const quest = QUESTS.find((each) => each.id === id);
  if (quest === undefined) throw new Error(`no quest ${id}`);
  return quest;
}
