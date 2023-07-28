import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap, useMapEvents } from "react-leaflet/hooks";
import { useCities } from "../contexts/CitiesContext";
import { FlagEmojiToPNG } from "./FlagToEmoji";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import styles from "./Map.module.css";

function Map() {
	const { cities } = useCities();
	const {
		isLoading: isLoadingPosition,
		position: geolocationPosition,
		getPosition,
	} = useGeolocation();

	const [mapPosition, setMapPosition] = useState([45, 0]);

	const [mapLat, mapLng] = useUrlPosition();

	useEffect(() => {
		mapLat && mapLng && setMapPosition([mapLat, mapLng]);
	}, [mapLat, mapLng]);

	useEffect(() => {
		geolocationPosition &&
			setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
	}, [geolocationPosition]);

	return (
		<div className={styles.mapContainer}>
			{!geolocationPosition && (
				<Button type='position' onClick={getPosition}>
					{isLoadingPosition ? "Loading..." : "Use your position"}
				</Button>
			)}
			<MapContainer
				center={mapLat ? [mapLat, mapLng] : mapPosition}
				zoom={6}
				scrollWheelZoom
				className={styles.map}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
				/>
				{cities.map((city) => (
					<Marker
						position={[city.position.lat, city.position.lng]}
						key={city.id}>
						<Popup>
							<span>
								<FlagEmojiToPNG flag={city.emoji} />
							</span>
							<span>{city.cityName}</span>
						</Popup>
					</Marker>
				))}
				<ChangeCenter position={mapPosition} />
				<DetectClick />
			</MapContainer>
		</div>
	);
}

function ChangeCenter({ position }) {
	const map = useMap();
	map.setView(position);

	return null;
}

function DetectClick() {
	const navigate = useNavigate();

	useMapEvents({
		click: (e) => {
			navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
			// map.locate();
		},
		// locationfound: (location) => {
		// 	console.log("location found:", location);
		// },
	});

	return null;
}

export default Map;
