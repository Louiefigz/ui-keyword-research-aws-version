'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import { CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';
import type { ImplementationPhase } from '@/types';

interface ImplementationRoadmapTabProps {
  roadmap: ImplementationPhase[];
}

export function ImplementationRoadmapTab({ roadmap }: ImplementationRoadmapTabProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalTasks = roadmap.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const totalHours = roadmap.reduce((sum, phase) => 
    sum + phase.tasks.reduce((taskSum, task) => taskSum + task.estimated_hours, 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Phases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roadmap.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estimated Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roadmap.reduce((sum, phase) => {
                const duration = parseInt(phase.duration);
                return sum + (isNaN(duration) ? 0 : duration);
              }, 0)} weeks
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Phases */}
      <div className="space-y-6">
        {roadmap.map((phase, phaseIndex) => (
          <Card key={phaseIndex} className={`border-2 ${getPriorityColor(phase.priority)}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Phase {phaseIndex + 1}: {phase.phase}
                    <Badge className={getPriorityColor(phase.priority)}>
                      {phase.priority} priority
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    Duration: {phase.duration}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Dependencies */}
              {phase.dependencies.length > 0 && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Dependencies</span>
                  </div>
                  <ul className="space-y-1">
                    {phase.dependencies.map((dep, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {dep}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tasks */}
              <div>
                <h4 className="font-medium mb-3">Tasks ({phase.tasks.length})</h4>
                <div className="space-y-3">
                  {phase.tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{task.title}</h5>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">
                            {task.estimated_hours}h
                          </Badge>
                        </div>
                      </div>

                      {/* Skills Required */}
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {task.skills_required.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables */}
                      {task.deliverables.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Deliverables:</p>
                          <ul className="space-y-1">
                            {task.deliverables.map((deliverable, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                                <span>{deliverable}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Outcomes */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Expected Outcomes</h4>
                <ul className="space-y-1">
                  {phase.expected_outcomes.map((outcome, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Timeline</CardTitle>
          <CardDescription>
            Visual overview of the implementation phases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roadmap.map((phase, index) => {
              const duration = parseInt(phase.duration) || 4;
              const progress = ((index + 1) / roadmap.length) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{phase.phase}</span>
                    <span className="text-sm text-muted-foreground">{phase.duration}</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                          phase.priority === 'critical' ? 'bg-red-500' :
                          phase.priority === 'high' ? 'bg-orange-500' :
                          phase.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(duration / 12) * 100}%` }}
                      >
                        {phase.tasks.length} tasks
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}