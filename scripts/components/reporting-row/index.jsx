import React from "react";

var HIDE_ICON_CLASS = "glyphicon glyphicon-menu-right";
var SHOW_ICON_CLASS = "glyphicon glyphicon-menu-down";

class ReportingRow extends React.Component {
    constructor(props) {
        super(props);
    }

    static get defaultProps() {
        return {
            showChildren: {},
            row: {id: '', name: '', values: []}
        }
    };

    render() {
        var id = this.props.row.id;
        var name = this.props.row.name;
        var styles = {
            width: '12%',
            textAlign: "left"};

        return (
            <tr className="ReportingRow">
                <td style={styles} onClick={this.handleClick.bind(this, id, name)}>
                    <i className={this.getClassName(this.props.row.name)}/> {this.props.row.name}
                </td>
                {this.props.row.values.map(function (column) {
                    return <td>{column}</td>;
                })}
            </tr>
        )
    }

    handleClick(id, name) {
        this.props.onClick(id, name);
    }

    getClassName(name) {
        if (!this.props.showChildren[name] || this.props.showChildren[name] == undefined) {
            return HIDE_ICON_CLASS;
        }

        return SHOW_ICON_CLASS;
    }
}

export default  ReportingRow;
