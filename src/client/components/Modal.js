import React from 'react';
import PropTypes from 'prop-types';

export default function Modal(props) {
    return (
        <div className="modal">
            <div className="modal-inner">
                {props.children}
            </div>
        </div>
    );
}

Modal.propTypes = {
    children: PropTypes.node,
};
