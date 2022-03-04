import customControlHexagonSelectorButtonGroup from './customControlHexagonSelectorButtonGroup';
import customControlBanner from './customControlBanner';

export default {
  createCustomControlHexagonSelectorButtonGroup({
    meta,
    onChange,
  }) {
    // eslint-disable-next-line max-len
    return customControlHexagonSelectorButtonGroup.createCustomControlHexagonSelectorButtonGroup({
      meta,
      onChange,
    });
  },
  createCustomControlBanner({ meta }) {
    return customControlBanner.createCustomControlBanner({ meta });
  },
};
