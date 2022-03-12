import { i18n } from '@/locales';
import { useHttpRequest } from '@/composables';
import { DICTIONARY_URLS } from '@/constants';
import { HttpMethod, Locale } from '@/types';
import { getRandomNumber } from './general';

export const getWords = async (nrLettersInWord: number): Promise<string[]> => {
  const fetchedWords = await import(`../words/${i18n.global.locale.value}.json`);
  return fetchedWords.default[nrLettersInWord];
};

export const getRandomWord = (words: string[]): string => {
  const randomIndex = getRandomNumber(0, words.length - 1);
  return words[randomIndex];
};

export const extractWordDefinition = (data: any): string => {
  if (!data[0]) {
    return '';
  }
  return data[0].meanings.reduce(
    (meanings: string, currentMeaning: any) =>
      `${meanings} \n [${currentMeaning.partOfSpeech}]: ${currentMeaning.definitions.reduce(
        (definitions: string, currentDefinition: any) =>
          `${definitions} ${currentDefinition.definition}`,
        ''
      )}`,
    ''
  );
};

export const extractWordDefinitionPt = (data: any): string => {
  if (!data[0] || !window.DOMParser) {
    return '';
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data[0].xml, 'text/xml');
  const definitionsTags = xmlDoc?.getElementsByTagName('def');

  if (!definitionsTags?.length) {
    return '';
  }

  return Array.from(definitionsTags).reduce(
    (definitions, currentDefinition) =>
      `${definitions} ${currentDefinition.childNodes[0].nodeValue?.replace(
        /(\r\n|\n|\r)/gm,
        ''
      )}\n`,
    ''
  );
};

export const fetchWordDefinition = async (word: string): Promise<string> => {
  const { sendRequest } = useHttpRequest();
  const isPT = i18n.global.locale.value === Locale.PT;
  const url = DICTIONARY_URLS(i18n.global.locale.value, word);
  if (!url) {
    return '';
  }

  const data = await sendRequest(url, HttpMethod.GET);
  const definition = isPT ? extractWordDefinitionPt(data) : extractWordDefinition(data);
  return definition;
};
