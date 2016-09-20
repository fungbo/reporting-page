import React from "react";
import $ from "jquery";
import deepCopy from "deepCopy";
import ReportingHead from "../reporting-head/index.jsx";
import ReportingBody from "../reporting-body/index.jsx";
import calSpan from "../../utils/cal-span.js";
import calRow from "../../utils/cal-row.js";
import calUrl from "../../utils/cal-url.js";
import css from './index.scss';
import './report-table.scss';

class ReportingTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [{id: '', name: '', values: [], children: [{name: '', values: []}]}]
        };

        this.addChildren = this.addChildren.bind(this);
    }

    static get defaultProps() {
        return {
            head: [],
            oriHead: []
        }
    };

    fetchRows(props) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            // url: calUrl.getRowUrl(props.oriHead, ['MOH12345678'], 'THIS_YEAR'),
            url: './moh.json',
            success: function (data) {
                var rows = calRow.getRows(data, props.oriHead);
                this.setState({rows: rows});
            }.bind(this)
        });
    }

    addChildren(id, children) {
        var rows = deepCopy(this.state.rows);
        calRow.appendChildren(rows, id, children);
        this.setState({rows: rows});
    }

    render() {
        return (
            <div className={ css.tableContainer }>
                <table className='ReportingTable'>
                    <ReportingHead spans={calSpan.calculateSpan(this.props.head)}/>
                    <ReportingBody data={this.state.rows} oriHead={this.props.oriHead} addChildren={this.addChildren}/>
                </table>
            </div>
        )
    }

    componentWillReceiveProps(props) {
        this.fetchRows(props);
    }
}

export default ReportingTable;
