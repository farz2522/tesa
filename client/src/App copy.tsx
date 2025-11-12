import React, { useEffect, useState } from "react";
import Map, { Marker, type ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { BellIcon, Cog6ToothIcon, MapIcon } from "@heroicons/react/24/outline";

// -----------------------------
// 🛰️ Type ของ Drone Marker
// -----------------------------
interface MarkerType {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  altitude?: number;
  image_url?: string;
}

// -----------------------------
// 🧭 Navbar
// -----------------------------
const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white flex justify-between items-center px-6 py-3 shadow-md">
      <div className="flex items-center space-x-2">
        <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
          D
        </div>
        <span className="text-xl font-semibold">DroneDefends</span>
      </div>

      <ul className="flex items-center space-x-6">
        <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
        <li className="hover:text-blue-400 cursor-pointer flex items-center">
          <MapIcon className="w-5 h-5 mr-1" /> Map
        </li>
        <li className="hover:text-blue-400 cursor-pointer">Drone List</li>
        <li className="hover:text-blue-400 cursor-pointer flex items-center">
          <BellIcon className="w-5 h-5 mr-1" /> Alerts
        </li>
        <li className="hover:text-blue-400 cursor-pointer flex items-center">
          <Cog6ToothIcon className="w-5 h-5 mr-1" /> Settings
        </li>
      </ul>

      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold cursor-pointer">
          U
        </div>
        <span>Admin</span>
      </div>
    </nav>
  );
};

// -----------------------------
// 🗺️ App หลัก
// -----------------------------
const App = () => {
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 13.7563,
    longitude: 100.5018,
    zoom: 10,
  });

  const [selectedDrone, setSelectedDrone] = useState<MarkerType | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  // ดึงข้อมูลจาก FastAPI ทุก 3 วินาที
  useEffect(() => {
    const fetchDrones = async () => {
      console.log("🔄 กำลังดึงข้อมูลโดรนจาก FastAPI...");
      try {
        const res = await fetch("http://127.0.0.1:8000/drones");
        const data: MarkerType[] = await res.json();
        console.log("📦 ข้อมูลดิบจาก backend: ", data);

        const formatted = data.map((d) => ({
          ...d,
          image_url: d.image_url?.startsWith("http")
            ? d.image_url
            : `http://127.0.0.1:8000/images/${d.title}`,
        }));

        console.log("🧭 ข้อมูลหลัง format: ", formatted);
        setMarkers(formatted);

        // ✅ ขยับ map ไปหาโดรนตัวแรก
        if (formatted.length > 0) {
          setViewport((prev) => ({
            ...prev,
            latitude: formatted[0].latitude,
            longitude: formatted[0].longitude,
            zoom: 14, // ซูมเข้าเล็กน้อย
          }));
          console.log(
            `🛰️ Drone ตัวแรก → lat: ${formatted[0].latitude}, lon: ${formatted[0].longitude}, alt: ${formatted[0].altitude}`
          );
        }
      } catch (err) {
        console.error("❌ Error fetching drones:", err);
      }
    };

    fetchDrones();
    const interval = setInterval(fetchDrones, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-indigo-900 to-black">
      <Navbar />

      <div className="flex flex-1 p-4 gap-4">
        {/* 🌍 แผนที่ซ้าย */}
        <div className="flex-1 relative rounded-xl border-4 border-gray-400 overflow-hidden shadow-lg">
          <Map
            initialViewState={viewport}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            style={{ width: "100%", height: "100%" }}
            onMove={(evt) => setViewport((evt as any).viewState)}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                latitude={marker.latitude}
                longitude={marker.longitude}
                anchor="bottom"
              >
                <button
                  className="w-4 h-4 bg-red-500 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform"
                  onClick={() => {
                    console.log("🖱️ คลิกโดรน:", marker);
                    setSelectedDrone(marker);
                  }}
                />
              </Marker>
            ))}
          </Map>
        </div>

        {/* 📋 แสดงข้อมูลฝั่งขวา */}
        <div className="w-64 flex-shrink-0 bg-gray-800 text-white p-4 rounded-xl shadow-lg overflow-auto">
          {selectedDrone ? (
            <div className="flex flex-col items-center">
              <div className="font-bold mb-2">{selectedDrone.title}</div>
              <div>Altitude: {selectedDrone.altitude ?? "N/A"} m</div>

              {selectedDrone.image_url ? (
                <img
                  src={selectedDrone.image_url}
                  alt={selectedDrone.title}
                  className="mt-4 w-48 h-48 object-cover rounded-md border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
              ) : (
                <div className="text-gray-400 mt-4">ไม่มีภาพ</div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-20">
              👈 คลิกที่ Marker เพื่อดูรายละเอียด
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
