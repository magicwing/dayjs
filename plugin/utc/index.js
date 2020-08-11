import UTCDate, { tz } from './UTCDate'
import { parseTimezoneOffset } from './util'
import tzData from './tzData'

let RETURN_LOCAL_INSTANCE = false

export default function (option = {}, Dayjs, dayjs) {
  RETURN_LOCAL_INSTANCE = !!option.parseToLocal
  const proto = Dayjs.prototype

  const oldClone = proto.clone;
  proto.clone = function () {
    const $utcOffset = this.utcOffset()
    return oldClone.apply(this, arguments).utcOffset($utcOffset)
  }

  const oldAdd = proto.add;
  proto.add = function () {
    const $utcOffset = this.utcOffset()
    return oldAdd.apply(this, arguments).utcOffset($utcOffset)
  }

  const oldSubtract = proto.subtract;
  proto.subtract = function () {
    const $utcOffset = this.utcOffset()
    return oldSubtract.apply(this, arguments).utcOffset($utcOffset)
  }

  proto.utc = function () {
    return this.utcOffset(0)
  }
  proto.local = function () {
    return this.utcOffset(-tz.LOCAL_TIMEZONE_OFFSET)
  }
  proto.utcOffset = function (arg) {
    if (arg === undefined) {
      const rTZ = this.$d.getTimezoneOffset()
      return rTZ === 0 ? 0 : -rTZ
    }
    if (parseTimezoneOffset(arg) !== null) {
      this.$d.setTimezoneOffset(-parseTimezoneOffset(arg))
      this.init()
    }
    return this
  }
  proto.toDate = function () {
    return new Date(this.$d.getTime())
  }
  proto.isLocal = function () {
    return this.$d.getTimezoneOffset() === tz.LOCAL_TIMEZONE_OFFSET
  }
  proto.isUTC = function () {
    return this.$d.getTimezoneOffset() === 0
  }
  const oldParse= proto.parse;
  proto.parse = function (cfg) {
    oldParse.call(this, cfg)
    const { $d } = this
    const tzOffset = typeof cfg.date === 'string' ? parseTimezoneOffset(cfg.date) : null
    this.$d = new UTCDate($d, /* !tzOffset ? tz.DEFAULT_TIMEZONE_OFFSET : -tzOffset */)
    if (RETURN_LOCAL_INSTANCE) this.local()
    this.init()
  }

  dayjs.utc = function (cfg) {
    const tmpDayjs = this(cfg)
    if (typeof cfg === 'string' && parseTimezoneOffset(cfg) === null) {
      // cfg exclude UTC offset
      tmpDayjs.$d.$timezoneOffset = 0
    }
    return tmpDayjs.utc()
  }

  dayjs.guess = function () {
    let result = tz.DEFAULT_TIMEZONE_OFFSET;
    for (let i = 0; i < tzData.zones.length; i++) {
      const zone = tzData.zones[i];
      const zValues = zone.split('|');
      if (zValues.length >= 3 && tz.DEFAULT_TIMEZONE_OFFSET === zValues[2] * 6) {
        result = zValues[0];
        break;
      }
    }
    return result;
  }

  dayjs.setDefault = function (tzv) {
    if (typeof tzv === 'string') {
      for (let i = 0; i < tzData.zones.length; i++) {
        const zone = tzData.zones[i];
        if (zone.startsWith(tzv)) {
          const zValues = zone.split('|');
          if (zValues.length >= 3) {
            tz.DEFAULT_TIMEZONE_OFFSET = zValues[2] * 6;
            break;
          }
        }
      }
    } else if (typeof tzv === 'number') {
      tz.DEFAULT_TIMEZONE_OFFSET = -tzv;
    }
  }  
}
