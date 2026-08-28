import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({ message = 'An unexpected error occurred while processing.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50/50 border border-red-200 rounded-xl text-center gap-3">
      <AlertTriangle className="w-10 h-10 text-red-500" />
      <div>
        <h4 className="font-bold text-slate-800 text-base">Unable to Load Data</h4>
        <p className="text-xs text-slate-600 max-w-md mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 mt-2">
          <RefreshCw className="w-3.5 h-3.5" /> Retry Request
        </Button>
      )}
    </div>
  );
}
