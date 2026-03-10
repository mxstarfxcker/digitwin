import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const app = express();
app.use(cors());
app.use(express.json());

// --- Data Structures ---

// Guest Data
interface GuestRecord {
  guest_id: string;
  age: string;
  gender: string;
  nationality: string;
  stay_duration: string;
  booking_channel: string;
  room_type: string;
  special_requests: string;
  season: string;
  purpose_of_travel: string;
}

let guestData: GuestRecord[] = [];

// Energy Data
interface EnergyRecord {
  Timestamp: string;
  ExternalTemp: number;
  Occupancy: number;
  EnergyConsumption: number;
}

let energyData: EnergyRecord[] = [];

// IoT State
interface RoomState {
  id: string;
  status: 'vacant' | 'occupied' | 'cleaning';
  temperature: number;
  humidity: number;
  co2: number;
  light_level: number;
  motion: boolean;
  hvac_active: boolean;
  window_open: boolean;
  target_temp: number;
  guest_type?: 'business' | 'relaxation' | 'medical' | 'family';
  floor: number; // 1, 2, or 3
}

// Initialize 18 Rooms (3 Floors x 6 Rooms)
const rooms: Record<string, RoomState> = {};
const floors = [1, 2, 3];
const roomsPerFloor = 6;

floors.forEach(floor => {
  for (let i = 1; i <= roomsPerFloor; i++) {
    const roomId = `${floor}0${i}`; // e.g., 101, 102... 306
    rooms[roomId] = {
      id: roomId,
      status: 'vacant',
      temperature: 24,
      humidity: 45,
      co2: 400,
      light_level: 0,
      motion: false,
      hvac_active: false,
      window_open: false,
      target_temp: 24,
      floor: floor
    };
  }
});

// Floor Isolation State
const floorIsolation = {
  1: false,
  2: false,
  3: false
};

// --- Load Data ---

// Load Guest Data
const guestCsvPath = path.join(process.cwd(), "..", "upload", "hf_clean_full.csv");
if (fs.existsSync(guestCsvPath)) {
  fs.createReadStream(guestCsvPath)
    .pipe(csv())
    .on("data", (data) => guestData.push(data))
    .on("end", () => console.log(`Loaded ${guestData.length} guest records.`));
} else {
  console.warn("Guest CSV not found at:", guestCsvPath);
}

// Load Energy Data
const energyCsvPath = path.join(process.cwd(), "..", "upload", "Hotel_Energy_Data.csv");
if (fs.existsSync(energyCsvPath)) {
  fs.createReadStream(energyCsvPath)
    .pipe(csv())
    .on("data", (data) => {
      energyData.push({
        Timestamp: data.Timestamp,
        ExternalTemp: parseFloat(data.ExternalTemp),
        Occupancy: parseFloat(data.Occupancy),
        EnergyConsumption: parseFloat(data.EnergyConsumption)
      });
    })
    .on("end", () => console.log(`Loaded ${energyData.length} energy records.`));
} else {
  console.warn("Energy CSV not found at:", energyCsvPath);
}

// --- Helper Functions ---

function getRecommendations(purpose: string): string[] {
  const p = purpose.toLowerCase();
  if (p.includes('business') || p.includes('work')) {
    return [
      "مركز الأعمال (Business Center) - الطابق 1",
      "خدمة الإنترنت فائق السرعة (Premium Wi-Fi)",
      "خدمة الغرف السريعة (Express Room Service)"
    ];
  } else if (p.includes('relax') || p.includes('leisure')) {
    return [
      "السبا والتدليك (Spa & Massage) - الطابق الأرضي",
      "المسبح الخارجي (Outdoor Pool)",
      "قائمة الوسائد المريحة (Pillow Menu)"
    ];
  } else if (p.includes('sport') || p.includes('gym') || p.includes('fitness')) {
    return [
      "الصالة الرياضية (Gym) - الطابق 1",
      "مسار الجري الخارجي (Jogging Track)",
      "قائمة الطعام الصحي (Healthy Menu)"
    ];
  } else if (p.includes('family')) {
    return [
      "نادي الأطفال (Kids Club) - الطابق الأرضي",
      "المسبح العائلي (Family Pool)",
      "خدمة مجالسة الأطفال (Babysitting)"
    ];
  }
  return ["المطعم الرئيسي - الطابق الأرضي", "خدمة الاستقبال 24/7"];
}

function assignRoom(floor: number): string | null {
  // Find first vacant room on the specified floor
  for (let i = 1; i <= roomsPerFloor; i++) {
    const roomId = `${floor}0${i}`;
    if (rooms[roomId].status === 'vacant') {
      return roomId;
    }
  }
  // If floor full, try any floor
  for (const id in rooms) {
    if (rooms[id].status === 'vacant') return id;
  }
  return null;
}

// --- API Endpoints ---

// 1. Guest Analysis & Check-in
app.post("/api/analyze-guest", (req, res) => {
  try {
    const { request } = req.body;
    if (!request) {
      res.status(400).json({ error: "Request text is required" });
      return;
    }

    // Simple keyword matching for demo purposes (simulating NLP)
    const keywords = request.toLowerCase();
    let purpose = "General";
    let guestType: RoomState['guest_type'] = 'relaxation';
    let preferredFloor = 1;

    if (keywords.includes("business") || keywords.includes("work") || keywords.includes("meeting")) {
      purpose = "Business";
      guestType = "business";
      preferredFloor = 2; // Quiet floor
    } else if (keywords.includes("gym") || keywords.includes("sport") || keywords.includes("run")) {
      purpose = "Sports/Fitness";
      guestType = "relaxation"; // Map to relaxation for now, or add 'sports' type
      preferredFloor = 1; // Near gym
    } else if (keywords.includes("family") || keywords.includes("kids")) {
      purpose = "Family";
      guestType = "family";
      preferredFloor = 1; // Easy access
    } else if (keywords.includes("medical") || keywords.includes("health")) {
      purpose = "Medical";
      guestType = "medical";
      preferredFloor = 1;
    }

    // Assign Room
    const assignedRoomId = assignRoom(preferredFloor);
    
    if (assignedRoomId) {
      // Update Room State
      rooms[assignedRoomId].status = 'occupied';
      rooms[assignedRoomId].guest_type = guestType;
      
      // Set preferences based on type
      if (guestType === 'business') {
        rooms[assignedRoomId].target_temp = 22;
        rooms[assignedRoomId].light_level = 80; // Bright for work
      } else if (guestType === 'relaxation') {
        rooms[assignedRoomId].target_temp = 24;
        rooms[assignedRoomId].light_level = 40; // Dim for relax
      } else if (guestType === 'medical') {
        rooms[assignedRoomId].target_temp = 25; // Warmer
        rooms[assignedRoomId].light_level = 60;
      }

      res.json({
        classification: purpose,
        guest_type: guestType,
        assigned_room: assignedRoomId,
        recommendations: getRecommendations(purpose),
        room_settings: {
          temp: rooms[assignedRoomId].target_temp,
          light: rooms[assignedRoomId].light_level
        }
      });
    } else {
      res.status(503).json({ error: "No rooms available" });
    }

  } catch (error) {
    console.error("Guest Analysis Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Get All Rooms Status
app.get("/api/rooms", (req, res) => {
  res.json(rooms);
});

// 3. Toggle Floor Isolation
app.post("/api/floor/isolate", (req, res) => {
  const { floor, isolate } = req.body;
  if (floor && [1, 2, 3].includes(floor)) {
    floorIsolation[floor as 1|2|3] = isolate;
    
    // Update all rooms on this floor
    for (const id in rooms) {
      if (rooms[id].floor === floor) {
        if (isolate) {
          rooms[id].status = 'vacant'; // Force vacant
          rooms[id].hvac_active = false;
          rooms[id].light_level = 0;
          rooms[id].temperature = 30; // Drift to ambient
        } else {
          // Restore defaults if needed
          rooms[id].temperature = 24;
        }
      }
    }
    res.json({ success: true, floor, isolated: isolate });
  } else {
    res.status(400).json({ error: "Invalid floor" });
  }
});

// 4. Energy Simulation Data
app.get("/api/energy/simulate", (req, res) => {
  // Calculate current total consumption based on active rooms
  let currentConsumption = 0;
  let activeRooms = 0;

  for (const id in rooms) {
    const room = rooms[id];
    // Skip isolated floors
    if (floorIsolation[room.floor as 1|2|3]) continue;

    if (room.status === 'occupied') {
      currentConsumption += 15; // kWh (Base + HVAC + Lights)
      activeRooms++;
    } else if (room.status === 'cleaning') {
      currentConsumption += 10; // Lights + Vacuum
      activeRooms++;
    } else {
      currentConsumption += 2; // Standby
    }
  }

  // Add base building load (lobby, elevators, etc.)
  currentConsumption += 50; 

  // Get historical data point (mocking time progression)
  const historyPoint = energyData[Math.floor(Math.random() * energyData.length)] || {
    ExternalTemp: 35,
    Occupancy: 0.5,
    EnergyConsumption: 200
  };

  res.json({
    current_load: currentConsumption,
    active_rooms: activeRooms,
    external_temp: historyPoint.ExternalTemp,
    historical_avg: historyPoint.EnergyConsumption,
    floor_isolation: floorIsolation
  });
});

// 5. Emergency Reset
app.post("/api/emergency/reset", (req, res) => {
  for (const id in rooms) {
    rooms[id].status = 'vacant';
    rooms[id].temperature = 24;
    rooms[id].target_temp = 24;
    rooms[id].light_level = 0;
    rooms[id].guest_type = undefined;
  }
  // Reset floors
  floorIsolation[1] = false;
  floorIsolation[2] = false;
  floorIsolation[3] = false;

  res.json({ success: true, message: "System reset to normal" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
