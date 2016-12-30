import React from 'react';
import classnames from 'classnames';

import './LoadingSpinner.less';

const LoadingSpinner = ({visible}) => {
    const classes = classnames('loading-spinner', {visible});

    return (
        <div className={classes}></div>
    );
}

export default LoadingSpinner;
