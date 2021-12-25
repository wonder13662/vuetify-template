<template>
  <BaseNaverMap
    :map-id="'marker-map'"
    :bound="bound"
    :marker-groups="markerGroups"
    :distance-line-groups="distanceLineGroups"
    :draggable="true"
    :scroll-wheel="true"
    :zoom-control="true"
  />
</template>

<script>
import { subtract, add } from 'mathjs';
import BaseNaverMap from '@/components/base/BaseNaverMapV2';
import boundHandler from '@/lib/naverMapV2/lib/boundHandler';
import markerGroupHandler from '@/lib/naverMapV2/markerGroupHandler';
import distanceLineGroupHandler from '@/lib/naverMapV2/distanceLineGroupHandler';

export default {
  name: 'MarkerMap',
  components: {
    BaseNaverMap,
  },
  data() {
    return {
      pickupPoint: { // 학동역 바이더웨이
        pickupPointLatitude: 37.515081618263494,
        pickupPointLongitude: 127.03093858727293,
      },
      dropPoint: { // 강남구청역 청담래미안 아파트
        dropPointLatitude: 37.51786718987649,
        dropPointLongitude: 127.0426810564629,
      },
    };
  },
  computed: {
    markerGroups() {
      const {
        pickupPointLatitude,
        pickupPointLongitude,
        info: pickupPointInfo,
      } = this.pickupPoint;

      const {
        dropPointLatitude,
        dropPointLongitude,
        info: dropPointInfo,
      } = this.dropPoint;

      const baseMarkers = [
        {
          lat: pickupPointLatitude,
          lng: pickupPointLongitude,
          name: '출발',
          color: 'red',
          bgColor: 'black',
          info: pickupPointInfo,
        },
        {
          lat: dropPointLatitude,
          lng: dropPointLongitude,
          name: '도착',
          color: 'yellow',
          bgColor: 'grey',
          info: dropPointInfo,
        },
      ].map((v) => (markerGroupHandler.createBaseMarker(v)));

      const result = markerGroupHandler.createMarkerGroup(baseMarkers);
      return [result];
    },
    distanceLineGroups() {
      const {
        pickupPointLatitude,
        pickupPointLongitude,
      } = this.pickupPoint;

      const {
        dropPointLatitude,
        dropPointLongitude,
      } = this.dropPoint;

      const start = {
        lat: pickupPointLatitude,
        lng: pickupPointLongitude,
      };

      const end = {
        lat: dropPointLatitude,
        lng: dropPointLongitude,
      };
      const result = distanceLineGroupHandler.createDistanceLineGroup([{ start, end }]);
      return [result];
    },
    bound() { // TODO SubDeliveryMap.vue와 DeliveryMap.vue가 같은 로직을 공유하고 있음. 한군데서 모아서 활용 필요.
      const {
        pickupPointLatitude,
        pickupPointLongitude,
      } = this.pickupPoint;

      const {
        dropPointLatitude,
        dropPointLongitude,
      } = this.dropPoint;

      const bound = {
        sw: {
          lat: Math.min(pickupPointLatitude, dropPointLatitude),
          lng: Math.min(pickupPointLongitude, dropPointLongitude),
        },
        ne: {
          lat: Math.max(pickupPointLatitude, dropPointLatitude),
          lng: Math.max(pickupPointLongitude, dropPointLongitude),
        },
      };

      // 픽업지부터 도착지의 너비만큼 Padding offset을 추가해준다.
      // (픽업지와 도착지가 화면의 가운데에 보이도록 하기 위한 목적)
      // 1. latitude(위도) offset 구하기
      const latDiff = subtract(bound.ne.lat, bound.sw.lat);
      // 2. longitude(경도) offset 구하기
      const lngDiff = subtract(bound.ne.lng, bound.sw.lng);

      const {
        sw,
        ne,
      } = bound;

      const boundWithPadding = {
        sw: {
          lat: subtract(sw.lat, latDiff),
          lng: subtract(sw.lng, lngDiff),
        },
        ne: {
          lat: add(ne.lat, latDiff),
          lng: add(ne.lng, lngDiff),
        },
      };

      return boundHandler.createBound(boundWithPadding.sw, boundWithPadding.ne);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
