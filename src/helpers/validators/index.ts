import { useLanguageStore } from '@/stores/language'
import dictionary from './dictionary.js'
import { computed } from 'vue'

type emailType = (value: any) => boolean | string
type requiredType = (value: any) => boolean | string
type minLengthType = (value: string, length: number) => boolean | string
type minMaxLengthType = (value: string, min: number, max: number) => boolean | string
type isEmptyType = (value: any) => boolean
type isNullOrUndefinedType = (value: any) => boolean
type isEmptyArrayType = (arr: any[]) => boolean

const langStore = useLanguageStore()
const lang = computed(() => langStore.lang)

export const isEmpty: isEmptyType = (value) => {
  if (value === null || value === undefined || value === '') return true

  return !!(Array.isArray(value) && value.length === 0)
}

export const isNullOrUndefined: isNullOrUndefinedType = (value) => {
  return value === null || value === undefined
}

export const isEmptyArray: isEmptyArrayType = (arr) => {
  return Array.isArray(arr) && arr.length === 0
}

export const requiredValidator: requiredType = (value) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return dictionary.required_field[lang.value]

  return !!String(value).trim().length || dictionary.required_field[lang.value]
}

export const emailValidator: emailType = (value) => {
  if (isEmpty(value)) return true
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (Array.isArray(value))
    return value.every((val) => re.test(String(val))) || dictionary.incorrect_email[lang.value]

  return re.test(String(value)) || dictionary.incorrect_email[lang.value]
}

export const minLengthValidator: minLengthType = (value, length) => {
  if (isEmpty(value)) return true

  return String(value).length >= length || dictionary.min_length[lang.value](length)
}

export const minMaxLengthValidator: minMaxLengthType = (value, min, max) => {
  if (isEmpty(value)) return true

  if (String(value).length < min) {
    return dictionary.min_length[lang.value](min)
  }

  if (String(value).length > max) {
    return dictionary.max_length[lang.value](max)
  }

  return true
}

export const confirmedValidator = (value: string, target: string) => {
  return value === target || dictionary.password_mismatch[lang.value]
}

export const noNumbersValidator = (value: string) => {
  return /^([^0-9]*)$/.test(value) || dictionary.no_numbers[lang.value]
}
