import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'utils';
import Button from 'components/button';
import { Cross } from 'components/icons';
import Section from 'components/section';
import EventsDecorator from './events-decorator';
import styles from './styles.scss';

const Input = ({ className, label, value, onChange = noop, onClear = noop, onKeyDown = noop }) => (
  <Section className={className} label={label}>
    <div className={styles.input}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown} />

      <Button onClick={onClear}>
        <Cross />
      </Button>
    </div>
  </Section>
);

Input.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onKeyDown: PropTypes.func
};

export default EventsDecorator(Input);
