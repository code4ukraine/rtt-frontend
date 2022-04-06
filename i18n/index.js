var en = require("./translations.en.json");
var uk = require("./translations.uk.json");
var ru = require("./translations.ru.json");

const i18n = {
    translations: {
        uk,
        ru,
        en,
    },
    defaultLang: 'uk',
    useBrowserDefault: true,
};

module.exports = i18n;
