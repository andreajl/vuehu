import Vue from 'vue';
import Marker from './Marker.vue';

const LocationIconConstructor = Vue.extend(Marker);

export const getColoredIconUrl = (fillColor: string) => {
  const iconComponent = new LocationIconConstructor({
    propsData: { fillColor },
  });
  iconComponent.$mount();
  const iconString = new XMLSerializer().serializeToString(iconComponent.$el);
  return `data:image/svg+xml;charset=UTF-8;base64,${btoa(iconString)}`;
};

const getColor = (value: number) =>
  `hsl(${((1 - parseFloat(value.toFixed(1))) * 120).toString(10)},100%,50%)`;

export const getIcon = (value: number) => ({
  url: getColoredIconUrl(getColor(value)),
  anchor: { x: 14, y: 14 },
});
