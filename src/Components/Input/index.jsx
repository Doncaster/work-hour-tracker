import React from 'react';
import classnames from 'classnames';

export default class Input extends React.Component {

    _onChange = event => {
        this.props.onChange(event.target.value);
    }

    _wrap = content => this.props.wrapperClass ? <div className={this.props.wrapperClass}>{content}</div> : content

    render() {
        const formClasses = classnames('form-group', {'has-error': !this.props.isValid})
        return (
            this._wrap(
                <div className={formClasses}>
                    <label>{this.props.label}</label>
                    <input
                        className="form-control"
                        type={this.props.type}
                        placeholder={this.props.placeHolder}
                        onChange={this._onChange}
                        value={this.props.value}/>
                </div>
            )
        );
    }
};

