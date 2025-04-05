
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { useModelAnalysis } from "@/hooks/useModelAnalysis";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AnalysisForm from "./AnalysisForm";
import PredictionResults from "./PredictionResults";
import ModelMetrics from "./ModelMetrics";
import ModelInfo from "./ModelInfo";

export const ModelAnalysisPanel: React.FC<{ className?: string }> = ({ className }) => {
  const [analysisType, setAnalysisType] = useState<'team' | 'player' | 'game' | 'ml'>('team');
  const [entityId, setEntityId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('run');
  
  const { 
    isModelEnabled,
    modelVersion,
    modelInfo,
    modelMetrics,
    runPrediction,
    isPredicting,
    predictionResult,
    predictionError,
  } = useModelAnalysis();

  const handleRunAnalysis = () => {
    if (!entityId) return;
    
    const id = parseInt(entityId);
    if (isNaN(id)) return;
    
    runPrediction({ 
      modelType: analysisType,
      inputData: { id, type: analysisType }
    });
  };

  if (!isModelEnabled) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Model Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Model analysis is currently disabled in system configuration.
              Please enable it in the environment settings to use this feature.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Advanced Model Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="run">Run Analysis</TabsTrigger>
            <TabsTrigger value="metrics">Model Metrics</TabsTrigger>
            <TabsTrigger value="info">Model Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="run" className="space-y-4 mt-4">
            <AnalysisForm 
              analysisType={analysisType}
              setAnalysisType={setAnalysisType}
              entityId={entityId}
              setEntityId={setEntityId}
              isPredicting={isPredicting}
              handleRunAnalysis={handleRunAnalysis}
            />
            
            <PredictionResults 
              predictionResult={predictionResult}
              predictionError={predictionError}
              analysisType={analysisType}
              entityId={entityId}
              modelVersion={modelVersion}
            />
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-4">
            <ModelMetrics modelMetrics={modelMetrics} />
          </TabsContent>
          
          <TabsContent value="info" className="mt-4">
            <ModelInfo modelInfo={modelInfo} modelVersion={modelVersion} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModelAnalysisPanel;
