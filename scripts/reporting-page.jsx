import React from 'react';
import $ from "jquery";
import ReportingTable from './reporting-table.jsx';
import ReportingSidebar from './reporting-sidebar.jsx';
import calHead from "./cal-head.js";

class ReportingPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            head: []
        };
    }

    fetchHead() {
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: 'http://52.32.36.132/api/dataElements.json',
            success: function (data) {
                var mappings = data['dataElements'];
                $.ajax({
                    type: 'GET',
                    dataType: "json",
                    url: 'http://52.32.36.132/api/dataElementOperands.json',
                    success: function (data) {
                        var head = calHead.getHead(data, mappings);
                        this.setState({head: head})
                    }.bind(this)
                });
            }.bind(this)
        });
    }

    render() {
        return (
            <div className="ReportingPage">
                <ReportingSidebar />
                <ReportingTable head={this.state.head} />
            </div>
        )
    }

    componentDidMount() {
        this.fetchHead();
    }
}

export default ReportingPage;

