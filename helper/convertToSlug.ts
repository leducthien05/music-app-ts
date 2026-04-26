import unidecode from "unidecode";

export const convertToSlug = (text: string): string =>{
    const unidecodeText = unidecode(text.trim());
    const slugSearch = unidecodeText.replace(/\s+/g, "-");
    return slugSearch;
}