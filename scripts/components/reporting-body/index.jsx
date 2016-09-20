import React from "react";
import axios from "axios";
import ReportingRow from '../reporting-row/index.jsx';
import calRow from "../../utils/cal-row.js";
import calUrl from "../../utils/cal-url.js";
import calOrgan from "../../utils/cal_organisation";

class ReportingBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showChildren: {Moh: true}
        };

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        var rows = this.generateRows(this.props.data, this.state);

        return (
            <tbody className="ReportingBody">
            {
                rows.map(function(row) {
                    return <ReportingRow key={row.name}
                                         row={row}
                                         onClick={this.handleClick}
                                         showChildren={this.state.showChildren} />
                }.bind(this))
            }
            </tbody>
        );
    }

    handleClick(id, name) {
        var values = this.state.showChildren;
        values[name] = !this.state.showChildren[name];

        var oriHead = this.props.oriHead;
        var addChildren = this.props.addChildren;
        
        axios.get(calUrl.getChildrenUrl(id))
        // axios.get('./organisations.json')
            .then(function (ous) {
                axios.get(calUrl.getRowUrl(oriHead, calOrgan.getOrganisations(ous.data['children']), 'THIS_YEAR'))
                // axios.get('./provinces.json')
                    .then(function(provinces) {
                        var rows = calRow.getRows(provinces.data, oriHead);
                        addChildren(id, rows);
                    }.bind(this))
            }.bind(this));

        this.setState({
            showChildren: values
        });
    }

    generateRows(oriRows, state) {
        var rows = [];

        function generate(oriRows) {
            var data = oriRows[0];

            var rowId = data.id;
            var rowName = data.name;
            var rowValue = data.values;
            var showChildren = state.showChildren[rowName];

            rows.push({id: rowId, name: rowName, values: rowValue});
            if (showChildren && data.children) {
                data.children.map(function (child) {
                    generate([child]);
                })
            }
        }

        generate(oriRows);

        return rows;
    }
}

export default ReportingBody;
