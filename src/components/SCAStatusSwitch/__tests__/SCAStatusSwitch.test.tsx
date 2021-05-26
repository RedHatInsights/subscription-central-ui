import React from 'react';
import { render, fireEvent, getByTestId, waitFor } from '@testing-library/react';
import SCAStatusSwitch from '../SCAStatusSwitch';
import useUpdateManifestSCAStatus from '../../../hooks/useUpdateManifestSCAStatus';

jest.mock('../../../hooks/useUpdateManifestSCAStatus');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SCAStatusSwitch', () => {
  const props = {
    scaStatus: 'enabled',
    uuid: 'abc123'
  };

  it('renders with a spinner when loading', () => {
    (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
      isLoading: true
    }));

    const { container } = render(<SCAStatusSwitch {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders with an error message when an error occurs', () => {
    (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
      isError: true
    }));

    const { container } = render(<SCAStatusSwitch {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders with an error message when the API response does not have 204 status and no data is returned', () => {
    (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
      isError: false,
      isLoading: false,
      isSuccess: true,
      data: null
    }));

    const { container } = render(<SCAStatusSwitch {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders successfully as enabled when success is returned across', () => {
    (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
      isError: false,
      isSuccess: true,
      isLoading: false,
      data: { success: true, status: 204 }
    }));

    const { container } = render(<SCAStatusSwitch {...props} />);
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

    const { container } = render(<SCAStatusSwitch {...props} />);
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

    const { container } = render(<SCAStatusSwitch {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('fires the handleChange when clicked', async () => {
    (useUpdateManifestSCAStatus as jest.Mock).mockImplementation(() => ({
      isError: false,
      isSuccess: false,
      isLoading: false,
      mutate: (): unknown => null
    }));

    const { container } = render(<SCAStatusSwitch {...props} />);
    fireEvent.click(getByTestId(container, 'sca-status-switch'));
    await waitFor(() => expect(useUpdateManifestSCAStatus).toHaveBeenCalledTimes(1));
  });
});
