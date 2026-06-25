import { renderHook, waitFor } from '@testing-library/react';
import {
  fetchDefaultWorkspace,
  useAccessCheckContext
} from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';

import { Relation, useHasRelation } from '../useHasRelation';
import { createQueryWrapper } from '../../utilities/testHelpers';

jest.mock('@project-kessel/react-kessel-access-check');
jest.mock('@project-kessel/react-kessel-access-check/core/api-client');

describe('useHasRelation hook', () => {
  const mockCheckSelf = checkSelf as jest.Mock;
  const mockFetchDefaultWorkspace = fetchDefaultWorkspace as jest.Mock;

  const renderUseHasRelation = () =>
    renderHook(() => useHasRelation(Relation.MANIFESTS_VIEW), {
      wrapper: createQueryWrapper()
    });

  beforeEach(() => {
    jest.clearAllMocks();

    (useAccessCheckContext as jest.Mock).mockReturnValue({});
    mockFetchDefaultWorkspace.mockResolvedValue({
      id: 'workspace-123'
    });
  });

  it('returns true when access check passes', async () => {
    mockCheckSelf.mockResolvedValue({
      allowed: 'ALLOWED_TRUE'
    });

    const { result } = renderUseHasRelation();

    await waitFor(() => {
      expect(result.current.has).toBe(true);
    });
  });

  it('returns false while loading', () => {
    mockCheckSelf.mockResolvedValue({
      allowed: 'ALLOWED_TRUE'
    });

    const { result } = renderUseHasRelation();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.has).toBe(false);
  });

  it('returns false when access check fails', async () => {
    mockCheckSelf.mockResolvedValue({
      allowed: 'ALLOWED_FALSE'
    });

    const { result } = renderUseHasRelation();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.has).toBe(false);
  });

  it('returns false when default workspace fails', async () => {
    mockFetchDefaultWorkspace.mockRejectedValue(new Error('workspace error'));

    const { result } = renderUseHasRelation();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.has).toBe(false);
    expect(mockCheckSelf).not.toHaveBeenCalled();
  });

  it('returns false on query error', async () => {
    mockCheckSelf.mockRejectedValue(new Error('whoops'));

    const { result } = renderUseHasRelation();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.has).toBe(false);
  });

  describe('unexpected response from kessel', () => {
    it('returns false on empty object', async () => {
      mockCheckSelf.mockResolvedValue({});

      const { result } = renderUseHasRelation();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.has).toBe(false);
    });

    it('returns false on unexpected allowed value', async () => {
      mockCheckSelf.mockResolvedValue({
        allowed: 'A_WEIRD_VALUE'
      });

      const { result } = renderUseHasRelation();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.has).toBe(false);
    });
  });
});
