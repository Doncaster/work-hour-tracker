import React from 'react';

import './Radio.less';

export default class Radio extends React.Component {

    _onChange = event => {
        this.props.onChange(event.target.value);
    }

    _radioButtons =radios => radios.map((radio, index) =>
            <label key={index} className="radio-inline">
                <input type="radio" value={radio.value} onChange={this._onChange} checked={this.props.value === radio.value} /> {radio.label}
            </label>
        )

    _wrap = content => this.props.wrapperClass ? <div className={this.props.wrapperClass}>{content}</div> : content

    render() {
        return (
            this._wrap(
                <div className="form-group radio-input">
                    <label>{this.props.label}</label><br/>
                    {this._radioButtons(this.props.radios)}
                </div>
            )
        );
    }
};
