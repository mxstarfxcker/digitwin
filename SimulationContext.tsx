import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- TYPES ---
export type GuestType = 
  | "العافية الطبية (Medical Wellness Package)"
  | "الألعاب والتقنية (Gamers & Tech Package)"
  | "صديق للبيئة (Eco-Friendly Package)"
  | "الروحانية والتأمل (Spiritual & Retreat Package)"
  | "متعة التسوق (Shopping Indulgence Package)"
  | "الخصوصية والفخامة (Privacy & Prestige Package)"
  | "الرحالة الرقمي (Digital Nomad Package)"
  | "الرياضة واللياقة (Sports & Fitness Package)"
  | "المستكشف الثقافي (Cultural Explorer Package)"
  | "فن الطهي (Gastronomy Package)";

export interface Room {
  id: string;
  floor: number;
  status: 'vacant' | 'occupied' | 'cleaning';
  temperature: number;
  light_level: number;
  guestType?: string;
  lighting?: number;
  amenities?: string[];
  power?: number;
}

export interface EnergyLog {
  time: string;
  actual_load: number;
  baseline_load: number; // What it would be without AI
  savings: number;
  cost_actual: number; // Added cost
  cost_baseline: number; // Added cost
  cost_savings: number; // Added cost
}

export interface AIDecision {
  id: number;
  timestamp: string; // Renamed from time to match usage
  roomId?: string;   // Added roomId
  event: string;     // Added event (was reason)
  action: string;
  outcome: string;   // Added outcome (was impact)
  details?: string;  // Added details for compatibility
}

export interface GuestCategory {
  id: string;
  name: string;
  temp_pref: number;
  lighting_pref: string;
  floor_pref: number;
}

interface SimulationContextType {
  rooms: Record<string, Room>;
  energyData: EnergyLog[];
  aiLogs: AIDecision[];
  floorIsolation: { 1: boolean; 2: boolean; 3: boolean; 4: boolean; 5: boolean };
  isEmergency: boolean;
  guestCategories: GuestCategory[];
  stats: {
    totalOccupancy: number;
    avgTemp: number;
    totalEnergy: number;
    totalSavings: number;
    totalCostSavings: number; // Added financial stat
    floor1Consumption: number; // Control Group
    floor2Consumption: number; // AI Group
    floor3Consumption: number; // AI Group
    floor4Consumption: number; // AI Group
    floor5Consumption: number; // AI Group
  };
  updateRoom: (id: string, updates: Partial<Room>) => void;
  toggleFloorIsolation: (floor: 1 | 2 | 3 | 4 | 5) => void;
  addGuest: (guestType: string, roomPreference?: string) => void;
  resetSystem: () => void;
  isScenarioMode: boolean;
  setIsScenarioMode: (mode: boolean) => void;
  csvData: any[];
  applyScenario: (index: number) => void;
  selectedScenarioIndex: number | null;
}

// --- CONSTANTS ---
const INITIAL_ROOMS: Record<string, Room> = {};
// Generate 30 rooms (101-106 ... 501-506)
[1, 2, 3, 4, 5].forEach(floor => {
  for (let i = 1; i <= 6; i++) {
    const id = `${floor}0${i}`;
    INITIAL_ROOMS[id] = {
      id,
      floor,
      status: 'vacant',
      temperature: 24,
      light_level: 0,
      lighting: 0
    };
  }
});

// Pre-fill some rooms for demo
INITIAL_ROOMS["101"] = { ...INITIAL_ROOMS["101"], status: "occupied", guestType: "الرياضة واللياقة (Sports & Fitness Package)", temperature: 19, light_level: 80, lighting: 80, amenities: ["أدوات تمرين خفيفة", "ميزان ذكي", "ثلاجة مشروبات صحية"] };
INITIAL_ROOMS["202"] = { ...INITIAL_ROOMS["202"], status: "occupied", guestType: "العافية الطبية (Medical Wellness Package)", temperature: 24, light_level: 50, lighting: 50, amenities: ["سرير مريح/قابل للتعديل", "وسائد طبية", "جهاز تنقية هواء"] };
INITIAL_ROOMS["305"] = { ...INITIAL_ROOMS["305"], status: "occupied", guestType: "الخصوصية والفخامة (Privacy & Prestige Package)", temperature: 21, light_level: 70, lighting: 70, amenities: ["زجاج ذكي للخصوصية", "مدخل خاص", "خزنة آمنة"] };

// Updated GUEST_PROFILES based on hf_clean_full_split_preferences.csv
const GUEST_PROFILES: Record<string, { temp: number, light: number, floor: number, light_desc: string, amenities: string[] }> = {
  "العافية الطبية (Medical Wellness Package)": { 
    temp: 24, 
    light: 50, 
    floor: 1, 
    light_desc: "ناعمة غير مزعجة", 
    amenities: ["سرير مريح/قابل للتعديل", "وسائد طبية", "جهاز تنقية هواء", "مفروشات مضادة للحساسية"] 
  },
  "الألعاب والتقنية (Gamers & Tech Package)": { 
    temp: 20, 
    light: 20, 
    floor: 3, 
    light_desc: "إضاءة RGB خافتة", 
    amenities: ["شاشة ألعاب عالية الدقة", "كرسي ألعاب مريح", "إنترنت فائق السرعة", "عزل صوتي"] 
  },
  "صديق للبيئة (Eco-Friendly Package)": { 
    temp: 25, 
    light: 60, 
    floor: 2, 
    light_desc: "طبيعية", 
    amenities: ["منتجات عضوية", "سلة إعادة تدوير", "نظام توفير مياه", "نباتات داخلية"] 
  },
  "الروحانية والتأمل (Spiritual & Retreat Package)": { 
    temp: 23, 
    light: 40, 
    floor: 3, 
    light_desc: "دافئة وهادئة", 
    amenities: ["سجادة يوغا", "فواحة عطرية", "ركن للتأمل", "نظام صوتي هادئ"] 
  },
  "متعة التسوق (Shopping Indulgence Package)": { 
    temp: 22, 
    light: 80, 
    floor: 2, 
    light_desc: "ساطعة وواضحة", 
    amenities: ["مرآة كبيرة", "خزانة ملابس واسعة", "إضاءة مكياج", "مساحة لتخزين الحقائب"] 
  },
  "الخصوصية والفخامة (Privacy & Prestige Package)": { 
    temp: 21, 
    light: 70, 
    floor: 3, 
    light_desc: "خافتة وفاخرة", 
    amenities: ["زجاج ذكي للخصوصية", "مدخل خاص", "خزنة آمنة", "أثاث فاخر"] 
  },
  "الرحالة الرقمي (Digital Nomad Package)": { 
    temp: 22, 
    light: 90, 
    floor: 2, 
    light_desc: "بيضاء للعمل", 
    amenities: ["مكتب عمل مريح", "شاشة إضافية", "ماكينة قهوة", "مقابس متعددة"] 
  },
  "الرياضة واللياقة (Sports & Fitness Package)": { 
    temp: 19, 
    light: 80, 
    floor: 1, 
    light_desc: "نشطة ومحفزة", 
    amenities: ["أدوات تمرين خفيفة", "ميزان ذكي", "ثلاجة مشروبات صحية", "مساحة للتمدد"] 
  },
  "المستكشف الثقافي (Cultural Explorer Package)": { 
    temp: 23, 
    light: 70, 
    floor: 2, 
    light_desc: "دافئة وتراثية", 
    amenities: ["دليل سياحي رقمي", "ديكور محلي", "كتب عن الثقافة المحلية", "خريطة تفاعلية"] 
  },
  "فن الطهي (Gastronomy Package)": { 
    temp: 22, 
    light: 60, 
    floor: 1, 
    light_desc: "رومانسية", 
    amenities: ["طاولة طعام أنيقة", "أدوات مائدة فاخرة", "ثلاجة مشروبات", "قائمة طعام حصرية"] 
  }
};

// Cost per kWh in USD (approximate Gulf rate)
const COST_PER_KWH = 0.12; // USD per kWh (approximate commercial rate) 

// --- CONTEXT ---
const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Record<string, Room>>(INITIAL_ROOMS);
  const [energyData, setEnergyData] = useState<EnergyLog[]>([]);
  const [aiLogs, setAiLogs] = useState<AIDecision[]>([]);
  const [floorIsolation, setFloorIsolation] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false });
  const [isEmergency, setIsEmergency] = useState(false);
  
  // Floor consumption stats for comparison
  const [floorConsumption, setFloorConsumption] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  // Convert GUEST_PROFILES to array for UI consumption
  const guestCategories: GuestCategory[] = Object.entries(GUEST_PROFILES).map(([name, profile]) => ({
    id: name,
    name,
    temp_pref: profile.temp,
    lighting_pref: profile.light_desc,
    floor_pref: profile.floor
  }));

  // CSV Data State
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvIndex, setCsvIndex] = useState(0);
  const [isScenarioMode, setIsScenarioMode] = useState(false);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number | null>(null);

  // Load CSV Data
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch('/Hotel_Energy_Data.csv');
        const text = await response.text();
        const rows = text.split('\n').slice(1); // Skip header
        const parsedData = rows.map(row => {
          const [timestamp, extTemp, occupancy, energy] = row.split(',');
          return {
            timestamp,
            externalTemp: parseFloat(extTemp),
            occupancy: parseFloat(occupancy),
            energyConsumption: parseFloat(energy)
          };
        }).filter(d => !isNaN(d.energyConsumption));
        setCsvData(parsedData);
      } catch (error) {
        console.error("Failed to load CSV data:", error);
      }
    };
    loadCSV();
  }, []);

  // Simulation Loop driven by CSV
  useEffect(() => {
    if (csvData.length === 0) return;

    // CRITICAL FIX: Do not start interval if in Scenario Mode
    if (isScenarioMode) return;

    const interval = setInterval(() => {
      // SLOWER UPDATE RATE FOR STABILITY (every 3 seconds instead of 1)
      setCsvIndex(prev => (prev + 1) % csvData.length);
      const currentData = csvData[csvIndex];
      
      const now = new Date(currentData.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      // Use CSV data for simulation parameters
      const externalTemp = currentData.externalTemp;
      const targetOccupancy = currentData.occupancy; // 0.0 to 1.0
      
      // Update room occupancy based on targetOccupancy
      // We randomly occupy/vacate rooms to match the target percentage
      const totalRooms = 30;
      const currentOccupiedCount = Object.values(rooms).filter(r => r.status === 'occupied').length;
      const targetOccupiedCount = Math.round(totalRooms * targetOccupancy);
      
          if (currentOccupiedCount < targetOccupiedCount) {
            // Add guests with AUTOMATIC PERSONALIZATION
            const vacantRooms = Object.values(rooms).filter(r => r.status === 'vacant');
            if (vacantRooms.length > 0) {
              const roomToOccupy = vacantRooms[Math.floor(Math.random() * vacantRooms.length)];
              
              // Randomly select a guest type from the dataset
              const guestTypes = Object.keys(GUEST_PROFILES);
              const randomGuestType = guestTypes[Math.floor(Math.random() * guestTypes.length)];
              const profile = GUEST_PROFILES[randomGuestType];

              // Apply personalization immediately
              updateRoom(roomToOccupy.id, { 
                status: 'occupied', 
                guestType: randomGuestType,
                temperature: profile.temp,
                light_level: profile.light,
                lighting: profile.light,
                amenities: profile.amenities
              });

              // Log AI Decision for this automatic assignment
              const isControlFloor = roomToOccupy.id.startsWith('1');
              if (!isControlFloor) {
                const log: AIDecision = {
                  id: Date.now() + Math.random(), // Ensure unique ID
                  timestamp: now,
                  roomId: roomToOccupy.id,
                  event: `تخصيص تلقائي (${randomGuestType.split('(')[0]})`,
                  action: `تجهيز الغرفة ${roomToOccupy.id}`,
                  outcome: `حرارة ${profile.temp}°C | إضاءة ${profile.light}%`,
                  details: `المصدر: محاكاة الإشغال (IoT) | التوفير المتوقع: ${(0.18 * 2).toFixed(2)} ريال`
                };
                setAiLogs(prev => [log, ...prev].slice(0, 50));
              }
            }
          } else if (currentOccupiedCount > targetOccupiedCount) {
        // Remove guests
        const occupiedRooms = Object.values(rooms).filter(r => r.status === 'occupied');
        if (occupiedRooms.length > 0) {
          const roomToVacate = occupiedRooms[Math.floor(Math.random() * occupiedRooms.length)];
          updateRoom(roomToVacate.id, { status: 'vacant', temperature: 24 }); // Reset temp
        }
      }

      // Calculate Energy based on CSV + Simulation Logic
      // We use the CSV 'EnergyConsumption' as the BASELINE (Historical Data)
      // And calculate ACTUAL based on our AI logic savings
      
      let actualLoad = 0;
      let baselineLoad = currentData.energyConsumption; // From CSV
      
      let f1Load = 0;
      let f2Load = 0;
      let f3Load = 0;
      let f4Load = 0;
      let f5Load = 0;

      Object.values(rooms).forEach(room => {
        // Calculate theoretical consumption for this room
        let roomConsumption = 0;
        
        if (room.floor === 1) {
          // Control Group: Inefficient (Standard Operation)
          // Always consumes more regardless of external factors to simulate lack of optimization
          roomConsumption = room.status === 'occupied' ? 10 : 5;
        } else {
          // AI Group: Efficient
          if (floorIsolation[room.floor as 1|2|3|4|5]) {
            roomConsumption = 0.5;
          } else {
            // AI Optimization: 7kW (Smart AC + Adaptive Lighting)
            // Add small random fluctuation for realism (+/- 0.2kW)
            roomConsumption = (room.status === 'occupied' ? 7 : 1) + (Math.random() * 0.4 - 0.2);
          }
        }
        
        // Adjust based on external temp (simulated impact)
        // Floor 1 is MORE affected by external temp due to lack of smart insulation/blind control
        const tempFactor = Math.max(0, externalTemp - 20) * (room.floor === 1 ? 0.8 : 0.4);
        roomConsumption += tempFactor;

        actualLoad += roomConsumption;

        if (room.floor === 1) f1Load += roomConsumption;
        if (room.floor === 2) f2Load += roomConsumption;
        if (room.floor === 3) f3Load += roomConsumption;
        if (room.floor === 4) f4Load += roomConsumption;
        if (room.floor === 5) f5Load += roomConsumption;
      });

      // Scale actualLoad to match the magnitude of CSV data roughly, but showing savings
      // Assuming CSV data is total hotel load in kWh (or similar unit)
      // We'll treat our calculated 'actualLoad' as a ratio to modify the baseline
      
      // AI Logic: We assume our system is 15-25% more efficient than the historical baseline in CSV
      const efficiencyFactor = 0.85; // 15% savings on average
      actualLoad = baselineLoad * efficiencyFactor;

      // Add some dynamic variance based on our simulation state
      // If occupancy is low in simulation but high in CSV, we adjust
      // But we are syncing occupancy, so it should align.
      
      const savings = Math.max(0, baselineLoad - actualLoad);
      const costActual = (actualLoad / 1000) * COST_PER_KWH * 1000; // Adjust scale if needed
      const costBaseline = (baselineLoad / 1000) * COST_PER_KWH * 1000;
      const costSavings = costBaseline - costActual;

      setEnergyData(prev => {
        const newData = [...prev, { 
          time: now, 
          actual_load: parseFloat(actualLoad.toFixed(2)), 
          baseline_load: parseFloat(baselineLoad.toFixed(2)),
          savings: parseFloat(savings.toFixed(2)),
          cost_actual: parseFloat(costActual.toFixed(2)),
          cost_baseline: parseFloat(costBaseline.toFixed(2)),
          cost_savings: parseFloat(costSavings.toFixed(2))
        }];
        return newData.slice(-20);
      });

      setFloorConsumption({ 1: f1Load, 2: f2Load, 3: f3Load, 4: f4Load, 5: f5Load });

    }, 3000); // SLOWER UPDATE: 3 seconds for stability
    return () => clearInterval(interval);
  }, [rooms, floorIsolation, csvData, csvIndex, isScenarioMode]);

  // Actions
  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  };

  const toggleFloorIsolation = (floor: 1 | 2 | 3 | 4 | 5) => {
    // Floor 1 cannot be isolated (Control Group)
    if (floor === 1) {
      // Do not log anything for Floor 1 to keep AI logs clean
      return;
    }

    const newState = !floorIsolation[floor];
    setFloorIsolation(prev => ({ ...prev, [floor]: newState }));
    
    // Log AI Decision
          const log: AIDecision = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            event: newState ? "انخفاض الإشغال" : "طلب تشغيل",
            action: newState ? `عزل الطابق ${floor}` : `تنشيط الطابق ${floor}`,
            outcome: newState ? "توفير طاقة 15%" : "جاهزية قصوى",
            details: newState ? "المصدر: خوارزمية كفاءة الطاقة | التوفير: 45.00 ريال/ساعة" : "المصدر: طلب تشغيل يدوي"
          };
    setAiLogs(prev => [log, ...prev].slice(0, 50));
  };

  const addGuest = (guestType: string, roomPreference?: string) => {
    const profile = GUEST_PROFILES[guestType];
    if (!profile) return;

    // Find best room
    let roomId = roomPreference;
    if (!roomId) {
      // Try preferred floor first
      roomId = Object.values(rooms).find(r => r.floor === profile.floor && r.status === 'vacant')?.id;
      // Fallback to any vacant room
      if (!roomId) roomId = Object.values(rooms).find(r => r.status === 'vacant')?.id;
    }

    if (roomId) {
      updateRoom(roomId, { 
        status: 'occupied', 
        guestType: guestType, 
        temperature: profile.temp, 
        light_level: profile.light,
        lighting: profile.light,
        amenities: profile.amenities
      });

      // Log AI Decision (Only for Experimental Floors 2 & 3)
      const isControlFloor = roomId.startsWith('1');
      
      if (!isControlFloor) {
        const log: AIDecision = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          roomId: roomId,
          event: `وصول نزيل (${guestType.split('(')[0]})`,
          action: `تخصيص الغرفة ${roomId}`,
          outcome: `ضبط ${profile.temp}°C / ${profile.light}%`,
          details: `المصدر: اختيار مباشر/تحليل | التوفير: ${(0.18 * 1.5).toFixed(2)} ريال`
        };
        setAiLogs(prev => [log, ...prev].slice(0, 50));
      }
    }
  };

  const resetSystem = () => {
    setRooms(INITIAL_ROOMS);
    setFloorIsolation({ 1: false, 2: false, 3: false, 4: false, 5: false });
    setIsEmergency(false); 
    setAiLogs([]);
    setIsScenarioMode(false);
    setSelectedScenarioIndex(null);
  };

  const applyScenario = (index: number) => {
    if (!csvData[index]) return;
    
    setSelectedScenarioIndex(index);
    const scenarioData = csvData[index];
    const now = new Date(scenarioData.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    // Apply Scenario Logic
    const targetOccupancy = scenarioData.occupancy;
    const totalRooms = 30;
    const targetOccupiedCount = Math.round(totalRooms * targetOccupancy);

    // POPULATE CHART WITH HISTORICAL CONTEXT
    // Get 10 data points around the selected index to show trends
    const startIndex = Math.max(0, index - 5);
    const endIndex = Math.min(csvData.length, index + 5);
    const contextData = csvData.slice(startIndex, endIndex).map(d => {
       const baseLoad = d.energyConsumption;
       const efficiencyFactor = 0.85; // Simulated AI efficiency
       const actualLoad = baseLoad * efficiencyFactor;
       const savings = baseLoad - actualLoad;
       const costActual = (actualLoad / 1000) * COST_PER_KWH * 1000;
       const costBaseline = (baseLoad / 1000) * COST_PER_KWH * 1000;
       
       return {
          time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          actual_load: parseFloat(actualLoad.toFixed(2)),
          baseline_load: parseFloat(baseLoad.toFixed(2)),
          savings: parseFloat(savings.toFixed(2)),
          cost_actual: parseFloat(costActual.toFixed(2)),
          cost_baseline: parseFloat(costBaseline.toFixed(2)),
          cost_savings: parseFloat((costBaseline - costActual).toFixed(2))
       };
    });
    setEnergyData(contextData as any);
    
    // Create a new rooms object based on current state
    let newRooms = { ...rooms };
    
    const currentOccupied = Object.values(newRooms).filter(r => r.status === 'occupied');
    let occupiedCount = currentOccupied.length;
    
    // If we need more guests
    if (occupiedCount < targetOccupiedCount) {
       const vacantRooms = Object.values(newRooms).filter(r => r.status === 'vacant');
       const needed = targetOccupiedCount - occupiedCount;
       
       for (let i = 0; i < needed && i < vacantRooms.length; i++) {
          const room = vacantRooms[i];
          const guestTypes = Object.keys(GUEST_PROFILES);
          const randomGuestType = guestTypes[Math.floor(Math.random() * guestTypes.length)];
          const profile = GUEST_PROFILES[randomGuestType];
          
          // Determine settings based on floor (Control vs AI)
          const isControlFloor = room.id.startsWith('1');
          
          let appliedTemp = profile.temp;
          let appliedLight = profile.light;
          
          if (isControlFloor) {
             // Control Group (Floor 1): Standard inefficient settings
             // Ignore guest preference optimization, use standard "hotel default"
             appliedTemp = 20; // Standard cold hotel room
             appliedLight = 100; // Full brightness standard
          }

          newRooms[room.id] = {
            ...room,
            status: 'occupied',
            guestType: randomGuestType,
            temperature: appliedTemp,
            light_level: appliedLight,
            lighting: appliedLight,
            amenities: profile.amenities
          };
          
          // Log AI Decision
          if (!isControlFloor) {
             const log: AIDecision = {
                id: Date.now() + Math.random(),
                timestamp: now,
                roomId: room.id,
                event: `سيناريو: تخصيص (${randomGuestType.split('(')[0]})`,
                action: `تطبيق إعدادات السيناريو`,
                outcome: `توفير متوقع: $${(Math.random() * 0.5 + 0.1).toFixed(2)}`,
                details: `حرارة: ${profile.temp}°C | إضاءة: ${profile.light}%`
             };
             setAiLogs(prev => [log, ...prev].slice(0, 50));
          }
       }
    } 
    // If we have too many guests
    else if (occupiedCount > targetOccupiedCount) {
       const occupiedRooms = Object.values(newRooms).filter(r => r.status === 'occupied');
       const toRemove = occupiedCount - targetOccupiedCount;
       
       for (let i = 0; i < toRemove && i < occupiedRooms.length; i++) {
          const room = occupiedRooms[i];
          newRooms[room.id] = {
             ...room,
             status: 'vacant',
             guestType: undefined,
             temperature: 24, // Reset to default
             light_level: 0,
             lighting: 0,
             amenities: undefined
          };
       }
    }
    
    setRooms(newRooms);
  };

  // Derived Stats
  const totalOccupancy = Object.values(rooms).filter(r => r.status === 'occupied').length;
  const avgTemp = Object.values(rooms).reduce((acc, r) => acc + r.temperature, 0) / 18;
  const currentEnergy = energyData[energyData.length - 1] || { actual_load: 0, savings: 0, cost_savings: 0 };

  return (
    <SimulationContext.Provider value={{
      rooms,
      energyData,
      aiLogs,
      floorIsolation,
      isEmergency,
      guestCategories,
      stats: {
        totalOccupancy,
        avgTemp: parseFloat(avgTemp.toFixed(1)),
        totalEnergy: currentEnergy.actual_load,
        totalSavings: currentEnergy.savings,
        totalCostSavings: currentEnergy.cost_savings,
        floor1Consumption: Math.round(floorConsumption[1]),
        floor2Consumption: Math.round(floorConsumption[2]),
        floor3Consumption: Math.round(floorConsumption[3]),
        floor4Consumption: Math.round(floorConsumption[4]),
        floor5Consumption: Math.round(floorConsumption[5])
      },
      updateRoom,
      toggleFloorIsolation,
      addGuest,
      resetSystem,
      isScenarioMode,
      setIsScenarioMode,
      csvData,
      applyScenario,
      selectedScenarioIndex
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error("useSimulation must be used within a SimulationProvider");
  return context;
};
