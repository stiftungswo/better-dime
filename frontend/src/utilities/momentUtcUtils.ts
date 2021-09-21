import MomentUtils from '@date-io/moment';

export class MomentUtcUtils extends MomentUtils {
  format(value: any, formatString: string) {
    return this.moment.utc(value).format(formatString);
  }

  parse(value: string, format: string) {
    return this.moment.utc(value, format, true);
  }

  date(value?: any) {
    if (value === null) {
      return this.moment();
    }

    const ret = this.moment.utc(value);

    return ret;
  }
}
