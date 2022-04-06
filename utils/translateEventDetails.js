export const translateEventDetails = (event, targetLang) => {
    let { title, description, translations } = event;
    /*if (targetLang !== 'en' && translations && translations[targetLang]) {
        title = translations[targetLang].title ?? title;
        description = translations[targetLang].description ?? description;
    }
    // Hax
    if ( Array.isArray(title) ) {
        title = title[0];
    }
    if ( Array.isArray(description)) {
        description = description[0];
    }
    title = title.replace(",[object Object]", "");
    description = description.replace(",[object Object]", "");*/
    return { title, description };
};