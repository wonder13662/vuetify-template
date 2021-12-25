import { v4 as uuidv4 } from 'uuid';

const nameMap = new Map();
const idMap = new Map();

export default {
  register(resourceName) {
    if (!resourceName) {
      throw new Error('파라미터가 유효하지 않습니다.');
    }

    const id = uuidv4();
    const key = resourceName;
    if (!nameMap.has(key)) {
      nameMap.set(key, [id]);
    } else {
      nameMap.set(key, [...nameMap.get(key), id]);
    }

    idMap.set(id, key);

    return id;
  },
  unregister(id) {
    if (!idMap.has(id)) return;

    const name = idMap.get(id);
    if (!name) return;

    // 1. nameMap에 등록된 id들 중에서 입력받은 id만 제거
    const ids = nameMap.get(name).filter((v) => v !== id);
    nameMap.set(name, ids);

    // 2. idMap에 등록된 id와 값을 제거
    idMap.delete(id);
  },
  has(resourceName) {
    const key = resourceName;

    if (!nameMap.has(key)) {
      return false;
    }

    const ids = nameMap.get(key);
    return ids && ids.length > 0;
  },
};
