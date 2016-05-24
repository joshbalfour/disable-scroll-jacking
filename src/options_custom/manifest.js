var strictness = [
    i18n.get("off"),
    i18n.get("medium"),
    i18n.get("high")
];

this.manifest = {
    "name": i18n.get("Disable Scroll Jacking"),
    "icon": "icon.png",
    "settings": [
        {
            "tab": i18n.get("general"),
            "name": "strictness",
            "type": "slider",
            "label": i18n.get("strictness"),
            "max": 2,
            "min": 0,
            "step": 1,
            "display": true,
            "displayModifier": function (value) {
                return strictness[value];
            }
        },
        {
            "tab": i18n.get("general"),
            "type": "description",
            "text" : i18n.get("general.description")
        },
        {
            "tab": i18n.get("advanced"),
            "name": "debug",
            "label": i18n.get("debug mode"),
            "type": "checkbox"
        },
        {
            "tab": i18n.get("advanced"),
            "type": "description",
            "text" : i18n.get("advanced.description")
        }
    ],
    "alignment": [

    ]
};
