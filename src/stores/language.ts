import { defineStore } from 'pinia'

type LangType = 'en' | 'ru'
interface StateType {
  lang: LangType
}

export const useLanguageStore = defineStore('language', {
  state: (): StateType => ({ lang: 'en' }),
  actions: {
    setLang(lang: LangType) {
      this.lang = lang
    },
    getAvailableLang(lang: LangType | string): LangType {
      const availableLanguages = ['en', 'ru']
      const isAvailable = (str: string): str is LangType => {
        return availableLanguages.includes(str)
      }

      if (isAvailable(lang)) {
        return lang
      } else {
        return 'en'
      }
    },
    defineLang() {
      const systemLang = navigator.language.slice(0, 2)
      const lastLang = localStorage.getItem('language')
      const newLang: LangType = this.getAvailableLang(lastLang || systemLang || 'en')

      this.setLang(newLang)
    },
    toggleLang() {
      const newLang = this.lang === 'en' ? 'ru' : 'en'

      this.setLang(newLang)
      localStorage.setItem('language', newLang)
    }
  }
})
