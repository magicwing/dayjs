import { FORMAT_DEFAULT } from '../constant';

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
  const dateKey = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
  dateKey.forEach(v => {
    const oldGet = prop[v];
    prop[v] = function (value) {
      if (value === undefined) {
        return oldGet.bind(this)();
      } else {
        return this.set(v, value);
      }
    };
  });

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
      _locale['_' + key] = Array.isArray(value) ? Object.assign([], value) : typeof value === 'object' ? Object.assign({}, value) : value;
    });
    return _locale;
  };
}