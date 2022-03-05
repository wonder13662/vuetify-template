import customControlHexagonSelectorButtonGroup from './customControlHexagonSelectorButtonGroup';
import customControlBanner from './customControlBanner';

export default {
  createCustomControlHexagonSelectorButtonGroup({
    meta,
    onSelectedPoint = () => ({}),
    onSelectedPolyline = () => ({}),
    onSelectedPolygon = () => ({}),
    onSelectedNone = () => ({}),
  }) {
    // eslint-disable-next-line max-len
    return customControlHexagonSelectorButtonGroup.createCustomControlHexagonSelectorButtonGroup({
      meta,
      onSelectedPoint,
      onSelectedPolyline,
      onSelectedPolygon,
      onSelectedNone,
    });
  },
  createCustomControlBanner({ meta }) {
    return customControlBanner.createCustomControlBanner({ meta });
  },
};
