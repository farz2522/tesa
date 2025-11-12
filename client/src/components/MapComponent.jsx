import React, { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = () => {
  const [popupInfo, setPopupInfo] = useState(null);

  const initialViewState = {
    latitude: 13.7563,
    longitude: 100.5018,
    zoom: 10
  };

  const markers = [
    { id: 1, latitude: 13.7563, longitude: 100.5018, title: "Bangkok" },
    { id: 2, latitude: 13.7367, longitude: 100.5231, title: "Siam" }
  ];

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Map
        initialViewState={initialViewState}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: "100%", height: "100%" }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
          >
            <button
              className="w-6 h-6 bg-red-500 rounded-full"
              onClick={() => setPopupInfo(marker)}
            />
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="top"
            onClose={() => setPopupInfo(null)}
          >
            <div>{popupInfo.title}</div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
