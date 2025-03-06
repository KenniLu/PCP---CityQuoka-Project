import * as migration_20250116_052204_initial from './20250116_052204_initial';
import * as migration_20250202_044829_addGoogleFieldsToVenues from './20250202_044829_addGoogleFieldsToVenues';
import * as migration_20250202_141414_fixVenueAddressFields from './20250202_141414_fixVenueAddressFields';
import * as migration_20250306_020744_addFieldsToVenues from './20250306_020744_addFieldsToVenues';

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
    name: '20250306_020744_addFieldsToVenues'
  },
];
