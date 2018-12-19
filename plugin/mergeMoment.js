import assign from 'object-assign';

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