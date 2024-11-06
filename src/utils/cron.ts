import CronParser, { CronFields } from 'cron-parser';
import cronstrue from 'cronstrue';
import 'cronstrue/locales/en.min';
import 'cronstrue/locales/zh_CN.min';
import dayjs, { type Dayjs } from 'dayjs';

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export interface ISchedule {
  period: 'everyMonth' | 'everyDay' | 'everyWeek';
  day: number[];
  week: number[];
  time: Dayjs;
}

export function dayToCron(conf: ISchedule) {
  const interval = CronParser.parseExpression('* * * * * *');
  const fields: Mutable<CronFields> = JSON.parse(
    JSON.stringify(interval.fields),
  ); // Fields is immutable
  fields.hour = [conf.time.hour() as any];
  fields.minute = [conf.time.minute() as any];
  fields.second = [conf.time.second() as any];
  if (conf.period === 'everyMonth') {
    // 1-31
    fields.dayOfMonth = conf.day as any;
  } else if (conf.period === 'everyWeek') {
    // 0-7
    fields.dayOfWeek = conf.week as any;
  }
  const modifiedInterval = CronParser.fieldsToExpression(fields);
  return modifiedInterval.stringify(); // "29 8 * * 1,3-7"
}

export function cronToDay(cronStr: string) {
  const interval = CronParser.parseExpression(cronStr);
  const fields: Mutable<CronFields> = interval.fields;
  const conf = {
    period: 'everyDay',
    day: [],
    week: [],
    time: dayjs(`${fields.hour}:${fields.minute}:${fields.second}`, 'HH:mm:ss'),
  };
  if (fields.dayOfWeek.length !== 8) {
    conf.period = 'everyWeek';
    conf.week = fields.dayOfWeek as any;
  } else if (fields.dayOfMonth.length !== 31) {
    conf.period = 'everyMonth';
    conf.day = fields.dayOfMonth as any;
  } else {
    conf.period = 'everyDay';
  }
  return conf;
}

export function cronToText(cronStr: string) {
  return cronstrue.toString(cronStr, {
    locale: 'zh_CN',
    throwExceptionOnParseError: false,
  });
}
