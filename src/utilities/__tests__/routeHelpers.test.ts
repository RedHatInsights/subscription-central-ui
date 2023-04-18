import { getBaseName, getPartialRouteFromPath } from '..';

describe('utilities/getBaseName', () => {
  it('should find the right base name on Stable', () => {
    expect(getBaseName('/insights/foo/bar/baz')).toEqual('/insights/foo');
    expect(getBaseName('/rhcs/bar/bar/baz')).toEqual('/rhcs/bar');
  });

  it('should find the right base name on Beta', () => {
    expect(getBaseName('/preview/insights/foo/bar/baz')).toEqual('/preview/insights/foo');
    expect(getBaseName('/preview/test/fff/bar/baz')).toEqual('/preview/test/fff');
  });

  it('should find the right base name not on Beta with a shorter url', () => {
    expect(getBaseName('/insights')).toEqual('/insights/');
  });
});

describe('getPartialRouteFromPath method', () => {
  it('gets the root partial correctly', () => {
    expect(getPartialRouteFromPath('/insights/subscriptions/manifests')).toEqual('/');
  });

  it('gets the root partial correctly with a trailing slash', () => {
    expect(getPartialRouteFromPath('/insights/subscriptions/manifests/')).toEqual('/');
  });

  it('gets the oops route correctly', () => {
    expect(getPartialRouteFromPath('/insights/subscriptions/manifests/oops')).toEqual('/oops');
  });
});
