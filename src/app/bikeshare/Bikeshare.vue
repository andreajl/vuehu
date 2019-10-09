<template>
  <div id="app" class="container">
    <Map v-bind:stations="stations" v-bind:station="state.station" />
    <SearchableList v-bind:stations="stations" />
    <InfoBox v-bind:station="state.station" />
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { StreamStateMixin } from '@/store';
import { Map, SearchableList, InfoBox } from './components';
import { Station, StatusDict } from './types';
import bikeshareStream$, {
  fetchStationInfo,
  fetchStationStatus,
  setStation,
} from './bikeshareStream';

interface ViewProps {
  stations: Station[];
  statusDict: StatusDict;
}

@Component({
  components: { Map, SearchableList, InfoBox },
})
export default class Bikeshare extends mixins(
  StreamStateMixin<ViewProps>(bikeshareStream$)
) {
  stations: Station[] = [];
  state: ViewProps = {
    stations: [],
    statusDict: {},
  };
  worker: NodeJS.Timeout | undefined;

  mounted() {
    fetchStationInfo();
    fetchStationStatus();
    this.worker = setInterval(fetchStationStatus, 20000);
  }

  beforeDestroy() {
    this.worker && clearInterval(this.worker);
  }

  setStation(station: Station) {
    setStation(station);
  }

  @Watch('state', { deep: true })
  onStationChanged({
    stations,
    statusDict,
  }: {
    stations: Station[];
    statusDict: StatusDict;
  }) {
    if (!stations || !statusDict) return;
    this.stations = stations.map(station => ({
      ...statusDict[station.stationId],
      ...station,
    }));
  }
}
</script>
