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
            isLoading: {},
            showChildren: {MoH: true}
        };

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        var rows = this.generateRows(this.props.data, this.state);

        return (
            <tbody className="ReportingBody">
            {
                rows.map(function(row, index) {
                    return <ReportingRow key={index}
                                         row={row}
                                         isLoading={this.state.isLoading}
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

        var config = {
            headers: {'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q='}
        };

        this.setState({ isLoading: { ...this.state.isLoading, [name]: true }, });

        axios.get(calUrl.getChildrenUrl(id), config)
            .then((ous) => {
                return axios.get(calUrl.getRowUrl(oriHead, calOrgan.getOrganisations(ous.data['children']), 'THIS_YEAR'), config)
                    .then((provinces) => {
                        var rows = calRow.getRows(provinces.data, oriHead);
                        addChildren(id, rows);

                        this.setState({ isLoading: { ...this.state.isLoading, [name]: false }, });
                    })
            }).catch(() => {
                this.setState({ isLoading: { ...this.state.isLoading, [name]: false }, });
            });

        this.setState({
            showChildren: values
        });
    }

    generateRows(oriRows, state) {
        var rows = [];

        function generate(oriRows, level = 0) {
            var data = oriRows[0];

            var rowId = data.id;
            var rowName = data.name;
            var rowValue = data.values;
            var showChildren = state.showChildren[rowName];

            rows.push({id: rowId, name: rowName, values: rowValue, level});
            if (showChildren && data.children) {
                level++;
                data.children.map(function (child) {
                    generate([child], level);
                })
            }
        }

        generate(oriRows);

        return rows;
    }
}

export default ReportingBody;
