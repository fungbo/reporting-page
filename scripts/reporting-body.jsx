import React from "react";
import ReportingRow from './reporting-row.jsx';

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

    handleClick(name) {
        var values = this.state.showChildren;
        values[name] = !this.state.showChildren[name];
        
        this.setState({
            showChildren: values
        });

        console.log('show', this.state.showChildren);
    }

    generateRows(data, state) {
        var rows = [];

        function generate(data) {
            var rowName = data.name;
            var rowValue = data.values;
            var showChildren = state.showChildren[rowName];

            rows.push({name: rowName, values: rowValue});
            if (showChildren && data.children) {
                data.children.map(function (children) {
                    generate(children);
                })
            }
        }

        generate(data);

        return rows;
    }
}

export default ReportingBody;
