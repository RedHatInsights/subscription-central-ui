import { Factory } from 'fishery';
import { User } from '../../hooks/useUser';

export default Factory.define<User>(() => ({
  canReadManifests: true,
  canWriteManifests: true,
  isOrgAdmin: true,
  isSCACapable: true,
  isEntitled: true
}));
