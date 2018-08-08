// @flow

import React, { type Node } from 'react';
import { mount } from 'enzyme';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme';
import Tooltip from '../../Tooltip';
import { Tooltip as StyledTooltip } from '../../../styled';
import { hoveredPayload } from '../../utils/analytics-payloads';

jest.useFakeTimers();

// Tooltip makes fairly heavy use of timers so we have to runAllTimers after
// simulating events. Unfortuantely, these timers cause enzyme's understanding of
// the component tree to become stale so we call update to refresh that.
const simulate = (wrapper, query, event) => {
  wrapper.find(query).simulate(event);
  jest.runAllTimers();
  wrapper.update();
};

let wrapper;

afterEach(() => wrapper && wrapper.unmount());

const Target = ({ children }: { children: Node }) => <div>{children}</div>;

test('tooltip should not be shown by default', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content">
      <Target>foo</Target>
    </Tooltip>,
  );
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
});

test('tooltip should be visible when target is hovered', () => {
  const spy = jest.fn();
  wrapper = mount(
    <Tooltip content="Tooltip content" onShow={spy}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find(StyledTooltip).text()).toEqual('Tooltip content');
  expect(spy).toHaveBeenCalledTimes(1);
});

test('tooltip should be hidden when target is unhovered', () => {
  const spy = jest.fn();
  wrapper = mount(
    <Tooltip content="Tooltip content" onHide={spy}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find(StyledTooltip).text()).toEqual('Tooltip content');
  // unhover
  simulate(wrapper, Target, 'mouseout');
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('tooltip should be visible after target is clicked', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content">
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  simulate(wrapper, Target, 'click');
  expect(wrapper.find(StyledTooltip).text()).toEqual('Tooltip content');
});

test('tooltip should be hidden after target click with hideTooltipOnClick set', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content" hideTooltipOnClick>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  simulate(wrapper, Target, 'click');
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
});

test('tooltip should render whatever is passed to component prop', () => {
  const Popup = () => <div>Hi</div>;
  wrapper = mount(
    <Tooltip content={<Popup />}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find(Popup)).toHaveLength(1);
});

test('tooltip wrapping element should be a div by default', () => {
  wrapper = mount(
    <Tooltip tag="span">
      <Target>foo</Target>
    </Tooltip>,
  );
  expect(wrapper.getDOMNode().tagName).toEqual('SPAN');
});

test('tooltip wrapping element should be whatever is passed as tag prop', () => {
  wrapper = mount(
    <Tooltip tag="span">
      <Target>foo</Target>
    </Tooltip>,
  );
  expect(wrapper.getDOMNode().tagName).toEqual('SPAN');
});

test('tooltip should wait a default delay before showing', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content">
      <Target>foo</Target>
    </Tooltip>,
  );
  wrapper.find(Target).simulate('mouseover');
  jest.runTimersToTime(299);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
  jest.runTimersToTime(1);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(1);
});

test('tooltip should wait a configuable delay before showing', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content" delay={1000}>
      <Target>foo</Target>
    </Tooltip>,
  );
  wrapper.find(Target).simulate('mouseover');
  jest.runTimersToTime(999);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
  jest.runTimersToTime(1);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(1);
});

test('tooltip should wait a default delay before hiding', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content">
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  wrapper.find(Target).simulate('mouseout');
  jest.runTimersToTime(299);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(1);
  jest.runTimersToTime(130);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
});

test('tooltip should wait a configuable delay before hiding', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content" delay={1000}>
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  wrapper.find(Target).simulate('mouseout');
  jest.runTimersToTime(999);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(1);
  jest.runTimersToTime(130);
  wrapper.update();
  expect(wrapper.find(StyledTooltip)).toHaveLength(0);
});

test('tooltips should show and hide immediately once one has opened', () => {
  wrapper = mount(
    <div>
      <Tooltip content="button one tooltip">
        <Target>button one</Target>
      </Tooltip>
      <Tooltip content="button two tooltip">
        <Target>button two</Target>
      </Tooltip>
    </div>,
  );
  const targetOne = wrapper.find(Target).at(0);
  const targetTwo = wrapper.find(Target).at(1);
  targetOne.simulate('mouseover');
  jest.runAllTimers();
  targetOne.simulate('mouseout');
  targetTwo.simulate('mouseover');
  jest.runTimersToTime(1);
  wrapper.update();
  expect(wrapper.find(StyledTooltip).text()).toEqual('button two tooltip');
});

test('tooltip should render popup in Portal with specific z-index', () => {
  wrapper = mount(
    <Tooltip content="Tooltip content">
      <Target>foo</Target>
    </Tooltip>,
  );
  simulate(wrapper, Target, 'mouseover');
  expect(wrapper.find(Portal).prop('zIndex')).toEqual(layers.tooltip());
});

describe('TooltipWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
    jest.useFakeTimers();
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
    jest.useRealTimers();
  });

  it('should mount without errors', () => {
    mount(
      <Tooltip content="Tooltip content">
        <div>foo</div>
      </Tooltip>,
    );
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });

  it('should send analytics event when tooltip becomes visible', () => {
    const Foo = () => <div>foo</div>;
    const spy = jest.fn();
    wrapper = mount(
      <AnalyticsListener channel="atlaskit" onEvent={spy}>
        <Tooltip content="Tooltip content">
          <Foo />
        </Tooltip>
      </AnalyticsListener>,
    );
    wrapper.find(Foo).simulate('mouseover');
    jest.runTimersToTime(301);
    wrapper.find(Foo).simulate('mouseout');
    jest.runTimersToTime(300);
    expect(spy).toHaveBeenCalledTimes(1);
    const [[{ payload }]] = spy.mock.calls;
    expect(payload).toEqual(hoveredPayload);
  });
});
