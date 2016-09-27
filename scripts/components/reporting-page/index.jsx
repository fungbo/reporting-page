import React from "react";
import axios from "axios";
import calHead from "../../utils/cal-head";
import calUrl from "../../utils/cal-url.js";
import ReportingTable from "../reporting-table/index.jsx";
import ReportingSidebar from "../reporting-sidebar/index.jsx";
import "./index.scss";
import * as calPeriod from "../../utils/cal_period";

class ReportingPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            head: [],
            oriHead: [],
            updatedOriHead: [],
            filter: [],
            periods: ['THIS_YEAR'],
            currentCategory: 'location'
        };

        this.exportTable = this.exportTable.bind(this);
    }

    fetchHead() {
        var config = {
            headers: {'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q='}
        };

        axios.get(calUrl.getIdUrl(), config)
            .then(function (response) {
                var mappings = response.data['dataElements'];
                axios.get(calUrl.getHeadUrl(), config)
                    .then(function (response) {
                        var oriHead = response.data['dataElementOperands'];
                        var filter = calHead.getFilter(oriHead, mappings);
                        var head = calHead.getHead(oriHead, mappings);
                        this.setState({
                            head: head,
                            oriHead: oriHead,
                            updatedOriHead: oriHead,
                            mappings: mappings,
                            filter: filter
                        });
                    }.bind(this))
            }.bind(this))
    }

    exportTable() {
        this.reportingTable.exportTable();
    }

    onChangeCategory(currentCategory) {
        this.setState({currentCategory})
    }

    updateTable = (data, state) => {
        var status = {};
        var weekRange = calPeriod.getWeekRange(state);
        _.each(data, function (element) {
            if (element.nodes.length > 0) {
                _.each(element.nodes, function (node) {
                    status[[element.text, node.text].join(" ")] = node.state.selected;
                })
            } else {
                status[element.text] = element.state.selected;
            }
        });
        var filteredHead = calHead.updateHead(this.state.oriHead, status);
        this.setState({
            head: calHead.getHead(filteredHead, this.state.mappings),
            updatedOriHead: filteredHead,
            filter: data,
            periods:weekRange
        }, () => {
            if(this.state.currentCategory === 'week') {
                this.reportingTable.fetchWeekRows(filteredHead, weekRange, state.location)
            }
        });
    };

    render() {
        return (
            <div className="ReportingPage">
                <ReportingSidebar filter={this.state.filter} exportTable={this.exportTable}
                                  currentCategory={ this.state.currentCategory }
                                  updateTable={this.updateTable}/>
                <ReportingTable head={this.state.head}
                                oriHead={this.state.updatedOriHead}
                                ref={(ref) => this.reportingTable = ref}
                                currentCategory={ this.state.currentCategory }
                                periods={ this.state.periods}
                                changeCategory={ ::this.onChangeCategory }/>
            </div>
        )
    }

    componentDidMount() {
        this.fetchHead();
    }
}

export default ReportingPage;
