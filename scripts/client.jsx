import 'react-toolbox/lib/commons.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import D2Library from 'd2/lib/d2';
import calUrl from "./utils/cal-url.js";

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import ReportingPage from './components/reporting-page/index.jsx';

D2Library.getManifest('manifest.webapp')
    .then(manifest => {
        D2Library.config.baseUrl = calUrl.getBaseUrl();
    })
    .then(D2Library.init)
    .then(d2 => {
        ReactDOM.render(<ReportingPage d2={d2}/>, document.getElementById('app'));
    })
    .catch(error => {
        ReactDOM.render((<div>Failed to initialise D2</div>), document.getElementById('app'));
    });

ReactDOM.render(<LoadingMask />, document.getElementById('app'));
