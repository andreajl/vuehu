<template>
  <div class="container">
    <div>
      <button @click="toggle()">{{ show ? 'x' : '+' }}</button>
      <input @focus="toggle(true)" type="text" v-model="searchString" placeholder="search" />
    </div>
    <div class="listContainer" v-if="show">
      <div
        class="item"
        v-for="station in stations.filter(this.filterByName)"
        v-bind:key="station.stationId"
        v-bind:station="station"
        @click="setStation({ station })"
      >{{ station.name }} ({{ station.num_bikes_available }}/{{ station.capacity }})</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { setStation } from '@/bikeshare/bikeshareStream';
import { Station } from '@/bikeshare/types';

@Component
export default class SearchableList extends Vue {
  @Prop(Array) readonly stations: Station[] | undefined;
  searchString = '';
  show = false;

  setStation(station: Station) {
    setStation(station);
    this.show = false;
  }
  filterByName({ name }: { name: string }) {
    return name.toLowerCase().includes(this.searchString.toLowerCase());
  }
  toggle(force: boolean) {
    this.show = force || !this.show;
  }
}
</script>

<style scoped>
.container {
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 10px;
  width: 300px;
  display: flex;
  flex-direction: column-reverse;
  text-align: center;
  align-items: center;
}
.listContainer {
  overflow: scroll;
  background-color: rgba(255, 250, 205, 0.6);
  border-radius: 20px;
  max-height: 300px;
  width: 300px;
  margin-bottom: 4px;
}
.item {
  padding: 0.5rem;
}
.item:hover {
  background-color: wheat;
  cursor: pointer;
}
button {
  border-radius: 60px;
  vertical-align: middle;
  margin-bottom: 5px;
  border: 1px solid tomato;
  outline: none;
  background-color: cornsilk;
}
input[type='text'] {
  justify-self: flex-end;
  background-color: cornsilk;
  border: 1px solid tomato;
  padding: 10px 15px;
  border-radius: 60px;
  outline: none;
}
</style>
