import geoJsonBounds from "geojson-bounds";
import Polyline from "@mapbox/polyline/src/polyline";
import {Platform, Linking} from 'react-native';

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
    viewport.longitudeDelta = (east - west) * 1.75;
    viewport.latitudeDelta = (north - south) * 1.75;

    return viewport;
}

function coordinatesToCSVString(coordinates) {
    return `${coordinates.latitude},${coordinates.longitude}`;
}

async function callDirectionsApiForPoints(coordinates) {
    try {
        if (coordinates.length < 2) { console.error('directins request between less than two points'); }
        let requestString = `https://maps.googleapis.com/maps/api/directions/json?origin=${coordinatesToCSVString(coordinates[0])}&destination=${coordinatesToCSVString(coordinates[coordinates.length - 1])}`;
        // let requestString = `https://maps.googleapis.com/maps/api/directions/json?units='imperial'&origin=${coordinatesToCSVString(coordinates[0])}&destination=${coordinatesToCSVString(coordinates[coordinates.length - 1])}`;
        if (coordinates.length > 2) {
            requestString += '&waypoints=';
            for (let i = 1; i < coordinates.length - 1; i++) {
                requestString = `${requestString}via:${coordinatesToCSVString(coordinates[i])}|`;
            }
        }
        console.log(requestString)
        const resp = await fetch(requestString);
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
    //TODO when multiple legs are introduced, change this
    geoData.distance = respJson.routes[0].legs[0].distance.text;
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
            respJson = await this.callDirectionsApiForPoints([startLoc, destinationLoc]);
            if(respJson.status === 'OK')
                directionsResposeCache[cacheKey] = respJson;
            else console.log(respJson.error_message);
        }
        return this.extractInformationFromDirectionApiResponse(respJson);
    } catch (error) {
        console.log('error log: getProcessedGeoDataBetweenTwoPoints');
        console.log(error)
        throw error;
    }
}

async function getProcessedDataForOrderedList(coordinates) {
    const cacheKey = coordinates.reduce((result, object)=>result+'|'+coordinatesToCSVString(object), '');
    try {
        let respJson;
        if(directionsResposeCache[cacheKey]) {
            respJson = directionsResposeCache[cacheKey];
        }
        else {
            respJson = await this.callDirectionsApiForPoints(coordinates);
            if(respJson.status === 'OK')
                directionsResposeCache[cacheKey] = respJson;
            else console.log("error message: "+respJson.error_message);
        }
        return this.extractInformationFromDirectionApiResponse(respJson);
    } catch (error) {
        console.log('error log: getProcessedGeoDataBetweenTwoPoints');
        throw error;
    }
}


const navigateTo = (latitude, longitude, address) => {
    const scheme = Platform.select({ios: 'geo:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${latitude},${longitude}`;
    const label = address;
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
};

export {getViewPortFromBounds, callDirectionsApiForPoints, extractInformationFromDirectionApiResponse, getProcessedDataForOrderedList, navigateTo};
