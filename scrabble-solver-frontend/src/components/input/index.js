import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'utils';
import Button from 'components/button';
import { Cross } from 'components/icons';
import Section from 'components/section';
import EventsDecorator from './events-decorator';
import styles from './input.module.scss';

const Input = ({ className, id, label, value, onChange = noop, onClear = noop, onKeyDown = noop }) => {
  const inputRef = useRef(null);

  return (
    <Section className={className} label={label} id={id}>
      <div className={styles.input}>
        <input ref={inputRef} type="text" value={value} onChange={onChange} onKeyDown={onKeyDown} />

        <Button
          onClick={() => {
            onClear();
            inputRef.current.focus();
          }}
        >
          <Cross />
        </Button>
      </div>
    </Section>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onKeyDown: PropTypes.func
};

export default EventsDecorator(Input);
