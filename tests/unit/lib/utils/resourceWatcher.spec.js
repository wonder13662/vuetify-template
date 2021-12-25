import resourceWatcher from '@/lib/socket/resourceWatcher';
import { 
  RESOURCE_DELIVERY,
} from '@/lib/constants';


describe('lib/utils/registry.js', () => {
  let id;
  test('#1 어플리케이션에서 구독하는 리소스를 추가합니다', () => {
    id = resourceWatcher.register(RESOURCE_DELIVERY);
    expect(id).toBeDefined();
    
    expect(resourceWatcher.has(RESOURCE_DELIVERY)).toBeTruthy();
  });

  test('#2 어플리케이션에서 구독하는 리소스를 지웁니다', () => {
    resourceWatcher.unregister(id);
    expect(resourceWatcher.has(RESOURCE_DELIVERY)).toBeFalsy();
  });    
});
