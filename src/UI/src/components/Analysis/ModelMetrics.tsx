
import React from 'react';
import { Loader2 } from "lucide-react";

interface ModelMetricsProps {
  modelMetrics: Record<string, any> | null;
}

export const ModelMetrics: React.FC<ModelMetricsProps> = ({ modelMetrics }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Model Performance Metrics</h3>
      
      {modelMetrics ? (
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(modelMetrics).map(([key, value]) => (
            <div key={key} className="p-3 border rounded-md">
              <div className="text-sm font-medium text-muted-foreground">{key}</div>
              <div className="text-2xl font-bold">{typeof value === 'number' ? value.toFixed(4) : JSON.stringify(value)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading metrics...</span>
        </div>
      )}
    </div>
  );
};

export default ModelMetrics;
