import { of, from, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export type StationInfo = {
  address: string;
  capacity: number;
  lat: number;
  lon: number;
  name: string;
  station_id: string;
};

export type StationStatus = {
  station_id: string;
  is_installed: number;
  is_renting: number;
  is_returning: number;
  last_reported: number;
  num_bikes_available: number;
  num_docks_available: number;
};

interface Response {
  last_updated: number;
  ttl: number;
  data: {
    stations: StationInfo[] | StationStatus[];
  };
}

const API = 'https://gbfs.urbansharing.com/oslobysykkel.no/';
const STATION_INFO = `${API}station_information.json`;
const STATION_STATUS = `${API}station_status.json`;

const fetchSafely = <T>(url: string): Observable<T> => {
  return from(fetch(url).then(r => r.json())).pipe(
    map(response => response.data.stations)
  );
};

export const getStationInfo = () => fetchSafely<StationInfo[]>(STATION_INFO);
export const getStationStatus = () =>
  fetchSafely<StationStatus[]>(STATION_STATUS);

import stationInfo from '../../mock/MOCK_station_information.json';
export const getStationInfoMock = () => {
  return of<StationInfo[]>(stationInfo.data.stations).pipe(delay(500));
};

import stationStatus from '../../mock/MOCK_station_status.json';
export const getStationStatusMock = () => {
  return of<StationStatus[]>(stationStatus.data.stations).pipe(delay(500));
};
