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
// @ depreacted - OVERLAY_STATUS 사용해주세요
export const HEXAGON_STATUS = {
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
};
export const HEXAGON_STATUS_SET = utils.convertObjToSet(HEXAGON_STATUS);
// @ depreacted - OVERLAY_EVENT 사용해주세요
export const HEXAGON_EVENT = {
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  CLICK: 'CLICK',
};
export const HEXAGON_EVENT_SET = utils.convertObjToSet(HEXAGON_EVENT);

export const OVERLAY_EVENT = {
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  CLICK: 'CLICK',
};
export const OVERLAY_EVENT_SET = utils.convertObjToSet(OVERLAY_EVENT);
export const OVERLAY_STATUS = {
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  NO_STATUS: 'NO_STATUS',
};
export const OVERLAY_STATUS_SET = utils.convertObjToSet(HEXAGON_STATUS);

export const DISTANCE_LINE_STROKE_STYLE = {
  SOLID: 'solid',
  SHORTDASH: 'shortdash',
  SHORTDOT: 'shortdot',
  SHORTDASHDOT: 'shortdashdot',
  SHORTDASHDOTDOT: 'shortdashdotdot',
  DOT: 'dot',
  DASH: 'dash',
  LONGDASH: 'longdash',
  DASHDOT: 'dashdot',
  LONGDASHDOT: 'longdashdot',
  LONGDASHDOTDOT: 'longdashdotdot',
};
export const DISTANCE_LINE_STROKE_STYLE_SET = utils.convertObjToSet(DISTANCE_LINE_STROKE_STYLE);
