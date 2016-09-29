import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import { Button } from "react-toolbox/lib/button";

import DatePickerBar from '../date-picker-bar/index.jsx';
import corsRequest from "../../utils/cors-request.js";
import calUrl from "../../utils/cal-url.js";
import { DEFAULT_OPS_COLUMN, syncStatusMap, syncTimeStatusMap } from '../../configs';

import css from './index.scss';

const HIDE_ICON_CLASS = "glyphicon glyphicon-triangle-right";
const SHOW_ICON_CLASS = "glyphicon glyphicon-triangle-bottom";

export default class OpsReporting extends Component {
    constructor() {
        super();

        this.state = {
            startDate: null,
            endDate: null,
            tableStartDate: null,
            tableEndDate: null,
            namesMapping: [],
            regionalList: [],
            rootLocation: [],
            rows: []
        };

        this.config = {
            headers: {'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q='}
        };

        this.generateRows = ::this.generateRows
    }

    componentDidMount() {
        axios.get(calUrl.getLocationMapping(), this.config)
            .then((mapResult) => {
                const namesMapping = _.get(mapResult, 'data.organisationUnits', []);
                this.setState({
                    startDate: new Date(moment().subtract((DEFAULT_OPS_COLUMN - 1), 'weeks').valueOf()),
                    endDate: new Date(),
                    namesMapping
                }, () => {
                    this.generateReport();
                })
            });
    }

    onChange = (item, value) => {
        this.setState({ [item]: value });
    };

    initRootLocation(data) {
        let rootLocation = [];

        for (let item of this.state.regionalList) {
            rootLocation.push({
                name: item.displayName,
                id: item.id,
                level: item.level,
                value: data[item.displayName]
            })
        }

        this.setState({rootLocation})
    }

    generateReport = () => {
        let startWeek, endWeek;

        if(this.state.startDate && this.state.endDate){
            startWeek = moment(this.state.startDate);
            endWeek = moment(this.state.endDate);
        } else if (this.state.startDate) {
            startWeek = moment(this.state.startDate);
            endWeek = moment(this.state.startDate).add((DEFAULT_OPS_COLUMN - 1), 'weeks');
        } else if (this.state.endDate) {
            startWeek = moment(this.state.endDate).subtract((DEFAULT_OPS_COLUMN - 1), 'weeks');
            endWeek = moment(this.state.endDate);
        } else {
            startWeek = moment().subtract((DEFAULT_OPS_COLUMN - 1), 'weeks').valueOf();
            endWeek = moment();
        }

        this.setState({
            tableStartDate: startWeek,
            tableEndDate: endWeek
        });

        let regionalList = [];

        axios.get(calUrl.getRelatedOuList(), this.config)
            .then((listResult) => {
                const list = _.get(listResult, 'data.organisationUnits', []);

                list.forEach((item) => {
                    const location = _.find(this.state.namesMapping, item);
                    if(location) {
                        regionalList.push(location)
                    }
                });

                const organisationUnits = regionalList.map(item => {
                    return item.displayName
                }).join(':');

                return axios.get(calUrl.getOuLevel(regionalList[0].id)).then((response) => {
                    regionalList[0].level = response.data.level - 1;

                    return corsRequest.sendCORSRequest('GET', calUrl.getIndicatorInfo(organisationUnits, startWeek.valueOf(), endWeek.valueOf()), (res) => {
                        this.setState({ regionalList }, () => {
                            this.initRootLocation(JSON.parse(res));
                        });
                    });
                });
            }).catch((err) => {
                console.log(err.message);
            });
    };

    onClean(key) {
        this.setState({ [key]: null })
    }

    renderTimePicker() {
        const { startDate, endDate } = this.state;

        return (
            <div>
                <DatePickerBar
                    label="Start week"
                    value={startDate}
                    maxDate={this.state.endDate}
                    onClean={this.onClean.bind(this, 'startDate')}
                    onChange={this.onChange.bind(this, 'startDate')}
                />

                <DatePickerBar
                    label="End week"
                    value={endDate}
                    minDate={this.state.startDate}
                    onClean={this.onClean.bind(this, 'endDate')}
                    onChange={this.onChange.bind(this, 'endDate')}
                />
            </div>
        )
    }

    renderSidebar() {
        return (
            <div className={ css.sidebar + ' col-sm-4 col-md-2' }>
                <div className={ css.head }>Ops Indicator</div>
                { this.renderTimePicker() }
                <Button
                    className={ css.reportBtn }
                    label='GENERATE REPORT'
                    neutral={ false }
                    onClick={this.generateReport}
                />
            </div>
        )
    }

    renderTableHead() {
        const startDate = this.state.tableStartDate || new Date(moment().subtract((DEFAULT_OPS_COLUMN - 1), 'weeks'));
        const endDate = this.state.tableEndDate || new Date();

        let startWeek = moment(startDate);
        let endWeek = endDate >= startDate ? moment(endDate) : startDate;

        let headerList = [];

        while(endWeek >= startWeek) {
            const startDayOfWeek = endWeek.startOf('week').format('D MMM');
            const endDayOfWeek = endWeek.endOf('week').format('D MMM');

            headerList.push({
                moment: endWeek,
                displayText: `Week ${endWeek.weeks()} (${startDayOfWeek} - ${endDayOfWeek} ${endWeek.weekYear()})`
            });

            endWeek.subtract(1, 'weeks');
        }

        headerList.reverse();
        let thInfo = [];
        let thInfoNum = 0;

        while(thInfoNum < headerList.length) {
            thInfoNum++;
            thInfo = _.concat(thInfo, <th>Sync status</th>, <th>Sync time</th>, <th>ODK version</th>)
        }

        return !!headerList.length && (
            <thead>
                <tr>
                    <th rowSpan="2">Localização</th>
                    {
                        headerList.map((header, idx) => {
                            return (
                                <th colSpan="3" key={idx}>{header.displayText}</th>
                            )
                        })
                    }
                </tr>
                <tr>
                    { thInfo.map(item => { return item }) }
                </tr>
            </thead>
        )
    }

    generateRows(item, childrenList, result) {
        item.children = childrenList.map((children) => {
            return {
                name: children.displayName,
                id: children.id,
                level: (item.level + 1),
                value: result[children.displayName]
            }
        });
        item.showChildren = true;

        this.forceUpdate();
    }

    fetchChild(item, enableFetch) {
        if(item.showChildren || item.children) {
            item.showChildren = !item.showChildren;
            return this.forceUpdate();
        }

        item.isLoading = true;
        this.forceUpdate();

        axios.get(calUrl.getChildrenUrl(item.id), calUrl.getConfig())
            .then((res) => {
                const list = _.get(res, 'data.children', []);
                const childrenList = [];

                list.forEach((item) => {
                    const location = _.find(this.state.namesMapping, item);
                    if(location) {
                        childrenList.push(location)
                    }
                });

                const organisationUnits = childrenList.map((item) => {
                    return item.displayName;
                }).join(':');
                const startDate = this.state.tableStartDate.valueOf();
                const endDate = this.state.tableEndDate.valueOf();

                if(organisationUnits) {
                    return corsRequest.sendCORSRequest('GET', calUrl.getIndicatorInfo(organisationUnits, startDate, endDate), (res) => {
                        item.isLoading = false;
                        this.forceUpdate();
                        this.generateRows(item, childrenList, JSON.parse(res))
                    });
                } else {
                    item.showChildren = true;
                    item.isLoading = false;
                    item.children = [];
                    this.forceUpdate();
                }
            }).catch((err) => {
                item.isLoading = false;
                this.forceUpdate();
            });
    }

    renderValue(value = []) {
        let columnList = [];
        const bgColor = {
            '-1': 'sick',
            '0': 'normal',
            '1': 'ok',
        };

        value.forEach((item) => {
            columnList = _.concat(columnList,
                <td className={css.syncStatus + ' ' + css[bgColor[item.syncStatus]]} >{syncStatusMap[item.syncStatus]}</td>,
                (
                    <td className={css.syncTime}>
                        <span className={css.syncTimeStatus + ' ' + (item.syncTime.status < 0 ? css.mark : '')}>
                            {syncTimeStatusMap[item.syncTime.status]}
                        </span>
                        <span>{item.syncTime.time}</span>
                    </td>
                ),
                <td className={css.ODKVersion} >{item.ODKVersion}</td>
            )
        });

        return columnList;
    };

    renderTableRows(items, rows) {
        const levelStyle = ['primary', 'secondary', 'tertiary'];

        items.forEach((item) => {
            const rowStyle = levelStyle[item.level];
            rows.push((
                <tr className={css.rowStyle}>
                    <td className={`${(css[rowStyle + 'Title'] || '')} ${css.rowName} ${(item.isLoading ? css.loading : '')}`}
                        onClick={this.fetchChild.bind(this, item)}>

                        { !!rowStyle && <i className={this.getClassName(item.showChildren) + ' ' + css.icon}/> }
                        {item.name}
                    </td>
                    {this.renderValue(item.value)}
                </tr>
            ));

            if(item.showChildren){
                this.renderTableRows(item.children, rows);
            }
        });
    }

    renderTableBody() {
        const rootLocation = this.state.rootLocation;

        return !!rootLocation.length && (
            <tbody>
                {
                    rootLocation.map((items) => {
                        let list = [];

                        this.renderTableRows([items], list);
                        return list.map((item) => { return item; });
                    })
                }
            </tbody>
        )
    }

    getClassName(showChildren) {
        if (showChildren) {
            return SHOW_ICON_CLASS;
        }

        return HIDE_ICON_CLASS;
    }

    renderTable() {
        return (
            <div className={ css.content }>
                <table>
                    { this.renderTableHead() }
                    { this.renderTableBody() }
                </table>
            </div>
        )
    }

    render() {
        return (
            <div>
                { this.renderSidebar() }
                { this.renderTable() }
            </div>
        )
    }
}
