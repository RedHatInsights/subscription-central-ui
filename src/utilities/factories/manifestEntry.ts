import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { ManifestEntry } from '../../hooks/useSatelliteManifests';

export default Factory.define<ManifestEntry>(() => ({
  entitlementQuantity: faker.datatype.number(100),
  name: faker.lorem.word(10),
  type: 'Satellite',
  url: faker.internet.url(),
  uuid: faker.datatype.uuid(),
  version: '6.9',
  simpleContentAccess: 'enabled'
}));
