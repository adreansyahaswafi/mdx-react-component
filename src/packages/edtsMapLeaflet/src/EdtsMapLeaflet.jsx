import { createElement, useEffect, useMemo } from "react";
import classNames from "classnames";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./ui/EdtsMapLeaflet.css";

/*
Sample datasource item shape for Mendix entity fields:
[
    {
        title: "Jakarta Office",
        subtitle: "Main branch in Sudirman",
        latitude: -6.2088,
        longitude: 106.8456,
        color: "#2563eb"
    },
    {
        title: "Bandung Hub",
        subtitle: "West Java support center",
        latitude: -6.9175,
        longitude: 107.6191,
        color: "#16a34a"
    },
    {
        title: "Surabaya Point",
        subtitle: "East Java operations",
        latitude: -7.2575,
        longitude: 112.7521,
        color: "#f97316"
    }
]
*/

function getAttributeValue(attribute, item, fallback = null) {
    if (!attribute || typeof attribute.get !== "function" || !item) {
        return fallback;
    }

    const attributeValue = attribute.get(item);
    return attributeValue && attributeValue.value != null ? attributeValue.value : fallback;
}

function normalizeNumber(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === "bigint") {
        const parsedValue = Number(value);
        return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    if (typeof value === "string") {
        const parsedValue = Number(value);
        return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    if (value && typeof value === "object") {
        if (typeof value.toNumber === "function") {
            const parsedValue = value.toNumber();
            return Number.isFinite(parsedValue) ? parsedValue : null;
        }

        if (typeof value.valueOf === "function") {
            const rawValue = value.valueOf();

            if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
                return rawValue;
            }
        }

        if (typeof value.toString === "function") {
            const parsedValue = Number(value.toString());
            return Number.isFinite(parsedValue) ? parsedValue : null;
        }
    }

    return null;
}

function createMarkerIcon(color) {
    const resolvedColor = color || "#2563eb";

    return L.divIcon({
        className: "edts-map-leaflet__marker-shell",
        html: `
            <div class="edts-map-leaflet__marker" style="--marker-color: ${resolvedColor}">
                <span class="edts-map-leaflet__marker-core"></span>
            </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 38],
        popupAnchor: [0, -34]
    });
}

function FitMapBounds({ markers, initialZoom }) {
    const map = useMap();

    useEffect(() => {
        if (!markers.length) {
            return;
        }

        if (markers.length === 1) {
            map.setView([markers[0].latitude, markers[0].longitude], initialZoom);
            return;
        }

        const bounds = L.latLngBounds(markers.map(marker => [marker.latitude, marker.longitude]));
        map.fitBounds(bounds, {
            padding: [36, 36]
        });
    }, [initialZoom, map, markers]);

    return null;
}

function OpenFirstPopup({ enabled }) {
    const map = useMap();

    useEffect(() => {
        if (!enabled) {
            return;
        }

        map.eachLayer(layer => {
            if (typeof layer.openPopup === "function") {
                layer.openPopup();
            }
        });
    }, [enabled, map]);

    return null;
}

export function EdtsMapLeaflet({
    dataSource,
    latitudeAttr,
    longitudeAttr,
    titleAttr,
    subtitleAttr,
    colorAttr,
    mapHeight,
    initialZoom,
    allowScrollWheelZoom,
    showPopupOnLoad
}) {
    const items =
        dataSource && dataSource.status === "available" && Array.isArray(dataSource.items) ? dataSource.items : [];

    const markers = useMemo(() => {
        return items
            .map(item => {
                const latitude = normalizeNumber(getAttributeValue(latitudeAttr, item));
                const longitude = normalizeNumber(getAttributeValue(longitudeAttr, item));

                if (latitude == null || longitude == null) {
                    return null;
                }

                return {
                    id: String(item.id),
                    latitude,
                    longitude,
                    title: getAttributeValue(titleAttr, item),
                    subtitle: getAttributeValue(subtitleAttr, item),
                    color: getAttributeValue(colorAttr, item)
                };
            })
            .filter(Boolean);
    }, [items, latitudeAttr, longitudeAttr, titleAttr, subtitleAttr, colorAttr]);

    const resolvedHeight = typeof mapHeight === "number" && mapHeight > 0 ? mapHeight : 440;
    const resolvedZoom = typeof initialZoom === "number" && initialZoom > 0 ? initialZoom : 13;
    const mapCenter = markers.length ? [markers[0].latitude, markers[0].longitude] : [-6.2, 106.816666];
    const leadMarker = markers[0] || null;
    const leadMarkerLabel = leadMarker && leadMarker.title ? String(leadMarker.title) : "OpenStreetMap";

    if (!dataSource || dataSource.status === "loading") {
        return (
            <div className="edts-map-leaflet edts-map-leaflet--state">
                <div className="edts-map-leaflet__state-card">
                    <div className="edts-map-leaflet__state-title">Loading map...</div>
                    <div className="edts-map-leaflet__state-copy">Preparing OpenStreetMap tiles and marker positions.</div>
                </div>
            </div>
        );
    }

    if (dataSource.status !== "available") {
        return (
            <div className="edts-map-leaflet edts-map-leaflet--state">
                <div className="edts-map-leaflet__state-card">
                    <div className="edts-map-leaflet__state-title">Map data is not available.</div>
                    <div className="edts-map-leaflet__state-copy">Make sure the datasource is available before rendering the map.</div>
                </div>
            </div>
        );
    }

    if (!markers.length) {
        return (
            <div className="edts-map-leaflet edts-map-leaflet--state">
                <div className="edts-map-leaflet__state-card">
                    <div className="edts-map-leaflet__state-title">No map markers to display.</div>
                    <div className="edts-map-leaflet__state-copy">
                        Fill the latitude and longitude attributes so marker locations can be shown.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="edts-map-leaflet" style={{ height: resolvedHeight }}>
            <div className="edts-map-leaflet__panel">
                <div className="edts-map-leaflet__eyebrow">Leaflet Map</div>
                <div className="edts-map-leaflet__headline">{leadMarkerLabel}</div>
                <div className="edts-map-leaflet__meta-row">
                    <span className="edts-map-leaflet__meta-chip">{markers.length} marker{markers.length === 1 ? "" : "s"}</span>
                    <span className="edts-map-leaflet__meta-chip">Zoom {resolvedZoom}</span>
                </div>
            </div>
            <MapContainer
                center={mapCenter}
                zoom={resolvedZoom}
                scrollWheelZoom={allowScrollWheelZoom}
                className={classNames("edts-map-leaflet__map")}
                zoomControl
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitMapBounds markers={markers} initialZoom={resolvedZoom} />
                <OpenFirstPopup enabled={showPopupOnLoad} />
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        position={[marker.latitude, marker.longitude]}
                        icon={createMarkerIcon(marker.color)}
                    >
                        <Popup>
                            <div className="edts-map-leaflet__popup">
                                {marker.title ? (
                                    <div className="edts-map-leaflet__popup-title">{String(marker.title)}</div>
                                ) : null}
                                {marker.subtitle ? (
                                    <div className="edts-map-leaflet__popup-subtitle">{String(marker.subtitle)}</div>
                                ) : null}
                                <div className="edts-map-leaflet__popup-coordinates">
                                    {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
