// @flow

import AnalyticsEvent from './AnalyticsEvent';
import type {
  AnalyticsEventUpdater,
  ObjectType,
  UIAnalyticsEventHandlerSignature,
  UIAnalyticsEventInterface,
  UIAnalyticsEventProps,
} from './types';

const { warn } = console;

export default class UIAnalyticsEvent extends AnalyticsEvent
  implements UIAnalyticsEventInterface {
  context: Array<ObjectType>;
  handlers: Array<UIAnalyticsEventHandlerSignature>;
  hasFired: boolean;

  constructor(props: UIAnalyticsEventProps) {
    super(props);
    this.context = props.context || [];
    this.handlers = props.handlers || [];
    this.hasFired = false;
  }

  clone = (): UIAnalyticsEvent | null => {
    if (this.hasFired) {
      warn("Cannot clone an event after it's been fired.");
      return null;
    }
    const context = [...this.context];
    const handlers = [...this.handlers];
    const payload = JSON.parse(JSON.stringify(this.payload));
    return new UIAnalyticsEvent({ context, handlers, payload });
  };

  fire = (channel?: string) => {
    if (this.hasFired) {
      warn('Cannot fire an event twice.');
      return;
    }
    this.handlers.forEach(handler => {
      handler(this, channel);
    });
    this.hasFired = true;
  };

  update(updater: AnalyticsEventUpdater): this {
    if (this.hasFired) {
      warn("Cannot update an event after it's been fired.");
      return this;
    }
    return super.update(updater);
  }
}
