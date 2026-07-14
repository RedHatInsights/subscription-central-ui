// ------------------------------------------------------------
// TODO: remove file once sdk is used for default workspace fetching
// ------------------------------------------------------------

interface Workspace {
  id: string;
}

export const fetchDefaultWorkspace = async (rbacBaseEndpoint: string) => {
  const url = `${rbacBaseEndpoint.replace(/\/+$/, '')}/api/rbac/v2/workspaces/?type=default&with_ancestry=true`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('failed to fetch default workspace');
  }

  const data: { data: Workspace[] } = await response.json();

  return data.data[0];
};
