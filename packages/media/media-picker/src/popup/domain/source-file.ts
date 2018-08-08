import { Auth, isClientBasedAuth } from '@atlaskit/media-core';

export type ClientBasedSourceFileOwner = {
  readonly id: string;
  readonly token: string;
  readonly baseUrl: string;
};

export type AsapBasedSourceFileOwner = {
  readonly asapIssuer: string;
  readonly token: string;
  readonly baseUrl: string;
};

export type SourceFileOwner =
  | ClientBasedSourceFileOwner
  | AsapBasedSourceFileOwner;

export type SourceFile = {
  id: string;
  collection?: string;
  owner: SourceFileOwner;
};

export function mapAuthToSourceFileOwner(auth: Auth): SourceFileOwner {
  if (isClientBasedAuth(auth)) {
    return {
      id: auth.clientId,
      token: auth.token,
      baseUrl: auth.baseUrl,
    };
  } else {
    return auth;
  }
}
