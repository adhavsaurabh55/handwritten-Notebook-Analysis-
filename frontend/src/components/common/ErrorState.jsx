import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  error,
  onRetry,
  fullPage = false,
  className = '',
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center text-center px-4 py-12 ${className}`}>
      <div className="h-16 w-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md">{message}</p>
      {error && process.env.NODE_ENV === 'development' && (
        <pre className="mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 max-w-md text-left overflow-auto">
          {error.message || error.toString()}
        </pre>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={onRetry} className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export default ErrorState;

