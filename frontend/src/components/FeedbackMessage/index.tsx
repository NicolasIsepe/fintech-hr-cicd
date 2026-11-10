interface FeedbackMessageProps {
  type: 'success' | 'error';
  children: string;
}

function FeedbackMessage({ type, children }: FeedbackMessageProps) {
  return (
    <div
      className={`feedback feedback-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {children}
    </div>
  );
}

export default FeedbackMessage;
