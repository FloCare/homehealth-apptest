import geoJsonBounds from "geojson-bounds";
import Polyline from "@mapbox/polyline/src/polyline";

const directionsResposeCache = {};
function getViewPortFromBounds(boundsCoordinates) {
    console.log(boundsCoordinates);
    const multipoint = {
        type: 'MultiPoint',
        coordinates: boundsCoordinates
    };

    const [west, south, east, north] = geoJsonBounds.extent(multipoint);
    const viewport = {};

    //TODO wut?
    viewport.longitude = (south + north) / 2;
    viewport.latitude = (east + west) / 2;
    viewport.longitudeDelta = (east - west) * 1.5;
    viewport.latitudeDelta = (north - south) * 1.5;

    return viewport;
}

async function callDirectionsApiForPoints(startLoc, destinationLoc) {
    try {
        const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}`);
        return await resp.json();
    } catch (error) {
        console.log('directions api call threw error');
        console.log(error);
        throw error;
    }
}

function extractInformationFromDirectionApiResponse(respJson) {
    const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
    const geoData = {};
    geoData.polyline = points.map((point) => ({
        latitude: point[0],
        longitude: point[1]
    }));
    geoData.bounds = respJson.routes[0].bounds;
    return geoData;
}

async function getProcessedGeoDataBetweenTwoPoints(startLoc, destinationLoc) {
    const cacheKey = `${startLoc.latitude},${startLoc.longitude}-${destinationLoc.latitude},${destinationLoc.longitude}`;
    try {
        let respJson;
        if(directionsResposeCache[cacheKey]) {
            respJson = directionsResposeCache[cacheKey];
        }
        else {
            respJson = await this.callDirectionsApiForPoints(startLoc, destinationLoc);
            if(respJson.status === 'OK')
                directionsResposeCache[cacheKey] = respJson;
            else console.log(respJson.error_message);
        }
        return this.extractInformationFromDirectionApiResponse(respJson);
    } catch (error) {
        console.log('error log: getProcessedGeoDataBetweenTwoPoints');
        throw error;
    }
}

export {getViewPortFromBounds, callDirectionsApiForPoints, extractInformationFromDirectionApiResponse, getProcessedGeoDataBetweenTwoPoints};
