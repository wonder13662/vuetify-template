import {
  mapUtils,
} from '@/lib/naverMapV2';

describe('#1 getSWby2Points', () => {
  test('#1-1', () => {
    const p1 = { lat: 38, lng: 127 };
    const p2 = { lat: 39, lng: 128 };
    mapUtils.getSWby2Points(p1, p2);
    expect({ lat: 38, lng: 127 }).toEqual(mapUtils.getSWby2Points(p1, p2));
    expect({ lat: 39, lng: 128 }).toEqual(mapUtils.getNEby2Points(p1, p2));
  });

  test('#1-2', () => {
    const p1 = { lat: 38, lng: 128 };
    const p2 = { lat: 39, lng: 127 };
    mapUtils.getSWby2Points(p1, p2);
    expect({ lat: 38, lng: 127 }).toEqual(mapUtils.getSWby2Points(p1, p2));
    expect({ lat: 39, lng: 128 }).toEqual(mapUtils.getNEby2Points(p1, p2));
  });  

  test('#1-3', () => {
    const p1 = { lat: 39, lng: 128 };
    const p2 = { lat: 38, lng: 127 };
    mapUtils.getSWby2Points(p1, p2);
    expect({ lat: 38, lng: 127 }).toEqual(mapUtils.getSWby2Points(p1, p2));
    expect({ lat: 39, lng: 128 }).toEqual(mapUtils.getNEby2Points(p1, p2));
  });    
});

describe('#2 isSamePoints', () => {
  test('#2-1', () => {
    const p1 = { lat: 38, lng: 127 };
    const p2 = { lat: 38, lng: 127 };
    expect(mapUtils.isSamePoints(p1, p2)).toBeTruthy();
  });
  test('#2-2', () => {
    const p1 = { lat: 38, lng: 121 };
    const p2 = { lat: 38, lng: 127 };
    expect(mapUtils.isSamePoints(p1, p2)).toBeFalsy();
  });
  test('#2-3', () => {
    const p1 = null;
    const p2 = { lat: 38, lng: 127 };
    expect(mapUtils.isSamePoints(p1, p2)).toBeFalsy();
  });
  test('#2-3', () => {
    const p1 = { lat: 38, lng: 121 };
    const p2 = null;
    expect(mapUtils.isSamePoints(p1, p2)).toBeFalsy();
  });      
});