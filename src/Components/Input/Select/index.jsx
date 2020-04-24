import React from 'react';
import classnames from 'classnames';
// import 'bootstrap/js/dropdown';

import './Select.less';

export default class Select extends React.Component {
    static defaultProps = {
        values: [],
        onSelect: () => {}
    }

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    onButtonClick = () => {
        this.setState({ open: !this.state.open });
    }

    onValueClick = value => {
        this.setState({ open: false });
        this.props.onSelect(value);
    }

    render() {
        const { values, selected } = this.props;
        const selectedValueName = (values.find(value => value.value === selected) || {}).name;
        const containerClasses = classnames('dropdown', { open: this.state.open });
        return (
            <div className={containerClasses}>
                <button
                    className="btn btn-default dropdown-toggle"
                    type="button"
                    id="dropdownMenu1"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                    onClick={this.onButtonClick}
                >
                    {selectedValueName}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                    {values.map(value => (
                        <li key={value.value}>
                            <a href="#" onClick={() => this.onValueClick(value.value)}>{value.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
};
