import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showWalkthrough } from 'walkthrough/state';
import Button from 'components/button';
import { QuestionMark } from 'components/icons';
import styles from './styles.scss';

const ShowWalkthrough = ({ onClick }) => (
  <QuestionMark className={styles.show} onClick={onClick} />
);

ShowWalkthrough.propTypes = {
  onClick: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(showWalkthrough())
});

export default connect(null, mapDispatchToProps)(ShowWalkthrough);
