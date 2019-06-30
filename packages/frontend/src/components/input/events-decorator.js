import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'utils';

const EventsDecorator = (Component) => {
  const DecoratedComponent = ({ onKeyDown = noop, onSubmit, ...props }) => (
    <Component
      {...props}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onSubmit(event);
        }
        onKeyDown(event);
      }}
    />
  );

  DecoratedComponent.propTypes = {
    onKeyDown: PropTypes.func,
    onSubmit: PropTypes.func.isRequired
  };

  return DecoratedComponent;
};

export default EventsDecorator;
