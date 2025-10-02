import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Campement } from "@/hooks/useCampements";

// Fix pour les icônes Leaflet avec Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure l'icône par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface DynamicCampementMapProps {
  campements: Campement[];
}

const DynamicCampementMap = ({ campements }: DynamicCampementMapProps) => {
  // Filtrer uniquement les campements avec des coordonnées valides
  const campmentsWithCoords = campements.filter(
    (c) => c.latitude !== null && c.longitude !== null
  );

  // Définir le centre de la carte
  const center: [number, number] = campmentsWithCoords.length > 0
    ? [campmentsWithCoords[0].latitude!, campmentsWithCoords[0].longitude!]
    : [7.5399, -5.5471]; // Centre de la Côte d'Ivoire par défaut

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border border-border shadow-sm">
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {campmentsWithCoords.map((campement) => (
          <Marker
            key={campement.id}
            position={[campement.latitude!, campement.longitude!]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-base mb-1">
                  {campement.nom_campement}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Région:</strong> {campement.region}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Département:</strong> {campement.departement}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Sous-préfecture:</strong> {campement.sous_prefecture}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Village:</strong> {campement.village_rattachement}
                </p>
                {campement.population && (
                  <p className="text-sm text-gray-600">
                    <strong>Population:</strong> {campement.population} habitants
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DynamicCampementMap;
