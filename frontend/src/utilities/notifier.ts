import { action, makeObservable, observable } from 'mobx';
import { Variant } from '../layout/Snackbar';

export interface NotifyAction {
  label: string;
  onClick: () => void;
  // Fired when the notification is dismissed via the close button *without* the action having
  // been clicked - e.g. to release a resource (like a blob URL) that onClick would otherwise have
  // taken responsibility for. Not fired when the action itself is clicked (see closeAfterAction).
  onDismiss?: () => void;
}

interface MessageInfo {
  key: number;
  message: string;
  autoHideDuration: number | null;
  variant: Variant;
  action?: NotifyAction;
}

interface NotifyOptions {
  autoHideDuration?: number | null;
  variant?: Variant;
  action?: NotifyAction;
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
    // Errors stay until manually dismissed - unlike info/success, an error can arrive at the same
    // moment as something else visually distracting (e.g. a popup tab opening and closing), so a
    // 6s auto-hide risks the user never actually reading it.
    this.enqueue(message, { variant: 'error', autoHideDuration: null });
  }

  @action
  handleClose = (event: object, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    this.messageInfo.action?.onDismiss?.();
    this.open = false;
  }

  // Used by the action button itself (not the close button): the action's own onClick already
  // took responsibility for any cleanup (e.g. scheduling a delayed revoke), so this closes the
  // notification without also firing onDismiss.
  @action
  closeAfterAction = () => {
    this.open = false;
  }

  @action
  handleExited = () => {
    this.processQueue();
  }

  private enqueue = (message: string, options: NotifyOptions = {}) => {
    const { variant = 'info', autoHideDuration = 6000, action: notifyAction } = options;
    this.queue.push({
      message,
      key: new Date().getTime(),
      variant,
      autoHideDuration,
      action: notifyAction,
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
