import React from "react";
import axios from "axios";
import calHead from "../../utils/cal-head";
import calUrl from "../../utils/cal-url.js";
import {Button} from "react-toolbox/lib/button";
import DatePicker from "react-toolbox/lib/date_picker";
import TreeView from "treeview-react-bootstrap";
import css from './index.scss';

class ReportingSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: ''
        };

        this.exportTable = this.exportTable.bind(this);
    }

    static get defaultProps() {
        return {
            sidebarFilter: []
        }
    };

    handleChange = (item, value) => {
        this.setState({...this.state, [item]: value});
    };

    exportTable() {
        this.props.exportTable();
    }

    render() {
        return (
            <div className={ css.sidebar + ' col-sm-4 col-md-3' }>
                <div className={ css.head }>B.E.S - Multiple locations</div>
                <DatePickerBar label='Start epidemiological week'/>
                <DatePickerBar label='End epidemiological week'/>
                <div className={ css.filterName }>Diseases</div>
                <div className={ css.filter }>
                    <TreeView data={ this.props.sidebarFilter } color="#000000"
                              selectedIcon="glyphicon glyphicon-ok"
                              unselectedIcon="glyphicon glyphicon-remove"
                              expandIcon=""
                              collapseIcon=""
                              showBorder={false}
                    />
                </div>
                <Button className={ css.reportBtn } label='GENERATE REPORT' neutral={ false }/>
                <div className={ css.exportDiv }>
                    <Button className={ css.exportBtn } icon="get_app" label='Export data to xls  '
                            onClick={this.exportTable}/>
                </div>
            </div>
        )
    }
}

class DatePickerBar extends React.Component {
    state = {startDate: ''};
    handleChange = (item, value) => {
        this.setState({...this.state, [item]: value});
    };

    render() {
        return (
            <DatePicker icon="event" label={this.props.label} sundayFirstDayOfWeek
                        onChange={this.handleChange.bind(this, 'startDate')} value={this.state.startDate}/>)
    }
}

export default ReportingSidebar;
