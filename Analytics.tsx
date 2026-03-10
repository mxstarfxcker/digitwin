import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const energyData = [
  { month: 'يناير', actual: 4000, predicted: 4100 },
  { month: 'فبراير', actual: 3000, predicted: 3200 },
  { month: 'مارس', actual: 2000, predicted: 2400 },
  { month: 'أبريل', actual: 2780, predicted: 2600 },
  { month: 'مايو', actual: 1890, predicted: 2000 },
  { month: 'يونيو', actual: 2390, predicted: 2500 },
];

const preferenceData = [
  { category: 'إضاءة هادئة', count: 120 },
  { category: 'تكييف بارد', count: 98 },
  { category: 'خدمة سريعة', count: 86 },
  { category: 'إطلالة بحرية', count: 75 },
  { category: 'طعام صحي', count: 65 },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">تحليلات الذكاء الاصطناعي</h1>
        <p className="text-muted-foreground">رؤى معمقة حول أداء الفندق وتفضيلات الضيوف</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Energy Prediction Chart */}
        <Card className="bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>توقعات استهلاك الطاقة (الفعلي vs المتوقع)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="actual" name="الاستهلاك الفعلي" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" name="توقعات AI" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Guest Preferences Chart */}
        <Card className="bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>أكثر التفضيلات شيوعاً</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={preferenceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                <XAxis type="number" stroke="#888888" />
                <YAxis dataKey="category" type="category" width={100} stroke="#888888" />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="count" name="عدد الطلبات" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Model Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">دقة نموذج الطاقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">99.8%</div>
            <p className="text-sm text-muted-foreground mt-2">R² Score (Linear Regression)</p>
          </CardContent>
        </Card>
        
        <Card className="bg-chart-2/5 border-chart-2/20">
          <CardHeader>
            <CardTitle className="text-lg">دقة تصنيف التفضيلات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-chart-2">88.6%</div>
            <p className="text-sm text-muted-foreground mt-2">F1 Score (MARBERTv2)</p>
          </CardContent>
        </Card>

        <Card className="bg-chart-4/5 border-chart-4/20">
          <CardHeader>
            <CardTitle className="text-lg">توفير الطاقة المحقق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-chart-4">18.5%</div>
            <p className="text-sm text-muted-foreground mt-2">مقارنة بالعام الماضي</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
