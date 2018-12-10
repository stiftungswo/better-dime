import { OptionsObject } from 'notistack';

export class Notifier {
  constructor(private enqueueSnackbar: (message: string, options?: OptionsObject) => void) {}

  public info = (message: string, options: OptionsObject = {}) => {
    this.enqueueSnackbar(message, { variant: 'info', ...options });
  };

  public success = (message: string) => {
    this.enqueueSnackbar(message, { variant: 'success' });
  };

  public error = (message: string) => {
    this.enqueueSnackbar(message, { variant: 'error' });
  };
}
