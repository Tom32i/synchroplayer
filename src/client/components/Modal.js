import React from 'react';
import PropTypes from 'prop-types';

export default function Modal({ children = null, className = '' }) {
    return (
        <div className={`modal ${className}`}>
            <div className="modal-inner">
                {children}
            </div>
        </div>
    );
}

Modal.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
