const inverseDirection = (direction: 'left' | 'right'): 'left' | 'right' => {
  return direction === 'left' ? 'right' : 'left';
};

export default inverseDirection;
