import L from "leaflet";

let map: L.Map | null = null;

export const setMapInstance = (instance: L.Map) => {
	map = instance;
};

export const getMapInstance = () => map;
