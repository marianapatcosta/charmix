import { createI18n } from 'vue-i18n/index';
import { Locale } from '@/types';
import en from './en.json';
import pt from './pt.json';
import de from './de.json';
import fr from './fr.json';
import es from './es.json';
import it from './it.json';

export const defaultLocale = Locale?.EN;

type MessageSchema = typeof en;

export const messages = {
  [Locale.EN]: en,
  [Locale.PT]: pt,
  [Locale.DE]: de,
  [Locale.FR]: fr,
  [Locale.ES]: es,
  [Locale.IT]: it,
};

export const i18n = createI18n<[MessageSchema], typeof Locale>({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
});
