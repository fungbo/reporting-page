import React from 'react';
import axios from "axios";
import calHead from "../../utils/cal-head";
import calUrl from "../../utils/cal-url.js";
import ReportingTable from '../reporting-table/index.jsx';
import ReportingSidebar from '../reporting-sidebar/index.jsx';
import './index.scss';

class ReportingPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            head: [],
            oriHead: [],
            sidebarFilter: [],
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
                        var sidebarFilter = calHead.getSidebarFilter(response.data, mappings);
                        var head = calHead.getHead(response.data, mappings);
                        this.setState({head: head, oriHead: response.data['dataElementOperands'],
                            sidebarFilter: sidebarFilter})
                    }.bind(this))
            }.bind(this))
    }

    exportTable() {
        this.reportingTable.exportTable();
    }

    onChangeCategory(currentCategory) {
        this.setState({currentCategory})
    }

    render() {
        return (
            <div className="ReportingPage">
                <ReportingSidebar sidebarFilter={this.state.sidebarFilter} exportTable = {this.exportTable} currentCategory={ this.state.currentCategory }/>
                <ReportingTable head={this.state.head}
                                oriHead={this.state.oriHead}
                                ref={(ref) => this.reportingTable = ref}
                                currentCategory={ this.state.currentCategory }
                                changeCategory={ ::this.onChangeCategory }/>
            </div>
        )
    }

    componentDidMount() {
        this.fetchHead();
    }
}

export default ReportingPage;
