import React from 'react';
import PropTypes from 'prop-types';

function buttonUser(props) {
  const onClick = () => {
    props.onClick(props.data);
  };

  return (
    <button
      className="peb-input"
      onClick={onClick}
    >
      {props.data.name}
    </button>
  );
}

buttonUser.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default buttonUser;
