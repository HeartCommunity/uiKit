import { EditorState, StateField, PluginKey, Transaction } from 'prosemirror-state';
import { Dispatch } from '../event-dispatcher';
/**
 * Creates a ProseMirror plugin's state and handles UI updates.
 *
 * Here're a few things to keep in mind:
 * - plugin's state is stored as a single object
 * - `Reducer` specifies how plugin's state changes in response to actions sent from ProseMirror commands: (previousState, action) => newState
 * - `Action` describes only what happen, but not how state changes
 * - `mapping` could be used to map ProseMirror positions stored in plugin's state
 *
 * Example:
 *  const { createPluginState, createAction, getPluginState } = pluginFactory<TablePluginState, TableAction>({
 *    reducer,
 *    dispatch,
 *    pluginKey
 *  });
 *
 *  export const createPlugin = (dispatch: Dispatch) =>
 *    new Plugin({
 *      state: createPluginState(dispatch),
 *      key: pluginKey
 *    });
 *
 * Example of a reducer:
 *
 *  export const reducer = (
 *    state: TablePluginState,
 *    action: TableAction,
 *  ): TablePluginState => {
 *    switch (action.type) {
 *      case TableActionTypes.TOGGLE_CONTEXTUAL_MENU:
 *      return {
 *        ...state,
 *        isContextualMenuOpen: !state.isContextualMenuOpen,
 *      };
 *    default:
 *      break;
 *    }
 *    return state;
 *  };
 *
 *
 * Example of an action:
 *
 *  export const toggleContextualMenu: Command = (state, dispatch) => {
 *    if (dispatch) {
 *      dispatch(
 *        createAction(state.tr, {
 *          type: TableActionTypes.TOGGLE_CONTEXTUAL_MENU,
 *        })
 *        .setMeta('addToHistory', false),
 *      );
 *    }
 *    return true;
 *  };
 *
 */
export declare type Reducer<State, Action> = (state: State, action: Action) => State;
export declare function pluginFactory<State, Action>(props: {
    pluginKey: PluginKey;
    reducer: Reducer<State, Action>;
    initialState?: State;
    mapping?: (tr: Transaction, state: State) => State;
    onDocChanged?: (state: State) => State;
    onSelectionChanged?: (state: State) => State;
}): {
    createPluginState: (dispatch: Dispatch) => StateField<State>;
    createAction: (tr: Transaction, action: Action) => Transaction;
    getPluginState: (editorState: EditorState) => State;
};
