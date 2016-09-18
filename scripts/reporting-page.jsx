import React from 'react';
import ReportingTable from './reporting-table.jsx';
import ReportingSidebar from './reporting-sidebar.jsx';


class ReportingPage extends React.Component {
    render() {
        return (
            <div className="ReportingPage">
                <ReportingSidebar />
                <ReportingTable />
            </div>
        )
    }
}

export default ReportingPage;

