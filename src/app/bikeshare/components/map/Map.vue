<template>
  <GmapMap
    :center="{ lat: 59.92, lng: 10.73 }"
    :zoom="12"
    :options="{ minZoom: 11, maxZoom: 16 }"
    map-type-id="roadmap"
    style="width: 100vw; height: 100vh"
    ref="map"
  >
    <GmapMarker
      v-for="(station, index) in stations"
      :key="index"
      :position="station.position"
      :clickable="true"
      :draggable="false"
      @click="setStation({ station })"
      :icon="getIcon(station.num_bikes_available, station.capacity)"
    />
  </GmapMap>
</template>

<script lang="ts">
/*global google*/
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';
import { getIcon } from './utils';
import { setStation } from '@/bikeshare/bikeshareStream';
import { Station } from '@/bikeshare/types';

type Position = {
  lat: number;
  lng: number;
};

interface MapObject {
  panTo: (position: Position) => void;
  fitBounds: (position: Position) => void;
}

@Component
export default class Map extends Vue {
  @Prop(Array) readonly stations: Station[] | undefined;
  @Prop(Object) readonly station: Station | undefined;
  $refs!: {
    map: any;
  };

  setStation(station: Station) {
    setStation(station);
  }

  updateMarkerLocation(position: { lat: number; lng: number }) {
    this.$nextTick(() =>
      this.$refs.map.$mapPromise.then((map: MapObject) => {
        map.panTo(position);
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(position);
        map.fitBounds(bounds);
      })
    );
  }

  getIcon(available: number, capacity: number) {
    return getIcon(1 - available / capacity);
  }

  @Watch('station', { deep: true })
  onStationChanged(station: Station) {
    if (!station) return;
    this.updateMarkerLocation(station.position);
  }
}
</script>
