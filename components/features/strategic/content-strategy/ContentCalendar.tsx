'use client';

import { Card } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base';
import { Calendar, FileText, TrendingUp } from 'lucide-react';
import type { ContentCalendarItem } from '@/types';

interface ContentCalendarProps {
  items: ContentCalendarItem[];
}

export function ContentCalendar({ items = [] }: ContentCalendarProps) {
  const totalTraffic = items.reduce((sum, item) => sum + (item.estimated_traffic || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="font-medium">Publishing Schedule</span>
        </div>
        <Badge variant="secondary">
          Total Est. Traffic: {totalTraffic.toLocaleString()}
        </Badge>
      </div>

      <div className="space-y-3">
        {items.map((month, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-lg">{month.month}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {month.content_pieces || 0} pieces
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{(month.estimated_traffic || 0).toLocaleString()} traffic
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Focus Clusters:</p>
              <div className="flex flex-wrap gap-2">
                {(month.focus_clusters || []).map((cluster, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {cluster}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Visual progress indicator */}
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Traffic Impact</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: totalTraffic > 0 ? `${Math.min(((month.estimated_traffic || 0) / totalTraffic) * 100, 100)}%` : '0%'
                    }}
                  />
                </div>
                <span className="text-xs font-medium">
                  {totalTraffic > 0 ? (((month.estimated_traffic || 0) / totalTraffic) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Months</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Content</p>
            <p className="text-2xl font-bold">
              {items.reduce((sum, month) => sum + (month.content_pieces || 0), 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Monthly Traffic</p>
            <p className="text-2xl font-bold">
              {items.length > 0 ? Math.round(totalTraffic / items.length).toLocaleString() : 0}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}