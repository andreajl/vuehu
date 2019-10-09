export type Station = {
  stationId: string;
  name: string;
  position: { lat: number; lng: number };
  capacity: number;
};

export type StatusDict = {
  [stationId: string]: {
    bikesAvailable: number;
  };
};
