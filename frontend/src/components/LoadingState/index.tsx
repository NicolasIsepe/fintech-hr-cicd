interface LoadingStateProps {
  label?: string;
}

function LoadingState({ label = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingState;
