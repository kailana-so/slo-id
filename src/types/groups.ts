// ── Form Type Definitions ────────────────────────────────────────────────────
export const FORM_TYPES = {
  // Animals
  animal: {
    insect: "Insects",
    arachnid: "Arachnids", 
    bird: "Birds",
    reptile: "Reptiles",
    mammal: "Mammals",
    amphibian: "Amphibians",
    fish: "Fish",
    mollusk: "Mollusks",
    crustacean: "Crustaceans",
    otherInvertebrate: "Other Invertebrates",
  },
  
  // Plants & Fungi
  plant: "Plants",
  fungus: "Fungi",
  
  // Geology
  geology: {
    rock: "Rocks",
    mineral: "Minerals", 
    fossil: "Fossils",
    soil: "Soils",
    landform: "Landforms",
  },
  
  // Evidence
  evidence: {
    "Tracks": "Tracks",
    "Scat": "Scat",
    "Feather": "Feathers", 
    "Shell": "Shells",
    "Web": "Webs",
    "Nest": "Nest",
    "Remains": "Remains",
  },
} as const;

// ── Type Definitions ─────────────────────────────────────────────────────────
export type FormType = 
  | keyof typeof FORM_TYPES.animal
  | keyof typeof FORM_TYPES.geology  
  | keyof typeof FORM_TYPES.evidence
  | "plant" | "fungus";

export type TopGroup = "Animals" | "Plants" | "Fungi" | "Geology" | "Evidence";

export interface FormGroup {
  name: TopGroup;
  id: string;
  types: { id: FormType; name: string }[];
}

// ── Group Definitions ────────────────────────────────────────────────────────
export const groups: FormGroup[] = [
  {
    name: "Animals",
    id: "animal",
    types: Object.entries(FORM_TYPES.animal).map(([id, name]) => ({ id: id as FormType, name })),
  },
  {
    name: "Plants", 
    id: "plant", 
    types: [{ id: "plant" as FormType, name: FORM_TYPES.plant }],
  },
  {
    name: "Fungi",
    id: "fungus", 
    types: [{ id: "fungus" as FormType, name: FORM_TYPES.fungus }],
  },
  {
    name: "Geology",
    id: "geology",
    types: Object.entries(FORM_TYPES.geology).map(([id, name]) => ({ id: id as FormType, name })),
  },
  {
    name: "Evidence",
    id: "evidence", 
    types: Object.entries(FORM_TYPES.evidence).map(([id, name]) => ({ id: id as FormType, name })),
  },
];

// ── Utility Functions ────────────────────────────────────────────────────────
export const getTopGroups = (): TopGroup[] => groups.map(g => g.name);

export const getSubGroups = (topGroup: TopGroup): string[] => {
  const group = groups.find(g => g.name === topGroup);
  return group ? group.types.map(t => t.name) : [];
};

export const getFormType = (topGroup: TopGroup, subGroup?: string): FormType | "" => {
  const group = groups.find(g => g.name === topGroup);
  if (!group) return "";
  
  if (group.types.length === 1) return group.types[0].id;
  
  const type = group.types.find(t => t.name === subGroup);
  return type?.id || "";
};
