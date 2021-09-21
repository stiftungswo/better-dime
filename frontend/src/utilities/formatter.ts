import moment, { Moment } from 'moment';
import { ApiStore } from '../stores/apiStore';

type MaskFunction = (value: any) => any; // tslint:disable-line:no-any ; Couldn't find any sensible type definitions for this

// these methods are in a store so they can be adjusted depending on the users setting in the future
export class Formatter {
  constructor(private apiStore: ApiStore) {}

  get userDateFormat(): { format: string; mask: MaskFunction } {
    return {
      format: 'DD.MM.YYYY',
      mask: value => (value ? [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/] : []),
    };
  }

  formatDate = (date: string | Moment) => {
    const o = moment.utc(date);
    return o.format(this.userDateFormat.format);
  }

  formatDuration = (seconds: number, unit: 'h' | 'd' = 'h', showUnit = false) => {
    const renderedUnit = showUnit ? ' ' + unit : '';
    switch (unit) {
      case 'h':
        return Number(seconds / 60).toFixed(1) + renderedUnit;
      case 'd':
        return Number((seconds / 60) * 60).toFixed(1) + renderedUnit;
    }
  }

  formatCurrency = (amount: number | string | undefined, showUnit = true) =>
    isNaN(Number(amount)) ? '0 CHF' : (Number(amount) / 100).toFixed(2) + (showUnit ? ' CHF' : '')

  trimString = (str: string) => {
    if (str.length > 150) {
      return str.substring(0, 150) + ' ...';
    } else {
      return str;
    }
  }

  formatRateEntry = (value: number, factor: number | undefined, unit: string) => {
    if (factor && factor !== 1) {
      return `${Number(value / factor).toFixed(2)} ${unit}`;
    } else {
      return `${Number(value)} ${unit}`;
    }
  }

  formatTotalWorkHours = (workedMinutes: number) => {
    let workedHoursFormatted = '0:00h';

    if (workedMinutes > 0) {
      const hours = Math.floor(workedMinutes / 60);
      const minutes = Math.floor(workedMinutes % 60);
      workedHoursFormatted = hours + ':' + ('0' + minutes).slice(-2) + 'h';
    }

    return workedHoursFormatted;
  }
}
