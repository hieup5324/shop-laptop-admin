"use client";

import { Progress } from "@/components/ui/progress";

export function TopProducts() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Laptop Gaming MSI</div>
          <div className="text-sm font-medium">89%</div>
        </div>
        <Progress value={89} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Laptop Dell XPS</div>
          <div className="text-sm font-medium">78%</div>
        </div>
        <Progress value={78} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Laptop MacBook Pro</div>
          <div className="text-sm font-medium">65%</div>
        </div>
        <Progress value={65} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Laptop Asus ROG</div>
          <div className="text-sm font-medium">45%</div>
        </div>
        <Progress value={45} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Laptop Lenovo ThinkPad</div>
          <div className="text-sm font-medium">32%</div>
        </div>
        <Progress value={32} className="h-2" />
      </div>
    </div>
  );
}
