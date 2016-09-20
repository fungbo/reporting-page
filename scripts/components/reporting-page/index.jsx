import React from 'react';
import $ from "jquery";
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
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: calUrl.getIdUrl(),
            // url: './id.json',
            success: function (data) {
                var mappings = data['dataElements'];
                $.ajax({
                    type: 'GET',
                    dataType: "json",
                    url: calUrl.getHeadUrl(),
                    // url: './header.json',
                    success: function (data) {
                        var head = calHead.getHead(data, mappings);
                        this.setState({head: head, oriHead: data['dataElementOperands']})
                    }.bind(this)
                });
            }.bind(this)
        });
    }

    render() {
        return (
            <div className="ReportingPage">
                <ReportingSidebar />
                <ReportingTable head={this.state.head} oriHead={this.state.oriHead} />
            </div>
        )
    }

    componentDidMount() {
        this.fetchHead();
    }
}

export default ReportingPage;

