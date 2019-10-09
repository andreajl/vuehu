<template>
  <div id="app">
    <Bikeshare />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Bikeshare from '@/bikeshare/Bikeshare.vue';

@Component({
  components: { Bikeshare },
})
export default class App extends Vue {}
</script>

<style>
* {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 17px;
  font-weight: 200;
  letter-spacing: 0.01em;
}
</style>