import React from 'react';
import PropTypes from 'prop-types';
import { black } from 'utils/colors';

const Spinner = ({ className, color = black, duration = '2s', size = 50 }) => {
  const sharedProps = {
    dur: duration,
    calcMode: 'spline',
    keySplines: '0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1',
    keyTimes: '0;0.25;0.5;0.75;1',
    repeatCount: 'indefinite'
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid">
      <circle cx="84" cy="50" r="1.64154" fill={color}>
        <animate {...sharedProps} attributeName="r" values="10;0;0;0;0" begin="0s" />
        <animate {...sharedProps} attributeName="cx" values="84;84;84;84;84" begin="0s" />
      </circle>
      <circle cx="78.4188" cy="50" r="10" fill={color}>
        <animate {...sharedProps} attributeName="r" values="0;10;10;10;0" begin="-1s" />
        <animate {...sharedProps} attributeName="cx" values="16;16;50;84;84" begin="-1s" />
      </circle>
      <circle cx="44.4188" cy="50" r="10" fill={color}>
        <animate {...sharedProps} attributeName="r" values="0;10;10;10;0" begin="-0.5s" />
        <animate {...sharedProps} attributeName="cx" values="16;16;50;84;84" begin="-0.5s" />
      </circle>
      <circle cx="16" cy="50" r="8.35846" fill={color}>
        <animate {...sharedProps} attributeName="r" values="0;10;10;10;0" begin="0s" />
        <animate {...sharedProps} attributeName="cx" values="16;16;50;84;84" begin="0s" />
      </circle>
      <circle cx="16" cy="50" r="0" fill={color}>
        <animate {...sharedProps} attributeName="r" values="0;0;10;10;10" begin="0s" />
        <animate {...sharedProps} attributeName="cx" values="16;16;16;50;84" begin="0s" />
      </circle>
    </svg>
  );
};

Spinner.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  duration: PropTypes.string,
  size: PropTypes.number
};

export default Spinner;
