import * as React from 'react';
import { captureException } from './helpers';

// tslint:disable-next-line:no-empty-interface
interface Props {}
interface State {
  error: Error | null;
  errorInfo: { componentStack?: {} };
}
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: {} };
  }

  componentDidCatch(error: Error | null, errorInfo: object) {
    // Catch errors in any components below and re-render with error message
    this.setState({ error, errorInfo });
    captureException(error);
  }

  render() {
    if (this.state.error) {
      // Error path
      return (
        <div>
          <h2>Da ist etwas schiefgelaufen</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
