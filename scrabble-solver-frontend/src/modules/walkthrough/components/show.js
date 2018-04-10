import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showWalkthrough } from 'walkthrough/state';
import Button from 'components/button';
import { QuestionMark } from 'components/icons';

const ShowWalkthrough = ({ onClick }) => (
  <Button onClick={onClick}>
    <QuestionMark />
  </Button>
);

ShowWalkthrough.propTypes = {
  onClick: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(showWalkthrough())
});

export default connect(null, mapDispatchToProps)(ShowWalkthrough);
