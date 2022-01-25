import utils from '@/lib/utils';

export const H3_RESOLUTION = 9;
export const MIN_ZOOM = 13;
export const DEFAULT_ZOOM = 13;
export const MIN_ZOOM_POLYGON_VISIBLE = 15;
export const MAX_ZOOM = 21;
export const Z_INDEX_HEXGON_USER_SELECT = 0;
export const Z_INDEX_HEXGON_GRID = -200;
export const Z_INDEX_POLYGON_BORDER = -100;
export const HEXAGON_MODE = {
  READ_SELECTED: 'READ_SELECTED',
  READ_UNSELECTED: 'READ_UNSELECTED',
  EDIT: 'EDIT',
  DISABLED: 'DISABLED',
};
export const HEXAGON_MODE_SET = utils.convertObjToSet(HEXAGON_MODE);
export const HEXAGON_STATUS = {
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
};
export const HEXAGON_STATUS_SET = utils.convertObjToSet(HEXAGON_STATUS);
export const HEXAGON_EVENT = {
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  CLICK: 'CLICK',
  CHANGE: 'CHANGE',
};
export const HEXAGON_EVENT_SET = utils.convertObjToSet(HEXAGON_EVENT);
