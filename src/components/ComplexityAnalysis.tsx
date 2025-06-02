
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3, Clock, Database, Zap, TrendingUp } from 'lucide-react';

const ComplexityAnalysis = () => {
  const timeComplexityData = [
    {
      operation: "Enter Car",
      bestCase: "O(1)",
      averageCase: "O(n)",
      worstCase: "O(n)",
      description: "Need to find available slot and check duplicates"
    },
    {
      operation: "Exit Car",
      bestCase: "O(1)",
      averageCase: "O(1)",
      worstCase: "O(1)",
      description: "Direct access using Map data structure"
    },
    {
      operation: "Check if Full",
      bestCase: "O(1)",
      averageCase: "O(n)",
      worstCase: "O(n)",
      description: "Must check all slots to determine availability"
    },
    {
      operation: "Find Car",
      bestCase: "O(1)",
      averageCase: "O(1)",
      worstCase: "O(1)",
      description: "Direct Map lookup by plate number"
    },
    {
      operation: "Get Available Slots",
      bestCase: "O(n)",
      averageCase: "O(n)",
      worstCase: "O(n)",
      description: "Must count all null slots in array"
    },
    {
      operation: "Traverse All Cars",
      bestCase: "O(n)",
      averageCase: "O(n)",
      worstCase: "O(n)",
      description: "Must visit every slot to filter parked cars"
    },
    {
      operation: "Calculate Fee",
      bestCase: "O(1)",
      averageCase: "O(1)",
      worstCase: "O(1)",
      description: "Simple arithmetic operations only"
    }
  ];

  const spaceComplexityData = [
    {
      structure: "Parking Slots Array",
      complexity: "O(n)",
      description: "Fixed array of 50 slots",
      actualSize: "50 elements"
    },
    {
      structure: "Car Registry Map",
      complexity: "O(k)",
      description: "Stores k parked cars (k ≤ n)",
      actualSize: "≤ 50 entries"
    },
    {
      structure: "Entry Time Map",
      complexity: "O(k)",
      description: "Stores entry times for k cars",
      actualSize: "≤ 50 entries"
    },
    {
      structure: "Receipt Object",
      complexity: "O(1)",
      description: "Constant size per receipt",
      actualSize: "Fixed fields"
    }
  ];

  const optimizationStrategies = [
    {
      current: "Linear search for available slots",
      optimized: "Priority queue or bit manipulation",
      improvement: "O(n) → O(log n)",
      implementation: "Use heap to track smallest available slot"
    },
    {
      current: "Array filtering for parked cars",
      optimized: "Maintain separate list of parked cars",
      improvement: "O(n) → O(k)",
      implementation: "Update list on entry/exit operations"
    },
    {
      current: "Full slot checking by iteration",
      optimized: "Counter-based tracking",
      improvement: "O(n) → O(1)",
      implementation: "Maintain available slot counter"
    }
  ];

  const getBadgeColor = (complexity) => {
    if (complexity.includes('O(1)')) return 'bg-green-100 text-green-800';
    if (complexity.includes('O(log')) return 'bg-blue-100 text-blue-800';
    if (complexity.includes('O(n)')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Time Complexity</span>
            </div>
            <p className="text-sm text-gray-600">Analysis of operation speeds</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-5 w-5 text-green-500" />
              <span className="font-medium">Space Complexity</span>
            </div>
            <p className="text-sm text-gray-600">Memory usage patterns</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Optimizations</span>
            </div>
            <p className="text-sm text-gray-600">Performance improvements</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="time" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="time">Time Complexity</TabsTrigger>
          <TabsTrigger value="space">Space Complexity</TabsTrigger>
          <TabsTrigger value="optimization">Optimizations</TabsTrigger>
        </TabsList>

        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Complexity Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operation</TableHead>
                    <TableHead>Best Case</TableHead>
                    <TableHead>Average Case</TableHead>
                    <TableHead>Worst Case</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeComplexityData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.operation}</TableCell>
                      <TableCell>
                        <Badge className={getBadgeColor(item.bestCase)}>
                          {item.bestCase}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getBadgeColor(item.averageCase)}>
                          {item.averageCase}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getBadgeColor(item.worstCase)}>
                          {item.worstCase}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {item.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="space">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Space Complexity Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data Structure</TableHead>
                    <TableHead>Complexity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actual Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spaceComplexityData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.structure}</TableCell>
                      <TableCell>
                        <Badge className={getBadgeColor(item.complexity)}>
                          {item.complexity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.actualSize}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Overall Space Complexity</h4>
                <p className="text-sm text-gray-700">
                  <strong>Total: O(n)</strong> where n = 50 (maximum parking slots)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  The system uses linear space relative to the maximum capacity, 
                  which is efficient for a fixed-size parking lot.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Optimization Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationStrategies.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Strategy {index + 1}</h4>
                      <Badge variant="outline" className="text-green-600">
                        {item.improvement}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-red-600 font-medium">Current: </span>
                        <span className="text-gray-700">{item.current}</span>
                      </div>
                      <div>
                        <span className="text-green-600 font-medium">Optimized: </span>
                        <span className="text-gray-700">{item.optimized}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Implementation: </span>
                      {item.implementation}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Current Implementation Benefits
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Simple and maintainable code structure</li>
                  <li>• O(1) car exit operations using Map lookup</li>
                  <li>• O(1) fee calculation with constant time arithmetic</li>
                  <li>• Minimal memory overhead for 50-slot capacity</li>
                  <li>• Easy debugging and testing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplexityAnalysis;
