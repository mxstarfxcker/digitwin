import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Bell, Shield, Database } from "lucide-react";

export default function Settings() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">إعدادات النظام</h1>
        <p className="text-muted-foreground">تخصيص التفضيلات وإدارة الاتصالات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              المظهر والعرض
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>الوضع الليلي</Label>
                <p className="text-sm text-muted-foreground">تفعيل المظهر الداكن للنظام</p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>جودة الرسوميات ثلاثية الأبعاد</Label>
                <p className="text-sm text-muted-foreground">تعديل دقة التوأم الرقمي للأداء</p>
              </div>
              <select className="bg-background border border-input rounded-md px-3 py-1 text-sm">
                <option>عالية (Ultra)</option>
                <option>متوسطة (Balanced)</option>
                <option>منخفضة (Performance)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              التنبيهات والإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>تنبيهات استهلاك الطاقة</Label>
                <p className="text-sm text-muted-foreground">إشعار عند تجاوز الحد المسموح</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>طلبات الضيوف العاجلة</Label>
                <p className="text-sm text-muted-foreground">تنبيه فوري للطلبات ذات الأولوية</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>تقارير الصيانة التنبؤية</Label>
                <p className="text-sm text-muted-foreground">إرسال تقرير يومي لحالة الأجهزة</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              تكامل البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>عنوان خادم IoT</Label>
              <Input placeholder="mqtt://192.168.1.100:1883" defaultValue="mqtt://iot-hub.local:1883" />
            </div>
            
            <div className="grid gap-2">
              <Label>مفتاح API للذكاء الاصطناعي</Label>
              <Input type="password" value="sk-xxxxxxxxxxxxxxxx" readOnly />
            </div>

            <Button className="w-full mt-2">
              اختبار الاتصال
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              الأمان والصلاحيات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="font-semibold text-yellow-500 mb-1">تحذير أمني</h4>
              <p className="text-sm text-muted-foreground">
                تم رصد 3 محاولات دخول غير مصرح بها خلال 24 ساعة الماضية. يوصى بتغيير كلمة المرور.
              </p>
            </div>
            
            <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10">
              تغيير كلمة مرور المسؤول
            </Button>
            
            <Button variant="outline" className="w-full">
              إدارة المستخدمين والصلاحيات
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
