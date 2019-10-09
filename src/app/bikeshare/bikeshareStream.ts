import { Subject } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import {
  createReducers,
  createAction,
  createStreamState,
  createRoutines,
  ofType,
} from '@/store';
import { getStationInfo, getStationStatus } from './service';
import { Station, StatusDict } from './types';

const FETCH_STATION_INFO = 'FETCH_STATION_INFO';
const FETCH_STATION_INFO_SUCCESS = 'FETCH_STATION_INFO_SUCCESS';
const FETCH_STATION_STATUS = 'FETCH_STATION_STATUS';
const FETCH_STATION_STATUS_SUCCESS = 'FETCH_STATION_STATUS_SUCCESS';
const SET_STATION = 'SET_STATION';

export const fetchStationInfo = () =>
  createAction({ type: FETCH_STATION_INFO });

export const fetchStationInfoSuccess = (payload: Station[]): void =>
  createAction({ type: FETCH_STATION_INFO_SUCCESS, payload });

export const fetchStationStatus = (): void =>
  createAction({ type: FETCH_STATION_STATUS });

export const fetchStationStatusSuccess = (payload: StatusDict): void =>
  createAction({ type: FETCH_STATION_STATUS_SUCCESS, payload });

export const setStation = (payload: Station): void =>
  createAction({ type: SET_STATION, payload });

interface StationsStateShape {
  error: boolean;
  loading: boolean;
  stations: Station[] | null;
  statusDict: StatusDict | null;
  station: Station | null;
}

const defaultState: StationsStateShape = {
  error: false,
  loading: false,
  stations: null,
  statusDict: null,
  station: null,
};

const reducers = createReducers<StationsStateShape>({
  [FETCH_STATION_INFO]: state => ({ ...state, loading: true }),
  [FETCH_STATION_INFO_SUCCESS]: (state, stations) => ({
    ...state,
    stations,
    loading: false,
  }),
  [FETCH_STATION_STATUS]: state => ({ ...state, loading: true }),
  [FETCH_STATION_STATUS_SUCCESS]: (state, statusDict) => ({
    ...state,
    statusDict,
    loading: false,
  }),
  [SET_STATION]: (state, { station }) => ({ ...state, station }),
});

const routines = createRoutines<any>((routine$: Subject<any>): any[] => [
  routine$.pipe(
    ofType(FETCH_STATION_INFO),
    switchMap(getStationInfo),
    map(stations =>
      stations.map(({ station_id, name, lat, lon, capacity }) => ({
        stationId: station_id,
        position: { lat, lng: lon },
        capacity,
        name,
      }))
    ),
    tap(fetchStationInfoSuccess)
  ),
  routine$.pipe(
    ofType(FETCH_STATION_STATUS),
    switchMap(getStationStatus),
    map(stations =>
      stations.reduce(
        (acc, { station_id, ...item }) => ({
          ...acc,
          [station_id]: { ...item, stationId: station_id },
        }),
        {}
      )
    ),
    tap(fetchStationStatusSuccess)
  ),
]);

export default createStreamState<StationsStateShape>()({
  defaultState,
  reducers,
  routines,
});
