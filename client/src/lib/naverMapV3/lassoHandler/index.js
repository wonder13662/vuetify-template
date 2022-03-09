import hexagonLassoHandler from './hexagonLassoHandler';
import polygonLassoHandler from './polygonLassoHandler';

export default {
  createHexagonLasso: ({
    onChange = () => ({}),
    meta = {},
  }) => hexagonLassoHandler.createHexagonLasso({
    onChange,
    meta,
  }),
  createPolygonLasso: ({
    onChange = () => ({}),
    meta = {},
  }) => polygonLassoHandler.createPolygonLasso({
    onChange,
    meta,
  }),
};
