import React from 'react';
import { render, fireEvent, getByTestId, waitFor } from '@testing-library/react';
import { QueryClient } from 'react-query';
import SCAStatusSwitch from '../SCAStatusSwitch';
import useUpdateManifestSCAStatus from '../../../hooks/useUpdateManifestSCAStatus';
import factories from '../../../utilities/factories';
import { get, def } from 'bdd-lazy-var';

jest.mock('../../../hooks/useUser');
jest.mock('../../../hooks/useUpdateManifestSCAStatus');

const queryClient = new QueryClient();

describe('Satellite Manifest Panel', () => {
  describe('SCAStatusSwitch', () => {
    def('scaCapable', () => true);
    def('canReadManifests', () => true);
    def('canWriteManifests', () => true);
    def('user', () => {
      return factories.user.build({
        isSCACapable: get('scaCapable'),
        canWriteManifests: get('canWriteManifests'),
        canReadManifests: get('canReadManifests')
      });
    });
    def('props', () => {
      return {
        data: get('data'),
        isError: get('Error'),
        user: get('user')
      };
    });

    beforeEach(() => {
      queryClient.setQueryData('user', get('user'));
    });

    const props = {
      scaStatus: 'enabled',
      uuid: 'abc123'
    };
    beforeEach(() => {
      queryClient.setQueryData('user', get('user'));
    });

    it('renders with a spinner when loading', () => {
      (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
        isLoading: true
      }));

      const { container } = render(<SCAStatusSwitch user={factories.user.build()} {...props} />);
      expect(container).toMatchSnapshot();
    });

    it('renders with an error message when an error occurs', () => {
      (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
        isError: true
      }));

      const { container } = render(
        <SCAStatusSwitch user={factories.user.build({ canWriteManifests: false })} {...props} />
      );
      expect(container).toMatchSnapshot();
    });

    it('renders with an error message when the API response does not have 204 status and no data is returned', () => {
      (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
        isError: false,
        isLoading: false,
        isSuccess: true,
        data: null
      }));

      const { container } = render(<SCAStatusSwitch user={factories.user.build()} {...props} />);
      expect(container).toMatchSnapshot();
    });

    it('renders successfully as enabled when success is returned across', () => {
      (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
        isError: false,
        isSuccess: true,
        isLoading: false,
        data: { success: true, status: 204 }
      }));

      const { container } = render(<SCAStatusSwitch user={factories.user.build()} {...props} />);
      expect(container).toMatchSnapshot();
    });

    it('renders successfully as disabled when success is returned across', () => {
      (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
        isError: false,
        isSuccess: true,
        isLoading: false,
        data: { success: true, status: 204 }
      }));
      const props = {
        scaStatus: 'disabled',
        uuid: 'abc123'
      };

      const { container } = render(<SCAStatusSwitch user={factories.user.build()} {...props} />);
      expect(container).toMatchSnapshot();
    });

    it('renders as disallowed when disallowed is passed as scaStatus', () => {
      (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
        isError: false,
        isSuccess: false,
        isLoading: false
      }));
      const props = {
        scaStatus: 'disallowed',
        uuid: 'abc123'
      };

      const { container } = render(<SCAStatusSwitch user={factories.user.build()} {...props} />);
      expect(container).toMatchSnapshot();
    });

    it('fires the handleChange when clicked', async () => {
      (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
        isError: false,
        isSuccess: false,
        isLoading: false,
        mutate: (): unknown => null
      }));

      const { container } = render(<SCAStatusSwitch user={factories.user.build()} {...props} />);
      fireEvent.click(getByTestId(container, 'sca-status-switch'));
      await waitFor(() => expect(useUpdateManifestSCAStatus).toHaveBeenCalledTimes(1));
    });

    describe('when user does not have write permission', () => {
      def('canWriteManifests', () => false);

      it('displays disabled state of the SCA toggle ', () => {
        (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
          isError: false,
          isSuccess: false,
          isLoading: false
        }));

        const { container } = render(<SCAStatusSwitch user={factories.user.build()} {...props} />);

        expect(container).toMatchSnapshot();
      });
    });
  });
});
