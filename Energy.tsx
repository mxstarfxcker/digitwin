import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Sun, Wind, Battery } from "lucide-react";

export default function Energy() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">إدارة الطاقة المستدامة</h1>
        <p className="text-muted-foreground">مراقبة وتحكم في مصادر الطاقة واستهلاكها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الطاقة الشمسية</CardTitle>
            <Sun className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450 kWh</div>
            <p className="text-xs text-muted-foreground">إنتاج اليوم</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">طاقة الرياح</CardTitle>
            <Wind className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120 kWh</div>
            <p className="text-xs text-muted-foreground">إنتاج اليوم</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تخزين البطاريات</CardTitle>
            <Battery className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">مشحونة بالكامل</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الشبكة العامة</CardTitle>
            <Zap className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,200 kWh</div>
            <p className="text-xs text-muted-foreground">استهلاك اليوم</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>توزيع الأحمال حسب المنطقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "الغرف والأجنحة", value: 45, color: "bg-primary" },
                { name: "المطاعم والمطابخ", value: 25, color: "bg-chart-2" },
                { name: "المرافق الترفيهية", value: 15, color: "bg-chart-3" },
                { name: "الإضاءة الخارجية", value: 10, color: "bg-chart-4" },
                { name: "أخرى", value: 5, color: "bg-chart-5" },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-bold">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>حالة الأنظمة الذكية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "نظام التكييف المركزي (HVAC)", status: "يعمل بكفاءة", color: "text-green-500" },
              { name: "الإضاءة الذكية", status: "وضع التوفير", color: "text-blue-500" },
              { name: "إدارة المياه", status: "تحذير تسرب طفيف", color: "text-yellow-500" },
              { name: "المصاعد الذكية", status: "يعمل بكفاءة", color: "text-green-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                <span className="font-medium">{item.name}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
