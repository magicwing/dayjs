import dayjs from './dayjs';
import dayjsUTC from './plugin/utc/index';
import dayjsAF from './plugin/advancedFormat';
import dayjsIB from './plugin/isBetween';
import dayjsRT from './plugin/relativeTime';
import dayjsMM from './plugin/mergeMoment';
import './zh-cn';
dayjs.locale('zh-cn');
dayjs.extend(dayjsUTC);
dayjs.extend(dayjsAF);
dayjs.extend(dayjsIB);
dayjs.extend(dayjsRT);
dayjs.extend(dayjsMM);

export default dayjs;