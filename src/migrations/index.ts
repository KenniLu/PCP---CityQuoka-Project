import * as migration_20241129_010502_initial from './20241129_010502_initial';
import * as migration_20241205_014304_add_media_prefix from './20241205_014304_add_media_prefix';

export const migrations = [
  {
    up: migration_20241129_010502_initial.up,
    down: migration_20241129_010502_initial.down,
    name: '20241129_010502_initial',
  },
  {
    up: migration_20241205_014304_add_media_prefix.up,
    down: migration_20241205_014304_add_media_prefix.down,
    name: '20241205_014304_add_media_prefix'
  },
];
