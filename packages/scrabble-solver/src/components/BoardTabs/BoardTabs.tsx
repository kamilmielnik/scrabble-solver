import classNames from 'classnames';
import { type FunctionComponent, type KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Cross from '@/icons/Cross.svg';
import Pencil from '@/icons/Pencil.svg';
import Plus from '@/icons/Plus.svg';
import { noop } from '@/lib/noop';
import {
  boardsSlice,
  createBoard,
  removeBoard,
  selectActiveBoardHasContent,
  selectBoardTabs,
  selectCanRemoveBoard,
  switchBoard,
  useTranslate,
  useTypedSelector,
} from '@/state';

import { ConfirmPopover } from '../ConfirmPopover';
import { IconButton } from '../IconButton';

import styles from './BoardTabs.module.scss';

interface Props {
  className?: string;
}

/**
 * Tabs for the boards the user has on the go.
 *
 * Rename and remove are offered on the active tab only. Putting them on every
 * tab would either widen each one -- and the strip has to survive a phone
 * screen, where the board already takes everything it can get -- or hide them
 * behind a hover that a touch screen cannot express.
 */
const BoardTabsBase: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const tabs = useTypedSelector(selectBoardTabs);
  const canRemove = useTypedSelector(selectCanRemoveBoard);
  const hasContent = useTypedSelector(selectActiveBoardHasContent);
  const [renamingId, setRenamingId] = useState<string>();

  const handleRenamed = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();

      if (trimmed.length > 0) {
        dispatch(boardsSlice.actions.renamed({ id, name: trimmed }));
      }

      setRenamingId(undefined);
    },
    [dispatch],
  );

  const handleRenameCancelled = useCallback(() => setRenamingId(undefined), []);

  return (
    <div aria-label={translate('boards')} className={classNames(styles.tabs, className)} role="tablist">
      {tabs.map((tab) => (
        <div className={classNames(styles.tab, { [styles.active]: tab.isActive })} key={tab.id}>
          {renamingId === tab.id ? (
            <RenameInput
              /*
               * Seeded with the label as shown, not with the stored name: an
               * unnamed board has none, and seeding from the bare position
               * would turn "Board 1" into "1" the moment the user pressed
               * Enter without having changed anything.
               */
              name={tab.name ?? translate('boards.tab', { name: String(tab.number) })}
              onCancel={handleRenameCancelled}
              onCommit={(name) => handleRenamed(tab.id, name)}
            />
          ) : (
            <>
              <button
                aria-controls="board"
                aria-selected={tab.isActive}
                className={styles.label}
                role="tab"
                type="button"
                onClick={() => dispatch(switchBoard(tab.id))}
              >
                {tab.name ?? translate('boards.tab', { name: String(tab.number) })}
              </button>

              {tab.isActive && (
                <IconButton
                  aria-label={translate('boards.rename')}
                  className={styles.action}
                  Icon={Pencil}
                  tooltip={translate('boards.rename')}
                  onClick={() => setRenamingId(tab.id)}
                />
              )}

              {tab.isActive && canRemove && <RemoveButton hasContent={hasContent} id={tab.id} />}
            </>
          )}
        </div>
      ))}

      <IconButton
        aria-label={translate('boards.add')}
        className={styles.add}
        Icon={Plus}
        tooltip={translate('boards.add')}
        onClick={() => dispatch(createBoard())}
      />
    </div>
  );
};

/**
 * Removal is confirmed only when there is something to lose. Asking about an
 * empty board would be a prompt with no stakes, which teaches the user to
 * dismiss the prompt that does have them.
 */
const RemoveButton: FunctionComponent<{ hasContent: boolean; id: string }> = ({ hasContent, id }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();

  const remove = (): void => {
    dispatch(removeBoard(id));
  };

  const button = (
    <IconButton
      aria-label={translate('boards.remove')}
      className={styles.action}
      Icon={Cross}
      tooltip={translate('boards.remove')}
      // When confirming, the popover supplies the click handler that opens it.
      onClick={hasContent ? noop : remove}
    />
  );

  if (!hasContent) {
    return button;
  }

  return (
    <ConfirmPopover
      // Short, because the question above it already says what is removed.
      confirmLabel={translate('common.remove')}
      message={translate('boards.remove-confirm')}
      onConfirm={remove}
    >
      {button}
    </ConfirmPopover>
  );
};

const RenameInput: FunctionComponent<{ name: string; onCancel: () => void; onCommit: (name: string) => void }> = ({
  name,
  onCancel,
  onCommit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(name);
  const isCancelled = useRef(false);

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      isCancelled.current = true;
      event.currentTarget.blur();
    }

    // Stopped here so the board's own key handling does not also see these.
    event.stopPropagation();
  };

  return (
    <input
      className={styles.rename}
      maxLength={24}
      ref={inputRef}
      value={value}
      onBlur={() => (isCancelled.current ? onCancel() : onCommit(value))}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export const BoardTabs = memo(BoardTabsBase);
