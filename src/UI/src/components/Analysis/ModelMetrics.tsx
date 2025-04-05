
import React from 'react';
import { Loader2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface ModelMetricsProps {
  modelMetrics: Record<string, any> | null;
}

export const ModelMetrics: React.FC<ModelMetricsProps> = ({ modelMetrics }) => {
  // Helper function to determine if a metric should be displayed as a percentage
  const isPercentageMetric = (key: string) => {
    return ['accuracy', 'precision', 'recall', 'f1_score', 'r2', 'confidence'].includes(key.toLowerCase());
  };

  // Helper function to get description for common metrics
  const getMetricDescription = (key: string) => {
    const descriptions: Record<string, string> = {
      'accuracy': 'Percentage of correct predictions',
      'precision': 'Ratio of true positives to all predicted positives',
      'recall': 'Ratio of true positives to all actual positives',
      'f1_score': 'Harmonic mean of precision and recall',
      'r2': 'Coefficient of determination (goodness of fit)',
      'mse': 'Mean Squared Error - average of squared differences',
      'rmse': 'Root Mean Squared Error - square root of MSE',
      'mae': 'Mean Absolute Error - average of absolute differences'
    };
    
    return descriptions[key.toLowerCase()] || 'Model performance metric';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Model Performance Metrics</h3>
      
      {modelMetrics ? (
        <div className="space-y-3">
          {Object.entries(modelMetrics).map(([key, value]) => (
            <div key={key} className="p-3 border rounded-md">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-muted-foreground">{key}</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getMetricDescription(key)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-base font-bold">
                  {typeof value === 'number' ? (
                    isPercentageMetric(key) ? 
                      `${(value * 100).toFixed(2)}%` : 
                      value.toFixed(4)
                  ) : JSON.stringify(value)}
                </div>
              </div>
              
              {typeof value === 'number' && isPercentageMetric(key) && (
                <Progress 
                  value={value * 100} 
                  className="h-2"
                />
              )}
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
