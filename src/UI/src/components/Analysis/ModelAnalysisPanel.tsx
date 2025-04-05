
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { useModelAnalysis } from "@/hooks/useModelAnalysis";
import { mlbService } from "@/services/mlbService";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    resetPrediction
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="analysis-type">Analysis Type</Label>
                <Select 
                  value={analysisType} 
                  onValueChange={(value) => setAnalysisType(value as any)}
                >
                  <SelectTrigger id="analysis-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team Analysis</SelectItem>
                    <SelectItem value="player">Player Analysis</SelectItem>
                    <SelectItem value="game">Game Analysis</SelectItem>
                    <SelectItem value="ml">ML Prediction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity-id">ID</Label>
                <Input
                  id="entity-id"
                  type="number"
                  placeholder="Enter ID"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleRunAnalysis} 
              disabled={isPredicting || !entityId} 
              className="w-full"
            >
              {isPredicting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPredicting ? 'Running Analysis...' : 'Run Analysis'}
            </Button>
            
            {predictionError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {predictionError.message || 'An error occurred during analysis'}
                </AlertDescription>
              </Alert>
            )}
            
            {predictionResult && (
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
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-4">
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
          </TabsContent>
          
          <TabsContent value="info" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Model Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-md">
                  <div className="text-sm font-medium text-muted-foreground">Version</div>
                  <div className="text-2xl font-bold">{modelVersion}</div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">Active</span>
                  </div>
                </div>
                
                {modelInfo && Object.entries(modelInfo).map(([key, value]) => (
                  key !== 'version' && (
                    <div key={key} className="p-3 border rounded-md">
                      <div className="text-sm font-medium text-muted-foreground">{key}</div>
                      <div className="text-xl font-bold">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      {predictionResult && activeTab === 'run' && (
        <CardFooter className="justify-end">
          <Button variant="outline" onClick={handleExport} className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ModelAnalysisPanel;
