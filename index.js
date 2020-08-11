import moment from './moment';

const TIMEZONE = {
	'Asia/Shanghai': 480
};

let DEFAULT_TIMEZONE = -1 * new Date().getTimezoneOffset();

function dayjs(date) {
	const isUTCstr = typeof date === 'string' && date.indexOf('T') > -1;
	return moment.isMoment(date) ? date : moment(date).utcOffset(DEFAULT_TIMEZONE, !isUTCstr);
}

dayjs.setDefault = function(zone) {
	const _zone = TIMEZONE[zone];
	if (_zone !== null && _zone !== undefined) {
		DEFAULT_TIMEZONE = _zone;
	}
};

dayjs.locale = function(name) {
	moment.locale(name);
}

export default dayjs;
