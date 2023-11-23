type emailType = (value: any) => boolean | string
type requiredType = (value: any) => boolean | string
type minLengthType = (value: string, length: number) => boolean | string
type minMaxLengthType = (value: string, min: number, max: number) => boolean | string
type isEmptyType = (value: any) => boolean
type isNullOrUndefinedType = (value: any) => boolean
type isEmptyArrayType = (arr: any[]) => boolean

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
    return 'Это поле обязательно к заполнению'

  return !!String(value).trim().length || 'Это поле обязательно к заполнению'
}

export const emailValidator: emailType = (value) => {
  if (isEmpty(value)) return true
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (Array.isArray(value))
    return value.every((val) => re.test(String(val))) || 'Некорректный Email'

  return re.test(String(value)) || 'Некорректный Email'
}

export const minLengthValidator: minLengthType = (value, length) => {
  if (isEmpty(value)) return true

  return String(value).length >= length || `Поле должно содержать не меньше ${length} символов`
}

export const minMaxLengthValidator: minMaxLengthType = (value, min, max) => {
  if (isEmpty(value)) return true

  if (String(value).length < min) {
    return `Поле должно содержать не меньше ${min} символов`
  }

  if (String(value).length > max) {
    return `Поле должно содержать не больше ${max} символов`
  }

  return true
}

export const confirmedValidator = (value: string, target: string) => {
  return value === target || 'Пароли не совпадают'
}

export const noNumbersValidator = (value: string) => {
  return /^([^0-9]*)$/.test(value) || 'Поле не должно содержать цифры'
}
