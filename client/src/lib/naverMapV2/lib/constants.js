export const H3_RESOLUTION = 9;
export const MIN_ZOOM = 13;
export const DEFAULT_ZOOM = 13;
export const MIN_ZOOM_POLYGON_VISIBLE = 15;
export const MAX_ZOOM = 21;
export const Z_INDEX_HEXGON_USER_SELECT = 0;
export const Z_INDEX_HEXGON_GRID = -200;
export const Z_INDEX_POLYGON_BORDER = -100;
export const HEXAGON_STATUS = {
  HEXAGON_UNSELECTED: 'HEXAGON_UNSELECTED',
  HEXAGON_SELECTED: 'HEXAGON_SELECTED',
  HEXAGON_DISABLED: 'HEXAGON_DISABLED',
  HEXAGON_EDITING: 'HEXAGON_EDITING',
};
export const HEXAGON_STATUS_SET = Object.values(HEXAGON_STATUS).reduce((acc, v) => {
  acc.add(v);
  return acc;
}, new Set());