import React from "react";
import {Button} from "react-toolbox/lib/button";
import DatePicker from "react-toolbox/lib/date_picker";
import TreeView from "treeview-react-bootstrap";
import moment from 'moment';
import css from './index.scss';

class ReportingSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: null,
            endDate: null
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
                <DatePickerBar
                    label='Start epidemiological week'
                    value={this.state.startDate}
                    maxDate={this.state.endDate}
                    onChange={this.handleChange.bind(this, 'startDate')}
                />
                <DatePickerBar
                    label='End epidemiological week'
                    value={this.state.endDate}
                    minDate={this.state.startDate}
                    onChange={this.handleChange.bind(this, 'endDate')}
                />
                <div className={ css.filterName } >Diseases</div>
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
    render() {
        const formatDate = (date) => `${moment(date).format('D MMMM YYYY - WW')} week`;

        return (
            <DatePicker icon="event"
                        inputFormat={formatDate}
                        sundayFirstDayOfWeek
                        autoOk
                        {...this.props}
            />)
    }
}

export default ReportingSidebar;
