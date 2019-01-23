import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import InlineDialog from '@atlaskit/inline-dialog';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next-types';
import { ShareButton } from './ShareButton';
import { ShareForm } from './ShareForm';
import { messages } from '../i18n';

type RenderChildren = (
  openModal: Function,
  { loading, error }: { loading: boolean; error: ShareError },
) => React.ReactNode;

type DialogState = {
  isDialogOpen: boolean;
  isSharing: boolean;
  isStateValidWithCapabilities: boolean;
  shareError: ShareError;
};

export type DialogContentState = {
  users: User[];
  comment?: Comment;
};

export type User = UserWithId | UserWithEmail;

type UserWithId = {
  type: 'user' | 'group' | 'team';
  id: string;
};

type UserWithEmail = {
  email: string;
};

type Comment = {
  type: string;
  value: string;
};

type ShareError = {
  message: string;
} | null;

type InvitationsCapabilities = {
  directInvite: DirectInviteCapabilities;
  invitePendingApproval: RequestAccessCapabilities;
};

type DirectInviteCapabilities = {
  mode: 'NONE' | 'ANYONE' | 'DOMAIN_RESTRICTED';
  domains?: string[];
  permittedResources: string[];
};

type RequestAccessCapabilities = {
  mode: 'NONE' | 'ANYONE';
  permittedResources: string[];
};

type Props = {
  buttonStyle?: 'default' | 'withText';
  capabilities?: InvitationsCapabilities;
  copyLink: string;
  children?: RenderChildren;
  isDisabled?: boolean;
  loadOptions?: any;
  onLinkCopy?: Function;
  onCommentChange?: (comment: Comment) => any;
  onSubmit?: (dialogContentState: DialogContentState) => Promise<any>;
  onUsersChange?: (users: User[]) => any;
  shouldShowCommentField?: boolean;
  shouldCloseOnEscapePress?: boolean;
  validateStateWithCapabilities?: (
    state: DialogContentState,
    capabilities: InvitationsCapabilities,
  ) => boolean;
};

export const defaultDialogContentState: DialogContentState = {
  users: [],
  comment: {
    type: '',
    value: '',
  },
};

export class ShareDialogTrigger extends React.Component<
  Props,
  DialogState & DialogContentState
> {
  static defaultProps = {
    buttonAppearance: 'default',
    capabilities: {},
    isDisabled: false,
    isSharing: false,
    shouldCloseOnEscapePress: false,
  };

  state = {
    isDialogOpen: false,
    isSharing: false,
    isStateValidWithCapabilities: true,
    shareError: null,
    ...defaultDialogContentState,
  };

  static getDerivedStateFromProps(props, state) {
    const { capabilities, validateStateWithCapabilities } = props;

    if (
      !state.isDialogOpen ||
      !validateStateWithCapabilities ||
      !capabilities
    ) {
      return state;
    }

    return {
      ...state,
      isStateValidWithCapabilities: validateStateWithCapabilities(
        state,
        capabilities,
      ),
    };
  }

  handleOpenDialog = (
    e: React.MouseEvent<HTMLButtonElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    // TODO: send analytics

    this.setState({
      isDialogOpen: true,
    });
  };

  handleCloseDialog = ({ isOpen, event }) => {
    // clear the state when it is an escape press or a succesful submit
    if (event!.type === 'keyPress' || event!.type === 'submit') {
      this.clearDialogContentState();
    }

    // TODO: send analytics

    this.setState({
      isDialogOpen: false,
    });
  };

  clearDialogContentState = () => {
    this.setState(defaultDialogContentState);
  };

  handleShareUsersChange = (users: User[]) => {
    this.setState({ users });

    if (this.props.onUsersChange) {
      this.props.onUsersChange!(users);
    }
  };

  handleShareCommentChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLTextAreaElement;
    const comment: Comment = {
      type: 'plain',
      value: target!.value,
    };

    this.setState({ comment });

    if (this.props.onCommentChange) {
      this.props.onCommentChange!(comment);
    }
  };

  handleShareSubmit = event => {
    if (!this.props.onSubmit) {
      return;
    }

    const dialogContentState = {
      users: this.state.users,
      comment: this.state.comment,
    };

    this.setState({ isSharing: true });

    this.props.onSubmit!(dialogContentState)
      .then(res => {
        this.handleCloseDialog({ isOpen: false, event });
        this.setState({ isSharing: false });
      })
      .catch(err => {
        this.handleShareFailure(err);
        this.setState({ isSharing: false });
      });
  };

  handleShareFailure = err => {
    // TBC: FS-3429 replace send button with retry button
    // will need a prop to pass through the error message to the ShareForm
  };

  render() {
    const {
      isDialogOpen,
      isSharing,
      isStateValidWithCapabilities,
      shareError,
    } = this.state;
    const { copyLink, isDisabled, loadOptions } = this.props;

    // for performance purposes, we may want to have a lodable content i.e. ShareForm
    return (
      <div>
        <InlineDialog
          content={
            <ShareForm
              copyLink={copyLink}
              loadOptions={loadOptions}
              isSharing={isSharing}
              onCommentChange={this.handleShareCommentChange}
              onUsersChange={this.handleShareUsersChange}
              onShareClick={this.handleShareSubmit}
              shareError={shareError}
              shouldShowCapabilitiesInfoMessage={!isStateValidWithCapabilities}
            />
          }
          isOpen={isDialogOpen}
          onClose={this.handleCloseDialog}
        >
          {this.props.children ? (
            this.props.children(this.handleOpenDialog, {
              loading: isSharing,
              error: shareError,
            })
          ) : (
            <ShareButton
              text={
                this.props.buttonStyle === 'withText' ? (
                  <FormattedMessage {...messages.shareTriggerButtonText} />
                ) : null
              }
              onClick={this.handleOpenDialog}
              isSelected={isDialogOpen}
              isDisabled={isDisabled}
            />
          )}
        </InlineDialog>
      </div>
    );
  }
}
