import React from "react";

export default class ValidatableInput extends React.Component {

    static displayName = 'ValidatableInput';

    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            value: props.value
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            value: props.value
        });
    }

    _wrap = content => this.props.wrapperClass ? <div className={this.props.wrapperClass}>{content}</div> : content

    _onFieldChanged = event => {
        if(!this.props.validator || this.props.validator(event.target.value)) {
            this.setState({
                hasError: false,
                value: event.target.value
            });
            this.props.onChange(event.target.value);
        } else {
            this.setState({
                hasError: true,
                value: event.target.value
            });
        }
    }

    render() {
        return (
            this._wrap(
                <div className={this.state.hasError ? "form-group has-error" : "form-group"}>
                    <label>{this.props.label}</label>
                    <input
                        className="form-control"
                        type={this.props.type}
                        placeholder={this.props.placeHolder}
                        onChange={this._onFieldChanged}
                        value={this.state.value}/>
                </div>
            )
        );
    }
};

ValidatableInput.propTypes = {
    wrapperClass: React.PropTypes.string,
    type: React.PropTypes.string.isRequired,
    placeHolder: React.PropTypes.string,
    label: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    validator: React.PropTypes.func,
    value: React.PropTypes.string.isRequired
};
