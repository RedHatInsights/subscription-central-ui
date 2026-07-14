import {
  // fetchDefaultWorkspace, TODO: Add back once the sdk is fixed
  useAccessCheckContext
} from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';
import { useQuery } from '@tanstack/react-query';
import { fetchDefaultWorkspace } from '../utilities/fetchDefaultWorkspace'; // TODO remove once sdk is fixed

const QUERY_STALE_TIME = 5 * 60 * 1000;

export enum Relation {
  MANIFESTS_VIEW = 'subscriptions_manifest_view',
  MANIFESTS_EDIT = 'subscriptions_manifest_edit'
}

interface HasRelationResult {
  has: boolean;
  isLoading: boolean;
}

const useDefaultWorkspace = () =>
  useQuery({
    queryKey: ['rbac', 'default-workspace'],
    queryFn: async () => await fetchDefaultWorkspace(window.location.origin),
    staleTime: QUERY_STALE_TIME
  });

export const useHasRelation = (relation: Relation): HasRelationResult => {
  const accessCheckContext = useAccessCheckContext();

  const {
    data: defaultWorkspace,
    isLoading: defaultWorkspaceIsLoading,
    isError: defaultWorkspaceIsError
  } = useDefaultWorkspace();

  const { data: has, isLoading: accessCheckIsLoading } = useQuery({
    queryKey: ['kessel', relation, defaultWorkspace?.id],
    queryFn: async () => {
      if (!defaultWorkspace) {
        throw new Error('default workspace does not exist');
      }

      return (
        (
          await checkSelf(accessCheckContext, {
            relation,
            resource: {
              id: defaultWorkspace.id,
              type: 'workspace',
              reporter: { type: 'rbac' }
            }
          })
        ).allowed === 'ALLOWED_TRUE'
      );
    },
    enabled: !defaultWorkspaceIsLoading && !defaultWorkspaceIsError,
    staleTime: QUERY_STALE_TIME
  });

  return {
    has: !!has,
    isLoading: accessCheckIsLoading || defaultWorkspaceIsLoading
  };
};
