const commonFields = [
    {
        name: "terrain",
        label: "Terrain",
        type: "select",
        required: false,
        options: ["Bushland", "Grassland", "Wetland", "Desert", "Urban"],
    },
    {
        name: "weather",
        label: "Weather",
        type: "select",
        required: false,
        options: ["Sun", "Rain", "Cloud", "Wind", "Snow", "Frost"],
    },
];

const commonSize = {
    name: "size",
    label: "Size (cm)",
    type: "select",
    required: true,
    options: ["<1", "1-5", "5-10", "10-20", "20-30", "30-40", "40-50", "50-100", ">150"],
}

const commonColours = {
    name: "mainColour",
    label: "Main Colour",
    type: "color-buttons",
    required: true,
    options: ["Green", "Brown", "Gray", "Black", "Yellow", "Blue", "Orange", "Red", "Pink", "Gold"], 
}

const commonPattern = {
    name: "patternType",
    label: "Type",
    type: "select",
    required: true,
    conditional: "hasPatterns",
    options: ["Striped", "Spotted", "Checkered", "Diamond", "Solid", "Marbled"],
}

const commonName = {
    name: "name",
    label: "Name",
    type: "text",
    required: false,
}

export const identificationFormSchema = {
    insect: [
        commonName,
        commonSize,
        commonColours,
        {
            name: "bodyShape",
            label: "Body Shape",
            type: "select",
            required: true,
            options: ["Oval", "Round", "Elongated", "Segmented"],
        },
        {
            name: "hasPatterns",
            label: "Has Patterns?",
            type: "checkbox",
            required: false,
        },
        {
            name: "patternColour",
            label: "Colour",
            type: "color-buttons",
            required: true,
            conditional: "hasPatterns",
            options: commonColours.options,
        },
        commonPattern,
        ...commonFields,
    ],
    plant: [
        commonName,
        commonSize,
        commonColours,
        {
            name: "leafShape",
            label: "Leaf Shape",
            type: "select",
            required: true,
            options: ["Oval", "Lanceolate", "Palmate", "Linear"],
        },
        {
            name: "hasFruits",
            label: "Has Fruits?",
            type: "checkbox",
            required: false,
        },
        {
            name: "fruitDescription",
            label: "Fruit Colour",
            type: "color-buttons",
            required: false,
            conditional: "hasFruits",
            options: commonColours.options,
        },
        {
            name: "fruitDescription",
            label: "Fruit Shape",
            type: "select",
            required: false,
            conditional: "hasFruits",
            options: ["Round", "Oval", "Elongated", "Clustered"],
        },
        ...commonFields,
    ],
    reptile: [
        commonName,
        commonSize,
        commonColours,
        {
            name: "hasPatterns",
            label: "Has Patterns?",
            type: "checkbox",
            required: false,
        },
        {
            name: "patternColour",
            label: "Colour",
            type: "color-buttons",
            required: true,
            conditional: "hasPatterns",
            options: commonColours.options,
        },
        commonPattern,
        {
            name: "venomous",
            label: "Venomous?",
            type: "checkbox",
            required: false,
        },
        ...commonFields,
    ],
    bird:[
        commonName,
        commonSize,
        commonColours,
        {
            name: "hasPatterns",
            label: "Has Patterns?",
            type: "checkbox",
            required: false,
        },
        {
            name: "patternColour",
            label: "Colour",
            type: "color-buttons",
            required: true,
            conditional: "hasPatterns",
            options: commonColours.options,
        },
        commonPattern,
        ...commonFields,
    ],
    rock:[
        commonName,
        commonSize,
        commonColours,
        {
            name: "hasPatterns",
            label: "Has Patterns?",
            type: "checkbox",
            required: false,
        },
        {
            name: "patternColour",
            label: "Colour",
            type: "color-buttons",
            required: true,
            conditional: "hasPatterns",
            options: commonColours.options,
        },
        commonPattern,
        ...commonFields,
    ],
};
