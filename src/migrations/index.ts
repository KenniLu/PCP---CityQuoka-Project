import * as migration_20250116_052204_initial from './20250116_052204_initial';

export const migrations = [
  {
    up: migration_20250116_052204_initial.up,
    down: migration_20250116_052204_initial.down,
    name: '20250116_052204_initial'
  },
];
