import * as React from 'react';
import { Component } from 'react';
import EmojiErrorMessage from './EmojiErrorMessage';
import AkButton from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

import { EmojiDescription } from '../../types';
import * as styles from './styles';
import CachingEmoji from './CachingEmoji';

export interface OnDeleteEmoji {
  (emoji: EmojiDescription): Promise<boolean>;
}

export interface Props {
  emoji: EmojiDescription;
  onDeleteEmoji: OnDeleteEmoji;
  onCloseDelete: () => void;
  errorMessage?: string;
}

export interface State {
  loading: boolean;
  error: boolean;
}

export default class EmojiDeletePreview extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.emoji.id !== this.props.emoji.id) {
      this.setState({ error: false });
    }
  }

  private onSubmit = () => {
    const { emoji, onDeleteEmoji, onCloseDelete } = this.props;
    if (!this.state.loading) {
      this.setState({ loading: true });
      return onDeleteEmoji(emoji).then(success => {
        if (success) {
          return onCloseDelete();
        }
        this.setState({
          loading: false,
          error: true,
        });
      });
    }
  };

  private onCancel = () => {
    this.props.onCloseDelete();
  };

  render() {
    const { emoji } = this.props;
    const { loading, error } = this.state;

    const submitButton = error ? (
      <AkButton
        className={styles.submitDelete}
        appearance="warning"
        onClick={this.onSubmit}
      >
        {loading ? <Spinner /> : 'Retry'}
      </AkButton>
    ) : (
      <AkButton
        className={styles.submitDelete}
        appearance="danger"
        onClick={this.onSubmit}
      >
        {loading ? <Spinner invertColor={true} /> : 'Remove'}
      </AkButton>
    );

    return (
      <div className={styles.deletePreview}>
        <div className={styles.deleteText}>
          <h5>Remove emoji</h5>
          All existing instances of this emoji will be replaced with{' '}
          {emoji.shortName}
        </div>
        <div className={styles.deleteFooter}>
          <CachingEmoji emoji={emoji} />
          {error ? (
            <EmojiErrorMessage
              message="Remove failed"
              className={styles.emojiDeleteErrorMessage}
            />
          ) : null}
          <div className={styles.previewButtonGroup}>
            {submitButton}
            <AkButton appearance="subtle" onClick={this.onCancel}>
              Cancel
            </AkButton>
          </div>
        </div>
      </div>
    );
  }
}
