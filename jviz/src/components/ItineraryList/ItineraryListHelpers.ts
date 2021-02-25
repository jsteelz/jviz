import getJsonData from '../common/getJsonData';

export async function loadAllRouteItins(routeJkey: string) {
  const routeInfo = await getJsonData(`.visualizefiles/routes/${routeJkey}.json`);
  return await groupTripsByItinerary(routeInfo['sample_trip_jkeys'], routeJkey);
}

export async function loadAllRouteItinsForDate(routeJkey: string, date: string) {
  const serviceJkeys = await getJsonData(`.visualizefiles/service_jkeys_by_date/${date}.json`);
  let trips : string[] = [];
  for (let i = 0; i < 30; i++) {
    let time = String(i);
    time = time.length === 1 ? `0${time}:00` : `${time}:00`;
    trips = trips.concat(await getAllTripsAtTime(serviceJkeys, routeJkey, time));
  }
  return await groupTripsByItinerary(trips, routeJkey);
}

export async function loadAllRouteItinsAtTime(routeJkey: string, date: string, time: string) {
  const serviceJkeys = await getJsonData(`.visualizefiles/service_jkeys_by_date/${date}.json`);
  const trips = await getAllTripsAtTime(serviceJkeys, routeJkey, time);
  return await groupTripsByItinerary(trips, routeJkey);
}

async function getAllTripsAtTime(serviceJkeys: string[], routeJkey: string, timeToUse: string) {
  let trips : string[] = [];
  for (const serviceJkey of serviceJkeys) {
    const searchKey = `${routeJkey}_${serviceJkey}`;
    const tripsByHour = await getJsonData(`.visualizefiles/trips_by_route_by_hour/${searchKey}.json`);
    if (!tripsByHour) continue;
    const hour = parseInt(timeToUse.slice(0, -3));
    if (tripsByHour[hour]) {
      trips = trips.concat(tripsByHour[hour]);
    }
  }

  return trips;
}

async function groupTripsByItinerary(trips: string[], routeJkey: string) {
  const tripsByItineraryId : any = {};

  for (const tripJkey of trips) {
    const trip = await getJsonData(`.visualizefiles/trips/${tripJkey}.json`);

    const itineraryId = trip['itinerary_id'];

    if (!tripsByItineraryId[itineraryId]) {
      tripsByItineraryId[itineraryId] = [];
    }
    tripsByItineraryId[itineraryId].push(trip);
  }

  return tripsByItineraryId;
}