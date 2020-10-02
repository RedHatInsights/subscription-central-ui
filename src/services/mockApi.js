import { SortByDirection } from '@patternfly/react-table';
import Manifests from './manifests.json';

const getSatelliteManifest = ({ page, perPage, searchTerm, sortBy, sortByDirection }) => {
  let data = Manifests.body.filter(manifest => {
    return (manifest.type === 'Satellite');
  });

  // filter
  if (typeof searchTerm === 'string' && searchTerm.length > 0) {
    data = data.filter(entry => {
      return (
        (entry.name || '').toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        (entry.version || '').toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        (entry.uuid || '').toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    });
  }

  // sort
  data = data.sort((a, b) => {
    const term1 = (a[sortBy] || '').toLowerCase();
    const term2 = (b[sortBy] || '').toLowerCase();
    if (term1 < term2) {
      return -1;
    } else if (term1 > term2) {
      return 1;
    } else {
      return 0;
    }
  });
  if (sortByDirection === SortByDirection.desc) {
    data = data.reverse();
  }

  // calculate number of entries
  const quantity = data.length;

  // paginate
  const first = (page - 1) * perPage;
  const last = first + perPage;
  data = data.slice(first, last);

  return { page, perPage, quantity, data };
};

export { getSatelliteManifest };
