import React from "react";
import axios from "axios";
import ReportingHead from "../reporting-head/index.jsx";
import ReportingBody from "../reporting-body/index.jsx";
import calSpan from "../../utils/cal-span.js";
import calRow from "../../utils/cal-row.js";
import calUrl from "../../utils/cal-url.js";
import calOrgan from "../../utils/cal_organisation";
import css from "./index.scss";
import Link from "react-toolbox/lib/link";
import "./report-table.scss";
import * as calPeriod from "../../utils/cal_period";
import { DEFAULT_TEXT_LEVEL } from '../../configs';

var _ = {
    each: require('lodash/each'),
    noop: require('lodash/noop'),
    cloneDeep: require('lodash/cloneDeep'),
    get: require('lodash/get'),
};


class ReportingTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [{id: '', name: '', values: [], children: [{name: '', values: []}]}],
        };

        this.fetchWeekRows = ::this.fetchWeekRows
    }

    static get defaultProps() {
        return {
            head: [],
            oriHead: [],
            currentCategory: 'location',
            changeCategory: _.noop,
            periods: ["THIS_YEAR"]
        }
    };

    fetchRows(props) {
        var mohId = 'MOH12345678';

        axios.get(calUrl.getRelatedOuList(), calUrl.getConfig()).then(function (response) {
            var ous = [];

            _.each(response.data['organisationUnits'], function (ou) {
                ous.push(ou.id);
            });

            axios.get(calUrl.getRowUrl(props.oriHead, ous, calPeriod.generatePeriod(props.periods)), calUrl.getConfig())
                .then(function (response) {
                    var rows = calRow.getRows(response.data, props.oriHead);

                    var promises = [];
                    _.each(rows, function (row) {
                        promises.push(axios.get(calUrl.getOuLevel(row.id)).then(function (response) {
                            row.level = response.data.level - 1;
                        }))
                    });

                    axios.all(promises).then(function () {
                        this.setState({rows: rows});
                    }.bind(this));

                    if (rows.length == 1 && rows[0].id === mohId) {
                        axios.get(calUrl.getChildrenUrl(mohId), calUrl.getConfig())
                            .then(function (ous) {
                                axios.get(calUrl.getRowUrl(props.oriHead, calOrgan.getOrganisations(ous.data['children']),
                                    calPeriod.generatePeriod(props.periods)), calUrl.getConfig())
                                    .then(function (provinces) {
                                        var rows = calRow.getRows(provinces.data, props.oriHead);
                                        this.addChildren(mohId, rows);
                                    }.bind(this))
                            }.bind(this));
                    }
                }.bind(this))
        }.bind(this));
    }

    fetchWeekRows(oriHead, periods, ou) {
        axios.get(calUrl.getWeekRowUrl(oriHead, calPeriod.generatePeriod(periods), ou.id), calUrl.getConfig())
            .then((res) => {
                let rows = calRow.getRows(res.data, oriHead, 'pe').map((row) => {
                    return {...row, level: DEFAULT_TEXT_LEVEL}
                });

                this.setState({ rows })
            })
    }

    addChildren = (id, children) => {
        var rows = _.cloneDeep(this.state.rows);
        calRow.appendChildren(rows, id, children);
        this.setState({rows: rows});
    };

    hasChildren = (id) => {
        return calRow.hasChildren(this.state.rows, id);
    };

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

    exportTable = () => {
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
    };

    render() {
        return (
            <div className={ css.content }>
                <div className={ css.changeScreenLabel }>
                    <Link active={this.props.currentCategory == 'location'} label="Localização" icon='location_city'
                          onClick={() => this.props.changeCategory('location')}/>
                    <Link active={this.props.currentCategory == 'week'} label="Semana" icon='date_range'
                          onClick={() => this.props.changeCategory('week')}/>
                </div>
                <div className={ css.tableContainer }>
                    <table className={ css.ReportingTable } ref={(ref) => this.reportingTable = ref}>
                        <ReportingHead spans={calSpan.calculateSpan(this.props.head)}
                                       currentCategory={this.props.currentCategory}/>
                        <ReportingBody data={this.state.rows} oriHead={this.props.oriHead} periods={this.props.periods}
                                       addChildren={this.addChildren}
                                       hasChildren={this.hasChildren}/>
                    </table>
                </div>
            </div>
        )
    }

    componentWillReceiveProps(props) {
        if (props.currentCategory == 'location') {
            this.fetchRows(props);
        }
    }
}

export default ReportingTable;
