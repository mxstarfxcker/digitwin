import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Settings2, Thermometer, Zap, UserCheck, Sun, History, ClipboardList } from "lucide-react";
import { Link } from "wouter";
import RealisticHotelModel from "@/components/RealisticHotelModel";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSimulation } from "@/contexts/SimulationContext";
import guestDataset from '@/data/guest_dataset.json';

export default function DigitalTwin() {
  // Use Global Context
  const { 
    rooms, 
    energyData, 
    floorIsolation, 
    toggleFloorIsolation, 
    addGuest, 
    stats, 
    isEmergency,
    isScenarioMode,
    setIsScenarioMode,
    csvData,
    applyScenario
  } = useSimulation();
  
  // Local UI State
  const [guestInput, setGuestInput] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { toast } = useToast();

  // Handlers
  const handleAnalyzeGuest = () => {
    if (!guestInput) return;
    
    // Advanced matching using the real dataset
    let bestMatch = { type: "Medical Wellness Package", score: 0 };
    const requestWords = guestInput.toLowerCase().split(/\s+/);

    // Helper to map CSV category names to internal keys
    const mapDatasetTypeToInternal = (csvType: string) => {
      const mapping: Record<string, string> = {
        'العافية الطبية': 'Medical Wellness Package',
        'الألعاب والتقنية': 'Gamers & Tech Package',
        'الإقامة البيئية': 'Eco-Friendly Package',
        'التأمل والسكينة': 'Spiritual & Retreat Package',
        'التسوق الفاخر': 'Shopping Indulgence Package',
        'الخصوصية والرفاهية': 'Privacy & Prestige Package',
        'الرحالة الرقمي': 'Digital Nomad Package',
        'الرياضة واللياقة': 'Sports & Fitness Package',
        'العائلة الكبيرة': 'Family & Kids Package',
        'المستكشف الثقافي': 'Cultural Explorer Package',
        'فنون الطهي': 'Gastronomy Package'
      };
      return mapping[csvType] || null;
    };

    // 1. Check exact phrase matches first (High priority)
    for (const [type, phrases] of Object.entries(guestDataset)) {
      if (type === '﻿label') continue; // Skip metadata
      
      // Clean the type name to match our internal keys (remove English part)
      const cleanType = type.split(' (')[0].trim();
      
      // Map dataset types to our internal types if needed
      const mappedType = mapDatasetTypeToInternal(cleanType);
      if (!mappedType) continue;

      for (const phrase of phrases) {
        if (guestInput.includes(phrase)) {
          addGuest(mappedType);
          toast({ title: "تم تحليل الطلب بدقة", description: `تم التعرف على الطلب: ${cleanType}` });
          return; // Immediate match found
        }
      }
    }

    // 2. Keyword scoring (Fallback)
    for (const [type, phrases] of Object.entries(guestDataset)) {
      if (type === '﻿label') continue;
      const cleanType = type.split(' (')[0].trim();
      const mappedType = mapDatasetTypeToInternal(cleanType);
      if (!mappedType) continue;

      let score = 0;
      // Aggregate all words from all phrases for this type to build a "bag of words"
      const typeKeywords = new Set(phrases.join(' ').split(/\s+/));
      
      for (const word of requestWords) {
        if (word.length > 2 && typeKeywords.has(word)) {
          score++;
        }
      }

      if (score > bestMatch.score) {
        bestMatch = { type: mappedType, score };
      }
    }

    // Special fallback for "festival" if not caught by dataset
    if (guestInput.includes("مهرجان") && bestMatch.score === 0) {
        bestMatch = { type: "Cultural Explorer Package", score: 10 };
    }

    addGuest(bestMatch.type);
    toast({ title: "تم تحليل الطلب", description: `تم توجيه النزيل بناءً على التحليل: ${bestMatch.type}` });
  };

  const selectedRoom = selectedRoomId ? rooms[selectedRoomId] : null;

  // Convert rooms object to array for the model
  const roomsArray = Object.values(rooms);
  
  // Convert floorIsolation object to array of isolated floor numbers
  const isolatedFloorsArray = Object.entries(floorIsolation)
    .filter(([_, isIsolated]) => isIsolated)
    .map(([floor, _]) => parseInt(floor));

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-950">
      
      {/* FULL SCREEN 3D MODEL */}
      <div className="absolute inset-0 z-0">
        <RealisticHotelModel 
          rooms={roomsArray.map((r: any) => ({
            id: r.id,
            status: r.status === 'occupied' ? 'occupied' : 
                    r.status === 'cleaning' ? 'cleaning' : 
                    r.status === 'isolated' ? 'isolated' : 'vacant',
            temperature: r.temperature,
            humidity: r.humidity,
            power: r.power
          }))}
          isEmergency={isEmergency} 
          isolatedFloors={isolatedFloorsArray}
          onRoomClick={setSelectedRoomId}
        />
      </div>

      {/* TOP LEFT: LEGACY BUTTON */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/legacy-digital-twin">
          <Button variant="secondary" size="sm" className="gap-2 bg-slate-900/80 backdrop-blur border border-slate-700 hover:bg-slate-800 text-slate-200 shadow-lg">
            <History className="w-4 h-4" />
            عرض النموذج القديم
          </Button>
        </Link>
      </div>

      {/* TOP RIGHT: LEGEND */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-slate-900/80 text-green-400 border-green-500/50 backdrop-blur shadow-lg">فارغ</Badge>
          <Badge variant="outline" className="bg-slate-900/80 text-red-400 border-red-500/50 backdrop-blur shadow-lg">مشغول</Badge>
          <Badge variant="outline" className="bg-slate-900/80 text-yellow-400 border-yellow-500/50 backdrop-blur shadow-lg">تنظيف</Badge>
          <Badge variant="outline" className="bg-slate-900/80 text-gray-400 border-gray-500/50 backdrop-blur shadow-lg">معزول</Badge>
        </div>
        <div className="bg-slate-900/80 backdrop-blur p-2 rounded-lg border border-slate-800 shadow-lg text-xs text-slate-300">
           Left Click + Drag: تدوير | Right Click + Drag: تحريك | Scroll: تكبير
        </div>
      </div>

      {/* BOTTOM LEFT: FLOATING ENERGY PANEL */}
      <div className="absolute bottom-4 left-4 z-10 w-80 flex flex-col gap-2">
        
        {/* SCENARIO CONTROL PANEL */}
        <Card className="bg-slate-900/90 border-slate-700 backdrop-blur shadow-2xl">
          <CardHeader className="p-3 border-b border-slate-800">
             <CardTitle className="flex items-center justify-between text-yellow-400 text-sm">
                <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4" /> وضع المحاكاة (Scenarios)</span>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-slate-400">{isScenarioMode ? "ON" : "OFF"}</span>
                   <div 
                     className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${isScenarioMode ? 'bg-yellow-500' : 'bg-slate-700'}`}
                     onClick={() => setIsScenarioMode(!isScenarioMode)}
                   >
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${isScenarioMode ? 'translate-x-4' : 'translate-x-0'}`} />
                   </div>
                </div>
             </CardTitle>
          </CardHeader>
          {isScenarioMode && (
            <CardContent className="p-3 space-y-2">
               <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">اختر سيناريو (من بيانات CSV)</label>
                  <Select onValueChange={(val) => applyScenario(parseInt(val))}>
                    <SelectTrigger className="h-8 text-xs bg-slate-950/50 border-slate-700">
                      <SelectValue placeholder="اختر توقيت/إشغال..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-200 max-h-60">
                      {csvData.filter((_, i) => i % 6 === 0).slice(0, 20).map((row, i) => (
                        <SelectItem key={i} value={(i * 6).toString()}>
                           {new Date(row.timestamp).toLocaleDateString()} - {new Date(row.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (Occ: {Math.round(row.occupancy * 100)}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
            </CardContent>
          )}
        </Card>

        <Card className="bg-slate-900/90 border-slate-700 backdrop-blur shadow-2xl">
          <CardHeader className="p-3 border-b border-slate-800">
            <CardTitle className="flex items-center justify-between text-blue-400 text-sm">
              <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> محاكي الطاقة (IoT)</span>
              <Badge variant="outline" className="text-[10px] h-5">{isScenarioMode ? "Simulation Mode" : "Live Mode"}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            {/* Live Chart */}
            <div className="h-24 w-full bg-slate-950/50 rounded-lg border border-slate-800/50 p-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '10px' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Line type="monotone" dataKey="actual_load" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={1500} isAnimationActive={true} />
                  <Line type="monotone" dataKey="baseline_load" stroke="#64748b" strokeWidth={1} strokeDasharray="5 5" dot={false} animationDuration={1500} isAnimationActive={true} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">الاستهلاك الحالي</div>
                <div className="text-sm font-bold text-blue-400 font-mono">{stats.totalEnergy} kW</div>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">التوفير المحقق</div>
                <div className="text-sm font-bold text-green-400 font-mono">{stats.totalSavings} kW</div>
              </div>
            </div>

            {/* Floor Isolation Controls */}
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <label className="text-[10px] font-medium text-slate-300 block mb-1">عزل الطوابق (توفير الطاقة)</label>
              <div className="flex gap-1 justify-between">
                {[1, 2, 3, 4, 5].map(floor => (
                  <Button 
                    key={floor}
                    size="sm" 
                    variant={floorIsolation[floor as 1|2|3|4|5] ? "destructive" : "outline"}
                    className={`h-6 text-[10px] px-2 flex-1 ${floorIsolation[floor as 1|2|3|4|5] ? "bg-red-900/50 hover:bg-red-900" : "border-slate-600 hover:bg-slate-800"}`}
                    onClick={() => toggleFloorIsolation(floor as 1|2|3|4|5)}
                    disabled={floor === 1}
                  >
                    {floor === 1 ? "Control" : `F${floor}`}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* BOTTOM RIGHT: FLOATING AI PANEL */}
      <div className="absolute bottom-4 right-4 z-10 w-80 flex flex-col gap-2">
        <Card className="bg-slate-900/90 border-slate-700 backdrop-blur shadow-2xl">
          <CardHeader className="p-3 border-b border-slate-800">
            <CardTitle className="flex items-center justify-between text-purple-400 text-sm">
              <span className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> تخصيص الغرف (AI)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            <div className="space-y-2">
              {/* Method 1: Dropdown Selection */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">اختر نوع النزيل (مباشر)</label>
                <Select onValueChange={(val) => {
                  addGuest(val);
                  toast({ title: "تم التخصيص", description: `تم تطبيق إعدادات: ${val}` });
                }}>
                  <SelectTrigger className="h-8 text-xs bg-slate-950/50 border-slate-700">
                    <SelectValue placeholder="اختر الباقة..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    <SelectItem value="العافية الطبية (Medical Wellness Package)">العافية الطبية</SelectItem>
                    <SelectItem value="الألعاب والتقنية (Gamers & Tech Package)">الألعاب والتقنية</SelectItem>
                    <SelectItem value="صديق للبيئة (Eco-Friendly Package)">صديق للبيئة</SelectItem>
                    <SelectItem value="الروحانية والتأمل (Spiritual & Retreat Package)">الروحانية والتأمل</SelectItem>
                    <SelectItem value="متعة التسوق (Shopping Indulgence Package)">متعة التسوق</SelectItem>
                    <SelectItem value="الخصوصية والفخامة (Privacy & Prestige Package)">الخصوصية والفخامة</SelectItem>
                    <SelectItem value="الرحالة الرقمي (Digital Nomad Package)">الرحالة الرقمي</SelectItem>
                    <SelectItem value="الرياضة واللياقة (Sports & Fitness Package)">الرياضة واللياقة</SelectItem>
                    <SelectItem value="المستكشف الثقافي (Cultural Explorer Package)">المستكشف الثقافي</SelectItem>
                    <SelectItem value="فن الطهي (Gastronomy Package)">فن الطهي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink-0 mx-2 text-[10px] text-slate-500">أو</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Method 2: AI Text Analysis */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">تحليل طلب كتابي (AI)</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="مثال: أريد غرفة هادئة..." 
                    value={guestInput}
                    onChange={(e) => setGuestInput(e.target.value)}
                    className="bg-slate-950/50 border-slate-700 text-xs h-8"
                  />
                  <Button size="sm" onClick={handleAnalyzeGuest} className="bg-purple-600 hover:bg-purple-700 h-8 px-3">
                    تحليل
                  </Button>
                </div>
              </div>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink-0 mx-2 text-[10px] text-slate-500">أو</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Method 3: Survey Link */}
              <Link href="/guest-survey">
                <Button variant="outline" size="sm" className="w-full h-8 text-xs border-dashed border-slate-600 text-slate-400 hover:text-purple-400 hover:border-purple-500">
                  <ClipboardList className="w-3 h-3 mr-2" />
                  بدء استبيان التفضيلات
                </Button>
              </Link>
            </div>

            {/* Selected Room Details */}
            {selectedRoom ? (
              <div className="bg-slate-950/50 rounded-lg border border-slate-800 p-3 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-sm">غرفة {selectedRoom.id}</span>
                  <Badge variant={selectedRoom.status === 'occupied' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                    {selectedRoom.status === 'occupied' ? 'مشغولة' : 'فارغة'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Thermometer className="w-3 h-3" />
                    <span className="text-white">{selectedRoom.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Sun className="w-3 h-3" />
                    <span className="text-white">{selectedRoom.light_level}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Zap className="w-3 h-3" />
                    <span className="text-white">{selectedRoom.lighting}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <UserCheck className="w-3 h-3" />
                    <span className="text-white truncate max-w-[80px]" title={selectedRoom.guestType || "لا يوجد"}>
                      {selectedRoom.guestType ? selectedRoom.guestType.split('(')[0] : "لا يوجد"}
                    </span>
                  </div>
                </div>

                {selectedRoom.amenities && (
                  <div className="pt-1 border-t border-slate-800/50">
                    <div className="text-[10px] text-slate-500 mb-1">التجهيزات الذكية:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedRoom.amenities.map((item, i) => (
                        <span key={i} className="text-[9px] bg-purple-900/30 text-purple-300 px-1 rounded border border-purple-500/20">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-950/30 rounded-lg border border-slate-800/50 p-4 text-center text-xs text-slate-500">
                حدد غرفة من النموذج لعرض التفاصيل والتحكم
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* EMERGENCY OVERLAY */}
      {isEmergency && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-red-500/10 animate-pulse">
          <div className="bg-red-950/90 border-2 border-red-500 text-red-100 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur text-2xl font-bold flex items-center gap-4 animate-bounce">
            <AlertTriangle className="w-8 h-8" />
            حالة طوارئ نشطة - إخلاء فوري!
          </div>
        </div>
      )}

    </div>
  );
}
