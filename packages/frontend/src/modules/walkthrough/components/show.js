import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showWalkthrough } from 'walkthrough/state';
import { QuestionMark } from 'components/icons';
import styles from './walkthrough.module.scss';

const ShowWalkthrough = ({ onClick }) => <QuestionMark className={styles.show} onClick={onClick} />;

ShowWalkthrough.propTypes = {
  onClick: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(showWalkthrough())
});

export default connect(
  null,
  mapDispatchToProps
)(ShowWalkthrough);
