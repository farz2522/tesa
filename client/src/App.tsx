import React, { useEffect, useState } from "react";
import Map, { Marker, Popup, type ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { BellIcon, Cog6ToothIcon, MapIcon } from "@heroicons/react/24/outline";

// Type ของ Marker
interface MarkerType {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  altitude?: number;
}

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white flex justify-between items-center px-6 py-3 shadow-md">
      <div className="flex items-center space-x-2">
        <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">D</div>
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
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold cursor-pointer">U</div>
        <span>Admin</span>
      </div>
    </nav>
  );
};

// App Component
const App = () => {
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 13.7563,
    longitude: 100.5018,
    zoom: 10
  });

  const [popupInfo, setPopupInfo] = useState<MarkerType | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  // Fetch ข้อมูลโดรนจาก backend
  useEffect(() => {
    fetch("http://localhost:8000/drones")
      .then(res => res.json())
      .then(data => setMarkers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-indigo-900 to-black">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[1000px] h-[600px] rounded-xl border-4 border-gray-400 overflow-hidden shadow-lg">
          <Map
            initialViewState={viewport}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
            onMove={(evt) => setViewport(evt.viewState)}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                latitude={marker.latitude}
                longitude={marker.longitude}
              >
                <button
                  className="w-6 h-6 bg-red-500 rounded-full"
                  onClick={() => setPopupInfo(marker)}
                />
              </Marker>
            ))}

            {popupInfo && (
              <Popup
                latitude={popupInfo.latitude}
                longitude={popupInfo.longitude}
                closeOnClick={true}
                onClose={() => setPopupInfo(null)}
              >
                <div>
                  {popupInfo.title} <br />
                  Altitude: {popupInfo.altitude ?? "N/A"} m
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </div>
  );
};

export default App;
