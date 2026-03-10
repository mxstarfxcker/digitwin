import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import HotelModel from "@/components/HotelModel";
import { useSimulation } from "@/contexts/SimulationContext";
import { Link } from "wouter";

export default function LegacyDigitalTwin() {
  const { rooms, floorIsolation, toggleFloorIsolation, resetSystem, isEmergency } = useSimulation();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const roomsArray = Object.values(rooms);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] p-4 gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-400">التوأم الرقمي (النسخة القديمة)</h1>
        <Link href="/digital-twin">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            العودة للنسخة الحديثة
          </Button>
        </Link>
      </div>

      {/* TOP SECTION: Old 3D Model */}
      <div className="h-[70vh] relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Badge variant="outline" className="bg-black/50 text-green-400 border-green-500 backdrop-blur">فارغ</Badge>
          <Badge variant="outline" className="bg-black/50 text-red-400 border-red-500 backdrop-blur">مشغول</Badge>
          <Badge variant="outline" className="bg-black/50 text-yellow-400 border-yellow-500 backdrop-blur">تنظيف</Badge>
        </div>

        <div className="flex-1 relative">
          <HotelModel 
            roomData={roomsArray} 
            isEmergency={isEmergency} 
            floorIsolation={floorIsolation}
            onRoomClick={setSelectedRoomId}
          />
        </div>

        {/* Emergency Reset Bar */}
        <div className="p-2 bg-slate-900 border-t border-slate-800 flex justify-center">
          <Button variant="destructive" size="sm" onClick={resetSystem} className="w-full max-w-xs">
            <AlertTriangle className="w-4 h-4 ml-2" /> إعادة ضبط النظام
          </Button>
        </div>
      </div>

      <div className="text-center text-slate-500 text-sm">
        هذه الصفحة تعرض النموذج القديم لأغراض المقارنة والأرشفة.
      </div>
    </div>
  );
}
