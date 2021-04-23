import { MapStorage, FsJsonStorage } from './impl';
import { Storage, Bucket, BaseStorage, NestedStorage } from './storage';

const storages = { MapStorage, FsJsonStorage };
export { Storage, Bucket, BaseStorage, NestedStorage, storages };
