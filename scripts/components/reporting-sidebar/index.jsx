import React from "react";
import {Button} from "react-toolbox/lib/button";
import DatePicker from "react-toolbox/lib/date_picker";
import TreeView from "../../lib/treeview";
import Link from 'react-toolbox/lib/link';
import moment from 'moment';
import css from './index.scss';
import { categoryTitle } from '../../configs';

class ReportingSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: null,
            endDate: null
        };
    }

    static get defaultProps() {
        return {
            filter: []
        }
    };

    handleChange = (item, value) => {
        this.setState({...this.state, [item]: value});
    };

    exportTable = () => {
        this.props.exportTable();
    };

    generateReport = () => {
        this.props.updateTable(this.treeView.state.data);
    };

    render() {
        return (
            <div className={ css.sidebar + ' col-sm-4 col-md-2' }>
                <div className={ css.head }>{ categoryTitle[this.props.currentCategory] }</div>
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
                <div className={ css.filterName }>Diseases</div>
                <div className={ css.filter }>
                    {
                        !!this.props.filter.length && (<TreeView data={ this.props.filter }
                                                                 color="#000000"
                                                                 selectedIcon={ css.selected }
                                                                 unselectedIcon={ css.unCheck }
                                                                 expandIcon=""
                                                                 collapseIcon=""
                                                                 showBorder={false}
                                                                 ref={(ref) => this.treeView = ref} />)
                    }
                </div>
                <Button className={ css.reportBtn } label='GENERATE REPORT' neutral={ false }
                        onClick={this.generateReport}/>
                <div className={ css.exportDiv }>
                    <Link onClick={this.exportTable} label="Export data to xls" icon="get_app" />
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
