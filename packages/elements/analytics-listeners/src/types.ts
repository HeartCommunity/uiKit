import Logger from './helpers/logger';

export type AnalyticsWebClient = {
  sendUIEvent: (event: any) => void;
  sendOperationalEvent: (event: any) => void;
  sendTrackEvent: (event: any) => void;
  sendScreenEvent: (event: any) => void;
};
export type Client = Promise<AnalyticsWebClient>;

export type ListenerProps = {
  children?: React.ReactNode;
  client: Client;
  logger: Logger;
};

export type EventNextType = {
  payload: {
    action: string;
    [key: string]: any;
  };
  context: Array<{}>;
};

export type ListenerFunction = (event: EventNextType) => void;

export enum FabricChannel {
  atlaskit = 'atlaskit',
  elements = 'elements',
  navigation = 'navigation',
  editor = 'editor',
}
