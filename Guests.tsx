import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSimulation } from "@/contexts/SimulationContext";
import { Thermometer, Sun, BrainCircuit, Heart, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Guests() {
  const { rooms, guestCategories } = useSimulation();

  // Filter only occupied rooms
  const occupiedRooms = Object.values(rooms).filter(room => room.status === 'occupied');

  // Calculate sentiment stats
  const sentimentStats = occupiedRooms.reduce((acc, room) => {
    // Simple logic: if temp is close to 22, happy. Else neutral/unhappy
    const diff = Math.abs(room.temperature - 22);
    if (diff <= 1) acc.positive++;
    else if (diff <= 3) acc.neutral++;
    else acc.negative++;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

  const totalOccupied = occupiedRooms.length || 1; // Avoid division by zero

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          سجل تجربة النزيل الحي
        </h1>
        <p className="text-muted-foreground">مراقبة تفاعلية لمدى رضا النزلاء وتدخلات الذكاء الاصطناعي لتحسين إقامتهم</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ACTIVE GUESTS LIST */}
        <Card className="lg:col-span-2 bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" /> قائمة النزلاء الحالية (Live)
            </CardTitle>
            <CardDescription>بيانات حية من الغرف المشغولة حالياً</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {occupiedRooms.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    لا يوجد نزلاء حالياً. قم بتسكين الغرف من صفحة "التوأم الرقمي" لترى البيانات هنا.
                  </div>
                ) : (
                  occupiedRooms.map((room) => {
                    const guestType = guestCategories.find(g => g.id === room.guestType);
                    const isHappy = Math.abs(room.temperature - 22) <= 2;
                    
                    return (
                      <div key={room.id} className="relative overflow-hidden rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all group">
                        {/* AI Intervention Indicator */}
                        <div className="absolute top-0 left-0 bg-purple-500/10 text-purple-400 text-[10px] px-2 py-1 rounded-br-lg border-r border-b border-purple-500/20 flex items-center gap-1">
                          <BrainCircuit className="w-3 h-3" /> تدخل ذكي نشط
                        </div>

                        <div className="p-5 flex flex-col md:flex-row gap-6">
                          {/* Avatar & Basic Info */}
                          <div className="flex items-center gap-4 min-w-[200px]">
                            <Avatar className="w-16 h-16 border-2 border-slate-700 shadow-lg">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${room.id}`} />
                              <AvatarFallback>G</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-bold text-lg text-slate-200">غرفة {room.id}</h3>
                              <p className="text-sm text-blue-400 font-medium">{guestType?.name || 'نزيل عام'}</p>
                              <Badge variant="outline" className={`mt-2 ${isHappy ? 'border-green-500/50 text-green-400' : 'border-yellow-500/50 text-yellow-400'}`}>
                                {isHappy ? 'سعيد جداً' : 'يحتاج انتباه'}
                              </Badge>
                            </div>
                          </div>

                          {/* Real-time Stats */}
                          <div className="flex-1 grid grid-cols-2 gap-4 border-r border-slate-800 pr-6 mr-2">
                            <div className="space-y-1">
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Thermometer className="w-3 h-3" /> الحرارة الحالية
                              </div>
                              <div className="text-xl font-mono font-bold text-slate-200">{room.temperature}°C</div>
                              <div className="text-[10px] text-green-500">المستهدف: 22°C</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Sun className="w-3 h-3" /> الإضاءة
                              </div>
                              <div className="text-xl font-mono font-bold text-slate-200">{room.lighting}%</div>
                              <div className="text-[10px] text-blue-500">وضع: {guestType?.lighting_pref || 'قياسي'}</div>
                            </div>
                          </div>

                          {/* AI Action Log */}
                          <div className="flex-1 bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
                            <div className="text-xs text-purple-400 mb-2 font-medium flex items-center gap-1">
                              <BrainCircuit className="w-3 h-3" /> إجراء النظام الأخير:
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              "تم تعديل إعدادات الغرفة لتناسب تفضيلات <strong>{guestType?.name}</strong>. 
                              تم ضبط الحرارة وتخفيف الإضاءة لضمان الراحة القصوى."
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* SENTIMENT ANALYSIS SIDEBAR */}
        <div className="space-y-6">
          <Card className="bg-slate-950 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" /> مؤشر السعادة العام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">سعيد (Positive)</span>
                    <span className="text-green-400 font-bold">{Math.round((sentimentStats.positive / totalOccupied) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(sentimentStats.positive / totalOccupied) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">محايد (Neutral)</span>
                    <span className="text-yellow-400 font-bold">{Math.round((sentimentStats.neutral / totalOccupied) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: `${(sentimentStats.neutral / totalOccupied) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">غير راضٍ (Negative)</span>
                    <span className="text-red-400 font-bold">{Math.round((sentimentStats.negative / totalOccupied) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${(sentimentStats.negative / totalOccupied) * 100}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" /> توصيات الذكاء الاصطناعي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-400">
                بناءً على تحليل سلوك النزلاء الحاليين، يقترح النظام:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>زيادة التبريد في الطابق الثالث بسبب كثافة نزلاء "Gamers" (أجهزة حرارية).</span>
                </li>
                <li className="flex gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>تفعيل وضع "الهدوء" في الطابق الأول لنزلاء "Medical Wellness".</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
