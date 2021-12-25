<template>
  <BaseNaverMap
    :map-id="'default-map'"
    :bound="bound"
  />
</template>

<script>
import { subtract, add } from 'mathjs';
import BaseNaverMap from '@/components/base/BaseNaverMapV2';
import boundHandler from '@/lib/naverMapV2/lib/boundHandler';

export default {
  name: 'DefaultMap',
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
    bound() {
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
