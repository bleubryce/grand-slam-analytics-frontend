
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Download } from "lucide-react";
import { mlbService } from "@/services/mlbService";

interface PredictionResultsProps {
  predictionResult: any;
  predictionError: Error | null;
  analysisType: 'team' | 'player' | 'game' | 'ml';
  entityId: string;
  modelVersion: string;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({
  predictionResult,
  predictionError,
  analysisType,
  entityId,
  modelVersion
}) => {
  const handleExport = () => {
    if (!predictionResult) return;
    
    // Format the results for export
    const exportData = {
      type: analysisType,
      id: entityId,
      modelVersion,
      timestamp: new Date().toISOString(),
      ...predictionResult
    };
    
    mlbService.exportToExcel([exportData], `${analysisType}-analysis-${entityId}`);
  };

  if (predictionError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {predictionError.message || 'An error occurred during analysis'}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!predictionResult) {
    return null;
  }

  return (
    <div className="mt-4 border rounded-md p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Results</h3>
        <span className="text-sm text-muted-foreground">Model v{modelVersion}</span>
      </div>
      <div className="text-sm">
        <p className="text-muted-foreground mb-2">Analysis completed at {new Date().toLocaleString()}</p>
        <pre className="bg-muted p-2 rounded-md overflow-auto max-h-52">
          {JSON.stringify(predictionResult, null, 2)}
        </pre>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={handleExport} className="flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
      </div>
    </div>
  );
};

export default PredictionResults;
