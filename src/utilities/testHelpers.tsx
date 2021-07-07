import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WrapperComponent } from '@testing-library/react-hooks';
import faker from 'faker';
import { ManifestEntry } from '../hooks/useSatelliteManifests';

interface wrapperProps {
  children: ReactNode;
}

export const createMockManifests = (numManifests: number): ManifestEntry[] => {
  const mockManifests: ManifestEntry[] = [];

  for (let i = 0; i < numManifests; i++) {
    const newManifest: ManifestEntry = {
      entitlementQuantity: faker.datatype.number(100),
      name: faker.lorem.word(10),
      type: 'Satellite',
      url: faker.internet.url(),
      uuid: faker.datatype.uuid(),
      version: '6.9',
      simpleContentAccess: 'enabled'
    };
    mockManifests.push(newManifest);
  }
  return mockManifests;
};

export const createQueryWrapper = (): WrapperComponent<unknown> => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: wrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return wrapper;
};
