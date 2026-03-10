import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, DollarSign, Leaf, Zap, ArrowUpRight, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
  textColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend, color, textColor }) => (
  <Card className="bg-slate-950 border-slate-800 shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      <p className={`text-xs mt-1 flex items-center ${textColor}`}>
        <TrendingUp className="w-3 h-3 mr-1" /> {trend}
      </p>
    </CardContent>
  </Card>
);

export default function Sustainability() {
  // --- 1. البيانات المحسوبة (من تقرير الجدوى السابق) ---
  const monthlyData = [
    { name: 'يناير', تقليدي: 15400, ذكي: 11274 },
    { name: 'فبراير', تقليدي: 14800, ذكي: 10650 },
    { name: 'مارس', تقليدي: 16200, ذكي: 11900 },
    { name: 'أبريل', تقليدي: 18500, ذكي: 13200 }, // بداية الحر
    { name: 'مايو', تقليدي: 22000, ذكي: 15800 },
    { name: 'يونيو', تقليدي: 25000, ذكي: 17500 }, // ذروة الصيف
  ];

  const investmentData = [
    { month: 'Start', تكلفة_الاستثمار: 46330, العائد_التراكمي: 0 },
    { month: '3 أشهر', تكلفة_الاستثمار: 46330, العائد_التراكمي: 12378 },
    { month: '6 أشهر', تكلفة_الاستثمار: 46330, العائد_التراكمي: 24756 },
    { month: '9 أشهر', تكلفة_الاستثمار: 46330, العائد_التراكمي: 37134 },
    { month: '12 شهر', تكلفة_الاستثمار: 46330, العائد_التراكمي: 49509 }, // نقطة التعادل والربح
    { month: '15 شهر', تكلفة_الاستثمار: 46330, العائد_التراكمي: 61886 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 flex flex-col md:flex-row justify-between items-center shadow-xl gap-6">
        <div className="space-y-2 text-center md:text-right">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            الاستدامة والجدوى الاقتصادية
          </h1>
          <p className="text-slate-400 text-lg">تحليل العائد على الاستثمار (ROI) والأثر البيئي لمشروع التوأم الرقمي</p>
        </div>
        
        <div className="flex gap-3">
          <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500/50 px-4 py-2 text-sm">
            <Leaf className="w-4 h-4 mr-2" /> صديق للبيئة
          </Badge>
          <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-500/50 px-4 py-2 text-sm">
            <DollarSign className="w-4 h-4 mr-2" /> عائد استثماري مرتفع
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="التوفير السنوي المتوقع" 
          value="49,509 ر.ق" 
          icon={<DollarSign className="text-green-400" size={20} />} 
          trend="+30% توفير في الفواتير"
          color="bg-green-900/20"
          textColor="text-green-400"
        />
        <KPICard 
          title="فترة استرداد رأس المال" 
          value="11 شهر" 
          icon={<Calendar className="text-blue-400" size={20} />} 
          trend="أقل من سنة واحدة"
          color="bg-blue-900/20"
          textColor="text-blue-400"
        />
        <KPICard 
          title="تخفيض استهلاك الطاقة" 
          value="34,000 kW" 
          icon={<Zap className="text-yellow-400" size={20} />} 
          trend="سنوياً"
          color="bg-yellow-900/20"
          textColor="text-yellow-400"
        />
        <KPICard 
          title="خفض انبعاثات الكربون" 
          value="14.5 طن" 
          icon={<Leaf className="text-emerald-400" size={20} />} 
          trend="CO2e سنوياً"
          color="bg-emerald-900/20"
          textColor="text-emerald-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Monthly Cost Comparison */}
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">مقارنة تكلفة الطاقة (شهرياً)</CardTitle>
            <CardDescription>مقارنة بين النظام التقليدي ونظام التوأم الرقمي الذكي</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                  cursor={{ fill: '#1e293b' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="تقليدي" fill="#64748b" radius={[4, 4, 0, 0]} name="نظام تقليدي" />
                <Bar dataKey="ذكي" fill="#3b82f6" radius={[4, 4, 0, 0]} name="نظام التوأم الرقمي" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: ROI Break-even Point */}
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">تحليل نقطة التعادل (Break-even Analysis)</CardTitle>
            <CardDescription>النقطة التي تتجاوز فيها التوفيرات التراكمية تكلفة الاستثمار الأولية</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="تكلفة_الاستثمار" stackId="1" stroke="#ef4444" fill="transparent" strokeWidth={2} name="تكلفة المشروع (ثابتة)" />
                <Area type="monotone" dataKey="العائد_التراكمي" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={3} name="التوفير التراكمي" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center text-sm text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
              * يتقاطع المنحنى الأخضر مع الخط الأحمر عند الشهر 11 (نقطة استرداد الأموال)
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Detailed BOM Table */}
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200">تفاصيل تكاليف المشروع (Bill of Materials)</CardTitle>
          <CardDescription>تكلفة الأجهزة والبنية التحتية لـ 50 غرفة فندقية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 rounded-r-lg">العنصر</th>
                  <th className="px-4 py-3">العدد</th>
                  <th className="px-4 py-3">سعر الوحدة ($)</th>
                  <th className="px-4 py-3">الإجمالي ($)</th>
                  <th className="px-4 py-3 rounded-l-lg">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-200">Aqara Hub M2</td>
                  <td className="px-4 py-4 text-slate-300">5</td>
                  <td className="px-4 py-4 text-slate-300">$55</td>
                  <td className="px-4 py-4 text-emerald-400">$275</td>
                  <td className="px-4 py-4 text-slate-400">واحد لكل طابق</td>
                </tr>
                <tr className="bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-200">Aqara Temp & Humidity Sensor</td>
                  <td className="px-4 py-4 text-slate-300">50</td>
                  <td className="px-4 py-4 text-slate-300">$18</td>
                  <td className="px-4 py-4 text-emerald-400">$900</td>
                  <td className="px-4 py-4 text-slate-400">واحد لكل غرفة</td>
                </tr>
                <tr className="bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-200">Aqara Motion Sensor P1</td>
                  <td className="px-4 py-4 text-slate-300">50</td>
                  <td className="px-4 py-4 text-slate-300">$25</td>
                  <td className="px-4 py-4 text-emerald-400">$1,250</td>
                  <td className="px-4 py-4 text-slate-400">كشف التواجد بدقة عالية</td>
                </tr>
                <tr className="bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-200">Sonoff POW Elite (Smart Switch)</td>
                  <td className="px-4 py-4 text-slate-300">50</td>
                  <td className="px-4 py-4 text-slate-300">$15</td>
                  <td className="px-4 py-4 text-emerald-400">$750</td>
                  <td className="px-4 py-4 text-slate-400">التحكم في الإضاءة وقياس الاستهلاك</td>
                </tr>
                <tr className="bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-200">Shelly Plus 1PM (HVAC Control)</td>
                  <td className="px-4 py-4 text-slate-300">50</td>
                  <td className="px-4 py-4 text-slate-300">$22</td>
                  <td className="px-4 py-4 text-emerald-400">$1,100</td>
                  <td className="px-4 py-4 text-slate-400">التحكم في التكييف</td>
                </tr>
                <tr className="bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-200">Raspberry Pi 4 (Local Server)</td>
                  <td className="px-4 py-4 text-slate-300">1</td>
                  <td className="px-4 py-4 text-slate-300">$85</td>
                  <td className="px-4 py-4 text-emerald-400">$85</td>
                  <td className="px-4 py-4 text-slate-400">خادم محلي للنظام</td>
                </tr>
                <tr className="bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-200">تركيب وبرمجة (Labor)</td>
                  <td className="px-4 py-4 text-slate-300">1</td>
                  <td className="px-4 py-4 text-slate-300">$2,000</td>
                  <td className="px-4 py-4 text-emerald-400">$2,000</td>
                  <td className="px-4 py-4 text-slate-400">تكلفة تقديرية</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-900/80 font-bold text-slate-200 border-t border-slate-700">
                <tr>
                  <td className="px-4 py-4" colSpan={3}>الإجمالي الكلي للمشروع</td>
                  <td className="px-4 py-4 text-emerald-400 text-lg">$6,360</td>
                  <td className="px-4 py-4 text-slate-400">(حوالي 23,150 ريال قطري)</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
