import { FORMAT_DEFAULT } from '../constant';
import assign from 'object-assign';

const defaultLongDateFormat = {
  LT: 'h:mm A',
  LTS: 'h:mm:ss A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A'
}

const localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

export default (option, dayjsClass, dayjsFactory) => {
  const prop = dayjsClass.prototype;

  // 兼容日期属性读取和设置
  function makeGetSet(unit) {
    return function(value) {
      if (value != null) {
        return this.set(unit, value);
      } else {
        return this[unit];
      }
    };
  }
  const dateKey = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
  dateKey.forEach(v => prop[v] = makeGetSet(v));

  // 日期格式化
  const oldFormat = prop.format;
  prop.format = function(formatStr) {
    const locale = this.$locale()
    const str = formatStr || FORMAT_DEFAULT
    const longDateFormat = locale.name === 'en' ? defaultLongDateFormat : locale.longDateFormat;
    const result = str.replace(localFormattingTokens, (match = '') => {
      let formatStr = longDateFormat[match];
      if (!formatStr && locale.name === 'en') {
        formatStr = longDateFormat[match.toUpperCase()];
      }
      return formatStr || match;
    });
    return oldFormat.bind(this)(result);
  }

  // 语言
  prop.localeData = function() {
    const locale = this.$locale();
    const _locale = {};
    Object.keys(locale).forEach(key => {
      const value = locale[key];
      _locale['_' + key] = Array.isArray(value) ? assign([], value) : typeof value === 'object' ? assign({}, value) : value;
    });
    return _locale;
  };
}