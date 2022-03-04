import customControlHexagonSelectorButtonGroup from './customControlHexagonSelectorButtonGroup';
import customControlBanner from './customControlBanner';

export default {
  createCustomControlHexagonSelectorButtonGroup({ meta }) {
    // eslint-disable-next-line max-len
    return customControlHexagonSelectorButtonGroup.createCustomControlHexagonSelectorButtonGroup({ meta });
  },
  createCustomControlBanner({ meta }) {
    return customControlBanner.createCustomControlBanner({ meta });
  },
};