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
            oriHead: []
        };
    }

    fetchHead() {
        axios.get(calUrl.getIdUrl())
        // axios.get('./id.json')
            .then(function (response) {
                var mappings = response.data['dataElements'];
                axios.get(calUrl.getHeadUrl())
                // axios.get('./header.json')
                    .then(function (response) {
                        var head = calHead.getHead(response.data, mappings);
                        this.setState({head: head, oriHead: response.data['dataElementOperands']})
                    }.bind(this))
            }.bind(this))
    }

    render() {
        return (
            <div className="ReportingPage">
                <ReportingSidebar />
                <ReportingTable head={this.state.head} oriHead={this.state.oriHead}/>
            </div>
        )
    }

    componentDidMount() {
        this.fetchHead();
    }
}

export default ReportingPage;

