'use client';

import { AlertCircle, FileText, RefreshCw, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/forms/radio-group';
import { Label } from '@/components/ui/forms/label';
import { formatNumber } from '@/utils/format';

interface UpdateStrategySelectorProps {
  value: 'append' | 'update' | 'replace';
  onChange: (value: 'append' | 'update' | 'replace') => void;
  existingKeywords: number;
}

export function UpdateStrategySelector({ 
  value, 
  onChange, 
  existingKeywords 
}: UpdateStrategySelectorProps) {
  const strategies = [
    {
      value: 'append',
      label: 'Add New Keywords',
      description: 'Add new keywords without affecting existing ones',
      icon: FileText,
      warning: null,
    },
    {
      value: 'update',
      label: 'Update Existing',
      description: 'Update existing keywords and add new ones',
      icon: RefreshCw,
      warning: 'Existing keyword data will be updated with new values',
    },
    {
      value: 'replace',
      label: 'Replace All',
      description: 'Delete all existing keywords and upload new ones',
      icon: Trash2,
      warning: `This will delete all ${formatNumber(existingKeywords)} existing keywords`,
      dangerous: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Strategy</CardTitle>
        <CardDescription>
          You have {formatNumber(existingKeywords)} existing keywords. How should we handle the new data?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={(v: string) => onChange(v as 'append' | 'update' | 'replace')}>
          <div className="space-y-3">
            {strategies.map((strategy) => {
              const Icon = strategy.icon;
              return (
                <label
                  key={strategy.value}
                  htmlFor={strategy.value}
                  className={`
                    relative flex cursor-pointer rounded-lg border p-4 
                    hover:bg-accent/50 transition-colors
                    ${value === strategy.value ? 'border-primary bg-accent/30' : ''}
                  `}
                >
                  <RadioGroupItem
                    value={strategy.value}
                    id={strategy.value}
                    className="sr-only"
                  />
                  <div className="flex flex-1 items-start gap-4">
                    <div className={`
                      p-2 rounded-lg
                      ${strategy.dangerous ? 'bg-destructive/10' : 'bg-primary/10'}
                    `}>
                      <Icon className={`
                        h-4 w-4
                        ${strategy.dangerous ? 'text-destructive' : 'text-primary'}
                      `} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Label 
                          htmlFor={strategy.value} 
                          className="font-medium cursor-pointer"
                        >
                          {strategy.label}
                        </Label>
                        {value === strategy.value && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {strategy.description}
                      </p>
                      {strategy.warning && (
                        <div className={`
                          flex items-start gap-2 mt-2 p-2 rounded text-sm
                          ${strategy.dangerous 
                            ? 'bg-destructive/10 text-destructive' 
                            : 'bg-warning/10 text-warning'
                          }
                        `}>
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span>{strategy.warning}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}