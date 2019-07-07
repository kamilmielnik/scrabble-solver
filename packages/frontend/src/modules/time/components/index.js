import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { selectTime } from 'time/selectors';

import styles from './time.module.scss';

const Time = ({ className, time }) => <div className={classNames(styles.time, className)}>{time}</div>;

Time.propTypes = {
  className: PropTypes.string,
  time: PropTypes.string
};

const mapStateToProps = (state) => ({
  time: selectTime(state)
});

export default connect(mapStateToProps)(Time);
