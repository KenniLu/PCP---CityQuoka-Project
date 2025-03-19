import * as migration_20250116_052204_initial from './20250116_052204_initial';
import * as migration_20250202_044829_addGoogleFieldsToVenues from './20250202_044829_addGoogleFieldsToVenues';
import * as migration_20250202_141414_fixVenueAddressFields from './20250202_141414_fixVenueAddressFields';
import * as migration_20250306_020744_addFieldsToVenues from './20250306_020744_addFieldsToVenues';
import * as migration_20250306_024920_addSubtitleToPost from './20250306_024920_addSubtitleToPost';
import * as migration_20250312_233909_addAuthTables from './20250312_233909_addAuthTables';
import * as migration_20250319_074319_addReactions from './20250319_074319_addReactions';

export const migrations = [
  {
    up: migration_20250116_052204_initial.up,
    down: migration_20250116_052204_initial.down,
    name: '20250116_052204_initial',
  },
  {
    up: migration_20250202_044829_addGoogleFieldsToVenues.up,
    down: migration_20250202_044829_addGoogleFieldsToVenues.down,
    name: '20250202_044829_addGoogleFieldsToVenues',
  },
  {
    up: migration_20250202_141414_fixVenueAddressFields.up,
    down: migration_20250202_141414_fixVenueAddressFields.down,
    name: '20250202_141414_fixVenueAddressFields',
  },
  {
    up: migration_20250306_020744_addFieldsToVenues.up,
    down: migration_20250306_020744_addFieldsToVenues.down,
    name: '20250306_020744_addFieldsToVenues',
  },
  {
    up: migration_20250306_024920_addSubtitleToPost.up,
    down: migration_20250306_024920_addSubtitleToPost.down,
    name: '20250306_024920_addSubtitleToPost',
  },
  {
    up: migration_20250312_233909_addAuthTables.up,
    down: migration_20250312_233909_addAuthTables.down,
    name: '20250312_233909_addAuthTables',
  },
  {
    up: migration_20250319_074319_addReactions.up,
    down: migration_20250319_074319_addReactions.down,
    name: '20250319_074319_addReactions'
  },
];
