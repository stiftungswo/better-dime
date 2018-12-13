import moment from 'moment';
import { ApiStore } from '../stores/apiStore';

// these methods are in a store so they can be adjusted depending on the users setting in the future
export class Formatter {
  constructor(private apiStore: ApiStore) {}

  public formatDate = (date: string) => {
    const o = moment(date);
    return o.format('DD.MM.YYYY');
  };

  public formatDuration = (seconds: number, unit: 'h' | 'd' = 'h', showUnit = false) => {
    const renderedUnit = showUnit ? ' ' + unit : '';
    switch (unit) {
      case 'h':
        return Number(seconds / 60).toFixed(1) + renderedUnit;
      case 'd':
        return Number((seconds / 60) * 60).toFixed(1) + renderedUnit;
    }
  };

  public formatCurrency = (amount: number | string | undefined, showUnit = true) =>
    isNaN(Number(amount)) ? '0 CHF' : (Number(amount) / 100).toFixed(2) + (showUnit ? ' CHF' : '');

  public trimString = (str: string) => {
    if (str.length > 150) {
      return str.substring(0, 150) + ' ...';
    } else {
      return str;
    }
  };

  public formatRateEntry = (value: number, factor: number | undefined, unit: string) => {
    if (factor && factor !== 1) {
      return `${Number(value / factor).toFixed(2)} ${unit}`;
    } else {
      return `${Number(value)} ${unit}`;
    }
  };

  public formatTotalWorkHours = (workedMinutes: number) => {
    let workedHoursFormatted = '0:00h';

    if (workedMinutes > 0) {
      const hours = Math.floor(workedMinutes / 60);
      const minutes = Math.floor(workedMinutes % 60);
      workedHoursFormatted = hours + ':' + ('0' + minutes).slice(-2) + 'h';
    }

    return workedHoursFormatted;
  };
}
