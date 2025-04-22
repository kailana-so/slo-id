const commonFields = [
    {
        name: "terrain",
        label: "Terrain",
        type: "select",
        required: false,
        options: [
            { name: "Bushland" },
            { name: "Grassland" },
            { name: "Wetland" },
            { name: "Desert" },
            { name: "Urban" }
        ]
    },
    {
        name: "weather",
        label: "Weather",
        type: "select",
        required: false,
        options: [
            { name: "Sun" },
            { name: "Rain" },
            { name: "Cloud" },
            { name: "Wind" },
            { name: "Snow" },
            { name: "Frost" }
        ]
    },
];

const commonSize = {
    name: "size",
    label: "Size (cm)",
    type: "select",
    required: true,
    options:[
        { name: "<1" },
        { name: "1-5" },
        { name: "5-10" },
        { name: "10-20" },
        { name: "20-30" },
        { name: "30-40" },
        { name: "50-100" },
        { name: ">150"},
    ]
}

const commonColours = {
    name: "mainColour",
    label: "Main Colour",
    type: "color-buttons",
    required: true,
    options: [
        { name: "Green", hex: "#85A947" },
        { name: "Brown", hex: "#7D451B" },
        { name: "Gray", hex: "#9FA4A9" },
        { name: "Black", hex: "#332E3C" },
        { name: "Yellow", hex: "#FFC857" },
        { name: "Blue", hex: "#3777FF" },
        { name: "Orange", hex: "#F7630F" },
        { name: "Red", hex: "#BF3100" },
        { name: "Pink", hex: "#FFB7C3" },
        { name: "Gold", hex: "#D2A825" }
    ],
}

const commonPattern = {
    name: "patternType",
    label: "Type",
    type: "select",
    required: true,
    conditional: "hasPatterns",
    options: [
        { name: "Striped" },
        { name: "Spotted" },
        { name: "Checkered" },
        { name: "Diamond" },
        { name: "Solid" },
        { name: "Marbled" }
    ]
}

const commonName = {
    name: "name",
    label: "Name",
    type: "text",
    required: false,
}

const commonShape =  [
    { name: "Oval" },
    { name: "Round" },
    { name: "Elongated" },
    { name: "Segmented" },
    { name: "Clustered" }
];

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
            options: commonShape
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
            options: commonShape,
        },
        {
            name: "hasFruits",
            label: "Has Fruits?",
            type: "checkbox",
            required: false,
        },
        {
            name: "fruitColour",
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
            options: commonShape
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
    mineral:[
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
