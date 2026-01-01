/**
 * i18n Service - Internationalization
 * Kazemi x Shioru Fusion
 */

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';

/**
 * Initialize i18next with file system backend
 */
export async function initI18n() {
  const localePath = join(process.cwd(), 'src', 'services', 'i18n', 'locales');

  const availableLocales = readdirSync(localePath).filter((fileName) => {
    const joinedPath = join(localePath, fileName);
    return lstatSync(joinedPath).isDirectory();
  });

  await i18next.use(Backend).init({
    debug: false,
    initImmediate: false,
    fallbackLng: 'th',
    lng: 'en-US',
    preload: availableLocales,
    backend: {
      loadPath: join(localePath, '{{lng}}', '{{ns}}.json'),
    },
    interpolation: {
      escapeValue: false,
    },
  });

  return i18next;
}

/**
 * Get translated text
 */
export function t(key: string, options?: any): string {
  const result = i18next.t(key, options);
  return typeof result === 'string' ? result : String(result);
}

/**
 * Get current language
 */
export function getLanguage(): string {
  return i18next.language;
}

/**
 * Change language
 */
export async function changeLanguage(lng: string) {
  await i18next.changeLanguage(lng);
}

/**
 * Get available languages
 */
export function getAvailableLanguages(): string[] {
  return Array.from(i18next.languages || []);
}

export default {
  init: initI18n,
  t,
  getLanguage,
  changeLanguage,
  getAvailableLanguages,
};
