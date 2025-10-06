import type { IdentificationFormField } from "@/types/form";
import type { FormType } from "@/types/groups";

// ── Field Builders ───────────────────────────────────────────────────────────
const field = {
  size: (required = true): IdentificationFormField => ({
    name: "size", label: "Size (cm)", type: "select", required,
    options: [
      { name: "<1" }, { name: "1-5" }, { name: "5-10" }, { name: "10-20" },
      { name: "20-30" }, { name: "30-40" }, { name: "40-50" },
      { name: "50-100" }, { name: "100-150" }, { name: ">150" },
    ],
  }),

  color: (required = true): IdentificationFormField => ({
    name: "mainColour", label: "Main Colour", type: "color-buttons", required,
    options: [
      { name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#332E3C" },
      { name: "Gray", hex: "#9FA4A9" },  { name: "Brown", hex: "#7D451B" },
      { name: "Green", hex: "#85A947" }, { name: "Yellow", hex: "#FFC857" },
      { name: "Orange", hex: "#F7630F" },{ name: "Red", hex: "#BF3100" },
      { name: "Pink", hex: "#FFB7C3" },  { name: "Purple", hex: "#7B6FCB" },
      { name: "Blue", hex: "#3777FF" },  { name: "Gold", hex: "#D2A825" },
    ],
  }),

  habitat: (): IdentificationFormField => ({
    name: "habitat", label: "Habitat", type: "select", required: false,
    options: [
      { name: "Bushland" }, { name: "Grassland" }, { name: "Wetland" },
      { name: "Desert" }, { name: "Urban" },
    ],
  }),

  pattern: (): IdentificationFormField[] => [
    { name: "hasPatterns", label: "Has Patterns?", type: "checkbox", required: false },
    { name: "patternType", label: "Pattern Type", type: "select", required: true, conditional: "hasPatterns",
      options: [{ name: "Striped" }, { name: "Spotted" }, { name: "Banded" },
                { name: "Blotched" }, { name: "Checkered" }, { name: "Marbled" }, { name: "Solid" }] },
    { name: "patternColour", label: "Pattern Colour", type: "color-buttons", required: true, 
      conditional: "hasPatterns", options: field.color().options || [] },
  ],

  shape: (): IdentificationFormField => ({
    name: "bodyShape", label: "Body Shape", type: "select", required: true,
    options: [{ name: "Oval" }, { name: "Round" }, { name: "Elongated" },
              { name: "Segmented" }, { name: "Clustered" }],
  }),

  lifeStage: {
    arthropod: (): IdentificationFormField => ({
      name: "lifeStage", label: "Life Stage", type: "select", required: true,
      options: [{ name: "egg" }, { name: "larva" }, { name: "pupa" }, { name: "nymph" },
                { name: "teneral" }, { name: "subimago" }, { name: "juvenile" }, { name: "adult" }],
    }),

    vertebrate: (): IdentificationFormField => ({
      name: "lifeStage", label: "Life Stage", type: "select", required: true,
      options: [{ name: "juvenile" }, { name: "adult" }],
    }),

    arachnid: (): IdentificationFormField => ({
      name: "lifeStage", label: "Life Stage", type: "select", required: true,
      options: [{ name: "juvenile" }, { name: "adult" }],
    }),
  },

  status: (): IdentificationFormField => ({
    name: "individualStatus", label: "Individual Status", type: "select", required: false,
    options: [{ name: "Alive" }, { name: "Dead" }, { name: "Fossil" }, { name: "Evidence only" }],
  }),

  totalSize: (required = true): IdentificationFormField => ({
    name: "totalSize",
    label: "Total Size (cm)",
    type: "select",
    required,
    options: [
      { name: "<1" }, { name: "1-5" }, { name: "5-10" }, { name: "10-20" },
      { name: "20-30" }, { name: "30-40" }, { name: "40-50" },
      { name: "50-100" }, { name: "100-150" }, { name: ">150" },
    ],
  }),

  // Optional label override so we can reuse for fungus
  leafShape: (label = "Leaf Shape"): IdentificationFormField => ({
    name: "leafShape",
    label,
    type: "select",
    required: false,
    options: [
      { name: "Acicular (needle-like)" }, { name: "Cuneate (wedge-shaped)" }, { name: "Elliptic (oval)" },
      { name: "Filiform (thread-like)" }, { name: "Flabellate (fan-shaped)" }, { name: "Lanceolate (spear-shaped)" },
      { name: "Linear (narrow parallel sides)" }, { name: "Oblong (rectangular)" }, { name: "Obovate (inverted egg)" },
      { name: "Orbicular (circular)" }, { name: "Ovate (egg-shaped)" }, { name: "Reniform (kidney-shaped)" },
      { name: "Spathulate (spoon-shaped)" }, { name: "Subulate (narrow tapering point)" }
    ],
  }),
  leafSize: (required = true): IdentificationFormField => ({
    name: "leafSize",
    label: "Leaf Size (cm)",
    type: "select",
    required,
    options: [
      { name: "<1" }, { name: "1-5" }, { name: "5-10" }, { name: "10-20" },
      { name: "20-30" }, { name: "30-40" }, { name: "40-50" },
      { name: "50-100" }, { name: "100-150" }, { name: ">150" },
    ],
  }),

  // Optional label override so we can reuse for fungus as "Fruiting Body Shape"
  flowerShape: (label = "Flower Shape"): IdentificationFormField => ({
    name: "flowerShape",
    label,
    type: "select",
    required: false,
    conditional: "isFlowering",
    options: [
      { name: "Actinomorphic (radial symmetry)" }, { name: "Zygomorphic (bilateral symmetry)" },
      { name: "Campanulate (bell-shaped)" }, { name: "Cyanthiform (cup-shaped)" },
      { name: "Crateriform (bowl-shaped)" }, { name: "Coronate (crown-like)" },
      { name: "Urceolate (urn-shaped)" }, { name: "Tubulate (tube-shaped)" },
      { name: "Stellate (star-shaped)" }, { name: "Salverform (trumpet-shaped)" },
      { name: "Cruciform (cross-shaped)" }, { name: "Calceolate (slipper-shaped)" },
      { name: "Papilionaceous (pea-like)" }, { name: "Ligulate (strap-shaped)" },
      { name: "Tubular (long tube)" }, { name: "Rotate (wheel-shaped)" }
    ],
  }),

  flowerSize: (): IdentificationFormField => ({
    name: "flowerSize",
    label: "Flower Size (cm)",
    type: "select",
    required: false,
    conditional: "isFlowering",
    options: [
      { name: "<1" }, { name: "1-5" }, { name: "5-10" }, { name: "10-20" },
      { name: "20-30" }, { name: "30-40" }, { name: "40-50" },
      { name: "50-100" }, { name: "100-150" }, { name: ">150" },
    ],
  }),
};

// ── Schema Groups ────────────────────────────────────────────────────────────
const schemas = {
  // Base schemas for common patterns
  base: {
    animal: () => [field.size(), field.color(), field.habitat()],
    arthropod: () => [...schemas.base.animal(), field.lifeStage.arthropod(), field.status()],
    vertebrate: () => [...schemas.base.animal(), field.lifeStage.vertebrate(), field.status()],
    arachnid: () => [...schemas.base.animal(), field.lifeStage.arachnid(), field.status()],
    plant: () => [],
    evidence: () => [field.size(), field.habitat()],
  },

  // Specific animal schemas
  animal: {
    insect: () => [...schemas.base.animal(), field.shape(), ...field.pattern(), field.lifeStage.arthropod(), field.status()],
    arachnid: () => [...schemas.base.animal(), field.shape(), ...field.pattern(), field.lifeStage.arachnid(), field.status()],
    bird: () => [
      ...schemas.base.animal(),
      { name: "beakShape", label: "Beak Shape", type: "select", required: false,
        options: [{ name: "Conical" }, { name: "Hooked" }, { name: "Thin/pointed" }, { name: "Flat" }, { name: "Long/curved" }]},
      { name: "wingMarkings", label: "Wing Markings", type: "select", required: false,
        options: [{ name: "None" }, { name: "Wing bars" }, { name: "Spotted" }, { name: "Streaked" }, { name: "Banded" }] },
      field.lifeStage.vertebrate(), field.status(),
    ],
    reptile: () => [...schemas.base.animal(), ...field.pattern(),
      { name: "scaleTexture", label: "Scale Texture", type: "select", required: false,
        options: [{ name: "Smooth" }, { name: "Keeled" }] },
      { name: "venomous", label: "Venomous?", type: "checkbox", required: false },
      field.lifeStage.vertebrate(), field.status()],
    mammal: () => [...schemas.base.animal(),
      { name: "coatType", label: "Coat Type", type: "select", required: false,
        options: [{ name: "Fur" }, { name: "Hairless" }, { name: "Spiny" }] },
      field.lifeStage.vertebrate(), field.status()],
    amphibian: () => [...schemas.base.animal(),
      { name: "skinTexture", label: "Skin Texture", type: "select", required: false,
        options: [{ name: "Smooth" }, { name: "Warty" }, { name: "Slimy" }] },
      field.lifeStage.vertebrate(), field.status()],
    fish: () => [...schemas.base.animal(),
      { name: "finShape", label: "Fin Shape", type: "select", required: false,
        options: [{ name: "Rounded" }, { name: "Forked" }, { name: "Pointed" }] },
      field.lifeStage.vertebrate(), field.status()],
    mollusk: () => [...schemas.base.animal(),
      { name: "shellShape", label: "Shell Shape", type: "select", required: false,
        options: [{ name: "Conical" }, { name: "Spiral" }, { name: "Bivalve" }, { name: "No shell" }] },
      field.lifeStage.arthropod(), field.status()],
    crustacean: () => [...schemas.base.animal(),
      { name: "clawType", label: "Claw Type", type: "select", required: false,
        options: [{ name: "None" }, { name: "Small" }, { name: "Large" }, { name: "Asymmetrical" }] },
      field.lifeStage.arthropod(), field.status()],
    otherInvertebrate: () => [...schemas.base.animal(),
      { name: "bodyPlan", label: "Body Plan", type: "select", required: false,
        options: [{ name: "Worm-like" }, { name: "Radial" }, { name: "Other" }] },
      field.lifeStage.arthropod(), field.status()],
  },

  // Plant and fungus schemas
  organism: {
    plant: () => [
      ...schemas.base.plant(),
      field.totalSize(),       
      field.leafShape("Leaf Shape"),
      field.leafSize(),
      { 
        name: "isFlowering", label: "Flowering?", type: "checkbox", required: false },
      { 
        name: "flowerColour", label: "Flower Colour", type: "color-buttons", required: false,
        conditional: "isFlowering", options: field.color().options || [] },
      field.flowerShape(),
      field.flowerSize(),
      { 
        name: "isFruiting", label: "Fruiting?", type: "checkbox", required: false },
      { 
        name: "fruitColour", label: "Fruit Colour", type: "color-buttons", required: false,
        conditional: "isFruiting", options: field.color().options || [] },
      { 
        name: "fruitDescription", label: "Fruit Shape", type: "select", required: false,
        conditional: "isFruiting", options: field.shape().options || [] },
      field.habitat()
    ],
    fungus: () => [
      ...schemas.base.plant(),
      field.totalSize(),                    // replaces field.size()
      field.leafShape("Cap Shape"),         // same field, clearer label for fungi
      field.flowerShape("Fruiting Body Shape"), 
      field.habitat()
    ],
  },

  // Geology schemas
  geology: () => [
    field.size(), 
    field.color(),
    ...field.pattern(),
  ],

  // Evidence schemas
  evidence: () => schemas.base.evidence(),
};

// ── Main Schema Export ───────────────────────────────────────────────────────
export const identificationFormSchema: Record<FormType, IdentificationFormField[]> = {
  // Animals
  insect: schemas.animal.insect(),
  arachnid: schemas.animal.arachnid(),
  bird: schemas.animal.bird(),
  reptile: schemas.animal.reptile(),
  mammal: schemas.animal.mammal(),
  amphibian: schemas.animal.amphibian(),
  fish: schemas.animal.fish(),
  mollusk: schemas.animal.mollusk(),
  crustacean: schemas.animal.crustacean(),
  otherInvertebrate: schemas.animal.otherInvertebrate(),

  // Plants & Fungi
  plant: schemas.organism.plant(),
  fungus: schemas.organism.fungus(),

  // Geology
  rock: schemas.geology(),
  mineral: schemas.geology(),
  fossil: schemas.geology(),
  soil: schemas.geology(),
  landform: schemas.geology(),

  // Evidence
  "Tracks": schemas.evidence(),
  "Scat": schemas.evidence(),
  "Feather": schemas.evidence(),
  "Shell": schemas.evidence(),
  "Web": schemas.evidence(),
  "Nest": schemas.evidence(),
  "Remains": schemas.evidence(),
} satisfies Record<string, IdentificationFormField[]>;
