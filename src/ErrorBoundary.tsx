import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
          <h1>Something went wrong</h1>
          <p>Reload the app to recover.</p>
        </main>
      );
    }

    return this.props.children;
  }
}
