import React from 'react';
import classNames from 'classNames';

import './LoadingSpinner.less';

const LoadingSpinner = ({visible}) => {
    const classes = classNames('loading-spinner', {visible});

    return (
        <div className={classes}></div>
    );
}

export default LoadingSpinner;
