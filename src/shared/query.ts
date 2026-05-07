import { isNull, isString, isUndefined } from 'lodash-es';

export type LocationQueryValue = null | string;
export type LocationQuery = Record<string, LocationQueryValue | LocationQueryValue[]>;

export function parseQuery(text: string) {
  const query: LocationQuery = {};

  if (text == null || text === '' || text === '?') return query;

  const params = (text.charAt(0) === '?' ? text.slice(1) : text).split('&');

  for (let i = 0; i < params.length; i++) {
    const [key, val] = params[i].replace(/\+/g, '').split('=');
    const value = isString(val) && val.length > 0 ? decodeURIComponent(val) : null;

    if (isUndefined(query[key])) {
      query[key] = value;
    } else {
      let values = query[key];

      if (!Array.isArray(values)) {
        values = query[key] = [values];
      }

      values.push(value);
    }
  }

  return query;
}

export function stringifyQuery(query: LocationQuery) {
  let text = '';

  const keys = Object.keys(query);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = query[key];

    if (isUndefined(value)) {
      continue;
    }

    if (isNull(value)) {
      text += key;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (!isUndefined(item)) {
          text += key;

          if (!isNull(item)) {
            text += `=${encodeURIComponent(item)}&`;
          }
        }
      });
    } else {
      text += `${key}=${value}&`;
    }
  }

  return text.slice(0, -1);
}
