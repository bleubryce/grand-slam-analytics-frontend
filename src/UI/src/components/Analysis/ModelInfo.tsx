
import React from 'react';
import { CheckCircle } from "lucide-react";

interface ModelInfoProps {
  modelInfo: Record<string, any> | null;
  modelVersion: string;
}

export const ModelInfo: React.FC<ModelInfoProps> = ({ modelInfo, modelVersion }) => {
  return (
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
  );
};

export default ModelInfo;
