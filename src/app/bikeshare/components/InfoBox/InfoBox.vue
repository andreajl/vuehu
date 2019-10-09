<template>
  <div v-if="station" class="container">
    {{ station.name }}
    ({{ station.num_bikes_available }}/{{ station.capacity }} available)
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Station } from '@/bikeshare/types';

@Component
export default class InfoBox extends Vue {
  @Prop(Object) readonly station: Station | undefined;
}
</script>

<style scoped>
.container {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
  padding: 10px 15px;
  margin: 10px;
  display: flex;
  text-align: center;
  align-items: center;
  border: 1px solid tomato;
  background-color: cornsilk;
  border-radius: 60px;
  cursor: default;
}
</style>
