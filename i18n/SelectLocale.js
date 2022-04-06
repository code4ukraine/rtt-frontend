import {useCallback, useEffect} from 'react';
import {useSelectedLanguage} from 'next-export-i18n';
import {useRouter} from 'next/router';

const SelectLocale = () => {
    const {lang} = useSelectedLanguage()
    const router = useRouter()
    const onChange = useCallback((event) => {
        const nextLang = event.target.value;
        const {pathname, asPath, query} = router
        router.push({pathname, query: {...query, lang: nextLang}}, asPath)
    }, []);

    useEffect(() => {
        onChange({target: {value: lang}})
    }, [lang, onChange])
    return (
        <select value={lang} onChange={onChange}>
            <option value="uk">український</option>
            <option value="ru">русский</option>
            <option value="en">English</option>
        </select>
    )
}

export default SelectLocale
