import React from 'react';
import PropTypes from 'prop-types';

export default function Modal(props) {
    return (
        <div className={`modal ${props.className}`}>
            <div className="modal-inner">
                {props.children}
            </div>
        </div>
    );
}

Modal.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

Modal.defaultProps = {
    children: null,
    className: '',
};
