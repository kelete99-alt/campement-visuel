import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix pour les icônes Leaflet avec Vite
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Données d'exemple pour la démonstration
const sampleCampements = [
  {
    id: 1,
    nom: "Campement Kouassi",
    position: [6.8270, -5.2893] as [number, number],
    population: 245,
    departement: "Abidjan",
  },
  {
    id: 2,
    nom: "Campement N'Guessan",
    position: [7.5499, -5.5471] as [number, number],
    population: 182,
    departement: "Yamoussoukro",
  },
  {
    id: 3,
    nom: "Campement Yao",
    position: [5.3600, -4.0083] as [number, number],
    population: 312,
    departement: "San-Pédro",
  },
];

const CampementMap = () => {
  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border border-border shadow-sm">
      <MapContainer
        center={[7.5399, -5.5471]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sampleCampements.map((campement) => (
          <Marker key={campement.id} position={campement.position}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-base mb-1">{campement.nom}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Département:</strong> {campement.departement}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Population:</strong> {campement.population} habitants
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CampementMap;
