import { action, makeObservable, observable } from 'mobx';
import { Variant } from '../layout/Snackbar';

interface MessageInfo {
  key: number;
  message: string;
  autoHideDuration: number | null;
  variant: Variant;
}

interface NotifyOptions {
  autoHideDuration?: number | null;
  variant?: Variant;
}

export class Notifier {
  @observable
  open = false;

  @observable
  messageInfo: MessageInfo = {
    key: 0,
    autoHideDuration: null,
    message: '',
    variant: 'info',
  };

  queue: MessageInfo[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  info = (message: string, options: NotifyOptions = {}) => {
    this.enqueue(message, options);
  }

  @action
  success = (message: string) => {
    this.enqueue(message, { variant: 'success' });
  }

  @action
  error = (message: string) => {
    this.enqueue(message, { variant: 'error' });
  }

  @action
  handleClose = (event: object, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    this.open = false;
  }

  @action
  handleExited = () => {
    this.processQueue();
  }

  private enqueue = (message: string, { variant = 'info', autoHideDuration = 6000 }: NotifyOptions = {}) => {
    this.queue.push({
      message,
      key: new Date().getTime(),
      variant,
      autoHideDuration,
    });

    if (this.open) {
      // immediately begin dismissing current message
      // to start showing new one
      this.open = false;
    }
    this.processQueue();
  }

  private processQueue = () => {
    if (this.queue.length > 0) {
      this.messageInfo = this.queue.shift()!;
      this.open = true;
    }
  }
}
