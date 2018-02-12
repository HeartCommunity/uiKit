// @flow
import React from 'react';
import { shallow } from 'enzyme';

import { SkeletonNavigation } from '../../src/components/js/skeleton';
import SkeletonContainerNavigation from '../../src/components/js/skeleton/SkeletonContainerNavigation';
import SkeletonGlobalNavigation from '../../src/components/js/skeleton/SkeletonGlobalNavigation';

import { global as globalTheme } from '../../src/theme/presets';

describe('<SkeletonGlobalNavigation />', () => {
  it('renders a skeleton representation of the navigation', () => {
    expect(shallow(<SkeletonNavigation />)).toMatchSnapshot();
  });

  it('collapses its inner components', () => {
    expect(shallow(<SkeletonNavigation isCollapsed />)).toMatchSnapshot();
  });

  it('passes the container header down to the container sidebar', () => {
    const DummyContainerHeader = () => <div />;
    const skeleton = shallow(
      <SkeletonNavigation containerHeaderComponent={DummyContainerHeader} />,
    );
    const containerSidebar = skeleton.find(SkeletonContainerNavigation);

    expect(containerSidebar.prop('containerHeaderComponent')).toBe(
      DummyContainerHeader,
    );
  });

  it('passes theme settings to the global and container sidebars', () => {
    const dummyGlobalTheme = { ...globalTheme };
    const dummyContainerTheme = { ...globalTheme };

    const skeleton = shallow(
      <SkeletonNavigation
        globalTheme={dummyGlobalTheme}
        containerTheme={dummyContainerTheme}
      />,
    );
    const containerSidebar = skeleton.find(SkeletonContainerNavigation);
    const globalSidebar = skeleton.find(SkeletonGlobalNavigation);

    expect(globalSidebar.prop('theme')).toBe(dummyGlobalTheme);
    expect(containerSidebar.prop('theme')).toBe(dummyContainerTheme);
  });
});
