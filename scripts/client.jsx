import 'react-toolbox/lib/commons.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import ReportingPage from './components/reporting-page/index.jsx';
import OpsReporting from './components/ops-reporting/index.jsx'
import { Router, Route, Link, hashHistory } from 'react-router'

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={ReportingPage}/>
        <Route path="/ops" component={OpsReporting}/>
    </Router>
), document.getElementById('app'));