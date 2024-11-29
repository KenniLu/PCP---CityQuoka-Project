import * as migration_20241129_010502_initial from './20241129_010502_initial';

export const migrations = [
  {
    up: migration_20241129_010502_initial.up,
    down: migration_20241129_010502_initial.down,
    name: '20241129_010502_initial'
  },
];
