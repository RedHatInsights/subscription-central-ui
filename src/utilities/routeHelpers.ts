const getBaseName = (pathname: string): string => {
  let release = '/';
  const pathName = pathname.split('/');

  pathName.shift();

  if (pathName[0] === 'beta') {
    pathName.shift();
    release = `/beta/`;
  }

  return `${release}${pathName[0]}/${pathName[1] || ''}`;
};

const getPartialRouteFromPath = (path: string): string => {
  return path.replace('/insights/subscriptions/manifests', '/').replace('//', '/');
};

export { getPartialRouteFromPath, getBaseName };
