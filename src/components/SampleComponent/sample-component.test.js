import SampleComponent from './SampleComponent';

describe('SampleComponent', () => {
  it('expect SampleComponent to render children', () => {
    const children = '<h1>Hello</h1>';

    const wrapper = shallow(
      <SampleComponent>
        { children }
      </SampleComponent>
    );
    expect(wrapper.prop('children')).toContain(children);
  });
});
