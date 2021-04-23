import { MapStorage, FsJsonStorage } from './impl';
import { Bucket, BaseStorage, NestedStorage } from './storage';

const storages = { MapStorage, FsJsonStorage };
export { Bucket, BaseStorage, NestedStorage, storages };
