import React from "react";
import '../css/report-table.scss'

var HIDE_ICON_CLASS = "glyphicon glyphicon-menu-right";
var SHOW_ICON_CLASS = "glyphicon glyphicon-menu-down";

class ReportingRow extends React.Component {
    constructor(props) {
        super(props);
    }

    static get defaultProps() {
        return {
            showChildren: {},
            row: {name: '', values: []}
        }
    };

    render() {
        var name = this.props.row.name;
        var styles = {
            width: '12%',
            textAlign: "left"};

        return (
            <tr className="ReportingRow">
                <td style={styles} onClick={this.handleClick.bind(this, name)}>
                    <i className={this.getClassName(this.props.row.name)}/> {this.props.row.name}
                </td>
                {this.props.row.values.map(function (column) {
                    return <td>{column}</td>;
                })}
            </tr>
        )
    }

    handleClick(name) {
        this.props.onClick(name);
    }

    getClassName(name) {
        if (!this.props.showChildren[name] || this.props.showChildren[name] == undefined) {
            return HIDE_ICON_CLASS;
        }

        return SHOW_ICON_CLASS;
    }
}

export default  ReportingRow;
