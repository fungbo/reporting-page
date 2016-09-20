import React from "react";
import axios from "axios";
import deepCopy from "deepCopy";
import ReportingHead from "../reporting-head/index.jsx";
import ReportingBody from "../reporting-body/index.jsx";
import calSpan from "../../utils/cal-span.js";
import calRow from "../../utils/cal-row.js";
import calUrl from "../../utils/cal-url.js";
import css from "./index.scss";
import "./report-table.scss";


class ReportingTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [{id: '', name: '', values: [], children: [{name: '', values: []}]}]
        };

        this.addChildren = this.addChildren.bind(this);
        this.exportTable = this.exportTable.bind(this);
    }

    static get defaultProps() {
        return {
            head: [],
            oriHead: []
        }
    };

    fetchRows(props) {
        var config = {
            headers: {'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q='}
        };

        axios.get(calUrl.getRowUrl(props.oriHead, ['MOH12345678'], 'THIS_YEAR'), config)
        // axios.get('./moh.json')
            .then(function (response) {
                var rows = calRow.getRows(response.data, props.oriHead);
                this.setState({rows: rows});
            }.bind(this))
    }

    addChildren(id, children) {
        var rows = deepCopy(this.state.rows);
        calRow.appendChildren(rows, id, children);
        this.setState({rows: rows});
    }

    tableToExcel() {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
                'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
                'xmlns="http://www.w3.org/TR/REC-html40">' +
                '<head>' +
                '<!--[if gte mso 9]>' +
                '<xml><x:ExcelWorkbook>' +
                '<x:ExcelWorksheets><x:ExcelWorksheet>' +
                '<x:Name>{worksheet}</x:Name>' +
                '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>' +
                '</x:ExcelWorksheet></x:ExcelWorksheets>' +
                '</x:ExcelWorkbook></xml><![endif]-->' +
                '</head>' +
                '<body><table>{table}</table></body>' +
                '</html>',
            base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                })
            };
        return function (table, name) {
            var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML};
            window.location.href = uri + base64(format(template, ctx))
        }
    }

    exportTable() {
        console.log('table export');
        if (this.reportingTable) {
            var toExcel = this.tableToExcel();
            toExcel(this.reportingTable, "reporting-page");
        }
    }

    render() {
        return (
            <div className={ css.tableContainer }>
                <table className={ css.ReportingTable } ref={(ref) => this.reportingTable = ref}>
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
