import React from 'react';
import { render } from '@testing-library/react';
import DeleteManifestConfirmationModal from '../DeleteManifestConfirmationModal';
import useDeleteSatelliteManifest from '../../../hooks/useDeleteSatelliteManifest';

jest.mock('../../../hooks/useDeleteSatelliteManifest');

describe('DeleteConfirmationModal', () => {
  const props = {
    isOpen: true,
    uuid: '00000000-0000-0000-0000-000000000000',
    name: 'Manifest Name',
    handleModalToggle: (): any => undefined,
    onSuccess: (): any => undefined
  };
  let isLoading = false;

  beforeEach(() => {
    (useDeleteSatelliteManifest as jest.Mock).mockImplementation(() => ({
      isLoading: isLoading,
      isSuccess: false,
      isError: false,
      reset: (): any => undefined
    }));
  });

  it('renders correctly', () => {
    const { getByLabelText } = render(
      <div>
        <DeleteManifestConfirmationModal {...props} />
      </div>
    );

    expect(getByLabelText('Are you sure you want to delete this manifest?')).toBeInTheDocument();
  });

  describe('when performing a delete', () => {
    beforeAll(() => {
      isLoading = true;
    });

    it('renders a spinner', () => {
      const component = render(<DeleteManifestConfirmationModal {...props} />);
      expect(component).toHaveLoader();
    });
  });
});
