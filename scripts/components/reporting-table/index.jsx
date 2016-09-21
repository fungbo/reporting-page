import React from "react";
import axios from "axios";
import deepCopy from "deepCopy";
import ReportingHead from "../reporting-head/index.jsx";
import ReportingBody from "../reporting-body/index.jsx";
import calSpan from "../../utils/cal-span.js";
import calRow from "../../utils/cal-row.js";
import calUrl from "../../utils/cal-url.js";
import calOrgan from "../../utils/cal_organisation";
import css from "./index.scss";
import "./report-table.scss";


class ReportingTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [{id: '', name: '', values: [], children: [{name: '', values: []}]}]
        };

        this.addChildren = this.addChildren.bind(this);
        this.hasChildren = this.hasChildren.bind(this);
        this.exportTable = this.exportTable.bind(this);
    }

    static get defaultProps() {
        return {
            head: [],
            oriHead: []
        }
    };

    fetchRows(props) {
        var mohId = 'MOH12345678';
        var defaultPe = 'THIS_YEAR';

        var config = {
            headers: {'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q='}
        };

        axios.get(calUrl.getRowUrl(props.oriHead, [mohId], defaultPe), config)
            .then(function (response) {
                var rows = calRow.getRows(response.data, props.oriHead);
                this.setState({rows: rows});
                axios.get(calUrl.getChildrenUrl(mohId), config)
                    .then(function (ous) {
                        axios.get(calUrl.getRowUrl(props.oriHead, calOrgan.getOrganisations(ous.data['children']),
                            defaultPe), config)
                            .then(function (provinces) {
                                var rows = calRow.getRows(provinces.data, props.oriHead);
                                this.addChildren(mohId, rows);
                            }.bind(this))
                    }.bind(this));
            }.bind(this))
    }

    addChildren(id, children) {
        console.log('add Children');
        var rows = deepCopy(this.state.rows);
        calRow.appendChildren(rows, id, children);
        this.setState({rows: rows});
    }

    hasChildren(id) {
        console.log('rows', this.state.rows);
        console.log('id', id);

        return calRow.hasChildren(this.state.rows, id);
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
            return uri + base64(format(template, ctx));
        }
    }

    exportTable() {
        if (this.reportingTable) {
            var toExcel = this.tableToExcel();
            var title = 'reporting-page';

            var a = document.createElement('a');
            a.download = title + '.xls';
            a.href = toExcel(this.reportingTable, title);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    render() {
        return (
            <div className={ css.tableContainer }>
                <table className={ css.ReportingTable } ref={(ref) => this.reportingTable = ref}>
                    <ReportingHead spans={calSpan.calculateSpan(this.props.head)}/>
                    <ReportingBody data={this.state.rows} oriHead={this.props.oriHead}
                                   addChildren={this.addChildren}
                                   hasChildren={this.hasChildren}/>
                </table>
            </div>
        )
    }

    componentWillReceiveProps(props) {
        this.fetchRows(props);
    }
}

export default ReportingTable;
