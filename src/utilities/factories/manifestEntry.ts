import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { ManifestEntry } from '../../hooks/useSatelliteManifests';

export default Factory.define<ManifestEntry>(() => ({
  entitlementQuantity: faker.number.int(100),
  name: faker.lorem.word(10),
  type: 'Satellite',
  url: faker.internet.url(),
  uuid: faker.string.uuid(),
  version: '6.9',
  simpleContentAccess: 'enabled'
}));
