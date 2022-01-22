import utils from '@/lib/naverMapV2/lib/utils';

describe('#1 getSWby2Points', () => {
  test('#1-1', () => {
    const p1 = { lat: 38, lng: 127 };
    const p2 = { lat: 39, lng: 128 };
    utils.getSWby2Points(p1, p2);
    expect({ lat: 38, lng: 127 }).toEqual(utils.getSWby2Points(p1, p2))
    expect({ lat: 39, lng: 128 }).toEqual(utils.getNEby2Points(p1, p2))
  });

  test('#1-2', () => {
    const p1 = { lat: 38, lng: 128 };
    const p2 = { lat: 39, lng: 127 };
    utils.getSWby2Points(p1, p2);
    expect({ lat: 38, lng: 127 }).toEqual(utils.getSWby2Points(p1, p2))
    expect({ lat: 39, lng: 128 }).toEqual(utils.getNEby2Points(p1, p2))
  });  

  test('#1-3', () => {
    const p1 = { lat: 39, lng: 128 };
    const p2 = { lat: 38, lng: 127 };
    utils.getSWby2Points(p1, p2);
    expect({ lat: 38, lng: 127 }).toEqual(utils.getSWby2Points(p1, p2))
    expect({ lat: 39, lng: 128 }).toEqual(utils.getNEby2Points(p1, p2))
  });    
});