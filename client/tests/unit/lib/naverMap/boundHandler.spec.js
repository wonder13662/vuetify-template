import boundHandler from '@/lib/naverMapV2/lib/boundHandler';

describe('lib/naverMapV2/lib/boundHandler.js', () => {
  test('#1 Bound.merge - 두개의 bound가 합쳐져 더 넓은 영역의 bound를 만듭니다', () => {
    const boundA = boundHandler.createBounds({ lat: 20, lng: 20 }, { lat: 30, lng: 30 });
    const boundB = boundHandler.createBounds({ lat: 10, lng: 10 }, { lat: 40, lng: 40 });    
    const boundC = boundA.merge(boundB);

    expect(boundC.sw.lat).toBe(10);
    expect(boundC.sw.lng).toBe(10);

    expect(boundC.ne.lat).toBe(40);
    expect(boundC.ne.lng).toBe(40);
  });

  test('#2-1 예외상황: sw 값이 유효하지 않음', () => {
    const sw = null;
    const ne = { lat: 30, lng: 30 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });

  test('#2-2 예외상황: ne 값이 유효하지 않음', () => {
    const sw = { lat: 30, lng: 30 };
    const ne = null;
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });

  test('#2-3 예외상황: sw.lat 값이 유효한 범위가 아님', () => {
    const sw = { lat: 91, lng: 30 };
    const ne = { lat: 30, lng: 30 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });

  test('#2-4 예외상황: sw.lat 값이 유효한 범위가 아님', () => {
    const sw = { lat: -91, lng: 30 };
    const ne = { lat: 30, lng: 30 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });  

  test('#2-5 예외상황: sw.lng 값이 유효한 범위가 아님', () => {
    const sw = { lat: 30, lng: -181 };
    const ne = { lat: 30, lng: 30 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });    

  test('#2-6 예외상황: sw.lng 값이 유효한 범위가 아님', () => {
    const sw = { lat: 30, lng: 181 };
    const ne = { lat: 30, lng: 30 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  }); 
  
  test('#2-7 예외상황: ne.lat 값이 유효한 범위가 아님', () => {
    const sw = { lat: 30, lng: 30 };
    const ne = { lat: 91, lng: 30 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });

  test('#2-8 예외상황: ne.lat 값이 유효한 범위가 아님', () => {
    const sw = { lat: 30, lng: 30 };
    const ne = { lat: -91, lng: 30 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });  

  test('#2-9 예외상황: ne.lng 값이 유효한 범위가 아님', () => {
    const sw = { lat: 30, lng: 30 };
    const ne = { lat: 30, lng: -181 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });    

  test('#2-10 예외상황: ne.lng 값이 유효한 범위가 아님', () => {
    const sw = { lat: 30, lng: 30 };
    const ne = { lat: 30, lng: 181 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });

  test('#2-11 예외상황: sw.lat가 ne.lat와 같음', () => {
    const sw = { lat: 30, lng: 30 };
    const ne = { lat: 30, lng: 40 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });  

  test('#2-11 예외상황: sw.lat가 ne.lat보다 큼', () => {
    const sw = { lat: 40, lng: 30 };
    const ne = { lat: 30, lng: 40 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });

  test('#2-11 예외상황: sw.lng가 ne.lng와 같음', () => {
    const sw = { lat: 30, lng: 30 };
    const ne = { lat: 40, lng: 30 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });  

  test('#2-11 예외상황: sw.lat가 ne.lat보다 큼', () => {
    const sw = { lat: 30, lng: 40 };
    const ne = { lat: 40, lng: 30 };
    expect(() => boundHandler.createBounds(sw, ne)).toThrow();
  });

  test('#3-1 createBoundsByPoints', () => {
    const points = [
      { lat: 10, lng: 10 },
      { lat: 20, lng: 20 },
      { lat: 30, lng: 30 },
    ];
    const bounds = boundHandler.createBoundsByPoints(points);
    expect(bounds.sw).toEqual({ lat: 10, lng: 10 });
    expect(bounds.ne).toEqual({ lat: 30, lng: 30 });
  });

  test('#3-2 createBoundsByPoints', () => {
    const points = [
      { lat: 30, lng: 10 },
      { lat: 20, lng: 20 },
      { lat: 10, lng: 30 },
    ];
    const bounds = boundHandler.createBoundsByPoints(points);
    expect(bounds.sw).toEqual({ lat: 10, lng: 10 });
    expect(bounds.ne).toEqual({ lat: 30, lng: 30 });
  });  

  test('#3-3 createBoundsByPoints', () => {
    const points = [
      { lat: null, lng: null },
      { lat: 30, lng: 10 },
      { lat: 10, lng: 30 },
    ];
    const bounds = boundHandler.createBoundsByPoints(points);
    expect(bounds.sw).toEqual({ lat: 10, lng: 10 });
    expect(bounds.ne).toEqual({ lat: 30, lng: 30 });
  });

  test('#3-4 createBoundsByPoints', () => {
    const points = [
      { lat: 30, lng: 10 },
      { lat: null, lng: null },
      { lat: 10, lng: 30 },
    ];
    const bounds = boundHandler.createBoundsByPoints(points);
    expect(bounds.sw).toEqual({ lat: 10, lng: 10 });
    expect(bounds.ne).toEqual({ lat: 30, lng: 30 });
  });

  test('#3-5 createBoundsByPoints', () => {
    const points = [
      { lat: null, lng: null },
      { lat: 30, lng: 10 },
      { lat: 10, lng: 30 },
    ];
    const bounds = boundHandler.createBoundsByPoints(points);
    expect(bounds.sw).toEqual({ lat: 10, lng: 10 });
    expect(bounds.ne).toEqual({ lat: 30, lng: 30 });
  });
  
  test('#3-6 createBoundsByPoints', () => {
    const points = [
      { lat: 30, lng: 10 },
      null,
      { lat: 10, lng: 30 },
    ];
    const bounds = boundHandler.createBoundsByPoints(points);
    expect(bounds.sw).toEqual({ lat: 10, lng: 10 });
    expect(bounds.ne).toEqual({ lat: 30, lng: 30 });
  });  

  test('#3-7 createBoundsByPoints', () => {
    const points = [
      null,
      { lat: 30, lng: 10 },
      { lat: 10, lng: 30 },
    ];
    const bounds = boundHandler.createBoundsByPoints(points);
    expect(bounds.sw).toEqual({ lat: 10, lng: 10 });
    expect(bounds.ne).toEqual({ lat: 30, lng: 30 });
  });
  
  test('#3-8 createBoundsByPoints', () => {
    const points = [
      { lat: 30, lng: 10 },
      { lat: 10, lng: 30 },
      null,
    ];
    const bounds = boundHandler.createBoundsByPoints(points);
    expect(bounds.sw).toEqual({ lat: 10, lng: 10 });
    expect(bounds.ne).toEqual({ lat: 30, lng: 30 });
  });
});