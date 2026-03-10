import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Zap, Thermometer, Users, BrainCircuit, ArrowUpRight, ArrowDownRight, Server, History, DollarSign, BarChart3, Maximize2 } from "lucide-react";
// import RealisticHotelModel from "@/components/RealisticHotelModel";
import { useSimulation } from "@/contexts/SimulationContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend, Cell } from 'recharts';
import SensorNetwork from "@/components/SensorNetwork";
import ReportExport from "@/components/ReportExport";
import DataExport from "@/components/DataExport";
import { useState } from "react";

export default function Home() {
  const { stats, energyData, aiLogs, rooms } = useSimulation();


  // Prepare data for Control vs AI comparison chart
  const comparisonData = [
    {
      name: 'الطابق 1 (تقليدي)',
      consumption: stats.floor1Consumption,
      cost: (stats.floor1Consumption / 1000) * 0.12, // 0.12 USD per kWh
      fill: '#ef4444', // Red for high consumption
    },
    {
      name: 'الطابق 2 (ذكي)',
      consumption: stats.floor2Consumption,
      cost: (stats.floor2Consumption / 1000) * 0.12,
      fill: '#22c55e', // Green for efficiency
    },
    {
      name: 'الطابق 3 (ذكي)',
      consumption: stats.floor3Consumption,
      cost: (stats.floor3Consumption / 1000) * 0.12,
      fill: '#3b82f6', // Blue for efficiency
    }
  ];

  return (
    <div id="dashboard-container" className="p-6 space-y-6 max-w-[1600px] mx-auto">
      


      {/* HERO SECTION - DASHBOARD HEADER */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 flex flex-col md:flex-row justify-between items-center shadow-xl gap-6">
        <div className="space-y-2 text-center md:text-right">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            مركز القيادة والتحكم
          </h1>
          <p className="text-slate-400 text-lg">نظام التوأم الرقمي للفندق الذكي - لوحة القيادة التحليلية</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
          <div className="bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800 flex flex-col items-center">
            <div className="text-sm text-slate-400 mb-1">حالة النظام</div>
            <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500/50 px-3 py-1">
              <Activity className="w-3 h-3 mr-2 animate-pulse" /> متصل
            </Badge>
          </div>
          <div className="bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800 flex flex-col items-center">
            <div className="text-sm text-slate-400 mb-1">كفاءة الطاقة</div>
            <div className="text-xl font-bold text-blue-400">94%</div>
          </div>
          <div className="flex flex-col gap-2">
            <DataExport />
            <ReportExport />

          </div>
        </div>
      </div>

      {/* MAIN METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">استهلاك الطاقة الحالي</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalEnergy} kW</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <ArrowDownRight className="w-3 h-3 mr-1" /> تم توفير {stats.totalSavings} kW
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">التوفير المادي (اليوم)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats.totalCostSavings.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">بناءً على تعرفة $0.12/kWh</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">نسبة الإشغال</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round((stats.totalOccupancy / 18) * 100)}%</div>
            <p className="text-xs text-slate-500 mt-1">{stats.totalOccupancy} غرف مشغولة من 18</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">قرارات الذكاء الاصطناعي</CardTitle>
            <BrainCircuit className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{aiLogs.length}</div>
            <p className="text-xs text-purple-400 mt-1">قرار تم اتخاذه اليوم</p>
          </CardContent>
        </Card>
      </div>

      {/* COMPARATIVE ANALYTICS SECTION (CONTROL vs AI) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Comparison */}
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-400" /> مقارنة الأداء: التقليدي vs الذكي
            </CardTitle>
            <CardDescription>مقارنة مباشرة بين الطابق الضابط (1) والطوابق الذكية (2 & 3)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val}kW`} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                  <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(value: number) => [`${value} kW`, 'الاستهلاك']}
                  />
                  <Bar dataKey="consumption" radius={[0, 4, 4, 0]} barSize={32}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Financial Table */}
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" /> التحليل المالي (التكلفة والتوفير)
            </CardTitle>
            <CardDescription>حساب التكلفة بناءً على متوسط سعر الكهرباء التجاري ($0.12/kWh)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 rounded-r-lg">الطابق / النظام</th>
                    <th className="px-4 py-3">الاستهلاك (kW)</th>
                    <th className="px-4 py-3">التكلفة ($)</th>
                    <th className="px-4 py-3 rounded-l-lg">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="bg-slate-900/20">
                    <td className="px-4 py-4 font-medium text-slate-200">الطابق 1 (تقليدي)</td>
                    <td className="px-4 py-4 text-red-400">{stats.floor1Consumption}</td>
                    <td className="px-4 py-4 text-slate-300">${((stats.floor1Consumption / 1000) * 0.12).toFixed(4)}</td>
                    <td className="px-4 py-4"><Badge variant="outline" className="border-red-500 text-red-500">عينة ضابطة</Badge></td>
                  </tr>
                  <tr className="bg-slate-900/20">
                    <td className="px-4 py-4 font-medium text-slate-200">الطابق 2 (ذكي)</td>
                    <td className="px-4 py-4 text-green-400">{stats.floor2Consumption}</td>
                    <td className="px-4 py-4 text-slate-300">${((stats.floor2Consumption / 1000) * 0.12).toFixed(4)}</td>
                    <td className="px-4 py-4"><Badge variant="outline" className="border-green-500 text-green-500">فعال</Badge></td>
                  </tr>
                  <tr className="bg-slate-900/20">
                    <td className="px-4 py-4 font-medium text-slate-200">الطابق 3 (ذكي)</td>
                    <td className="px-4 py-4 text-blue-400">{stats.floor3Consumption}</td>
                    <td className="px-4 py-4 text-slate-300">${((stats.floor3Consumption / 1000) * 0.12).toFixed(4)}</td>
                    <td className="px-4 py-4"><Badge variant="outline" className="border-blue-500 text-blue-500">فعال</Badge></td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-900/80 font-bold text-slate-200">
                  <tr>
                    <td className="px-4 py-3">الإجمالي</td>
                    <td className="px-4 py-3">{stats.totalEnergy}</td>
                    <td className="px-4 py-3">${((stats.totalEnergy / 1000) * 0.12).toFixed(4)}</td>
                    <td className="px-4 py-3 text-green-400">توفير: ${stats.totalCostSavings.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SENSOR NETWORK REPORT */}
      <SensorNetwork />

      {/* CENTRAL ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. ENERGY ANALYSIS (BEFORE vs AFTER) */}
        <Card className="lg:col-span-2 bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" /> تحليل كفاءة الطاقة (قبل vs بعد)
            </CardTitle>
            <CardDescription>مقارنة حية بين الاستهلاك التقليدي والاستهلاك المحسن بالذكاء الاصطناعي</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyData}>
                  {/* Gradients removed for PDF export compatibility */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kW`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="baseline_load" name="الاستهلاك التقليدي" stroke="#64748b" fillOpacity={0.1} fill="#64748b" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="actual_load" name="الاستهلاك الذكي (الحالي)" stroke="#3b82f6" fillOpacity={0.3} fill="#3b82f6" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. AI DECISION LOG (SENSOR -> ACTION) */}
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-orange-400" /> سجل قرارات الذكاء الاصطناعي (Sensor-to-Action Log)
            </CardTitle>
            <CardDescription>تتبع حي لكيفية استجابة النظام لقراءات الحساسات</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {aiLogs.length === 0 ? (
                  <div className="text-center text-slate-500 py-10">لا توجد قرارات مسجلة بعد. ابدأ المحاكاة لتوليد البيانات.</div>
                ) : (
                  aiLogs
                    .filter(log => !log.action.includes('الطابق 1') && !log.action.includes('101') && !log.action.includes('102') && !log.action.includes('103') && !log.action.includes('104') && !log.action.includes('105') && !log.action.includes('106'))
                    .map((log) => (
                    <div key={log.id} className="flex gap-4 items-start p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:bg-slate-900 transition-colors">
                      <div className="mt-1 bg-slate-800 p-2 rounded-full">
                        <BrainCircuit className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-200">{log.action}</span>
                          <span className="text-xs text-slate-500 font-mono">{log.timestamp}</span>
                        </div>
                        <div className="text-sm text-slate-400">
                          <span className="text-blue-400 font-medium">الحدث:</span> {log.event}
                        </div>
                        <div className="text-xs text-green-500 mt-1 flex items-center">
                          <ArrowUpRight className="w-3 h-3 mr-1" /> النتيجة: {log.outcome}
                        </div>
                        {log.details && (
                          <div className="text-[10px] text-slate-500 mt-1 border-t border-slate-800 pt-1">
                            {log.details}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
