import React from "react";
import {Button} from "react-toolbox/lib/button";
import DatePicker from "react-toolbox/lib/date_picker";
import TreeView from "../../lib/treeview";
import Link from 'react-toolbox/lib/link';
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

    filterChange = (treeView) => {
        var selectStatus = {};
        _.each(treeView, function (element) {
            if (element.nodes.length > 0) {
                _.each(element.nodes, function (node) {
                    selectStatus[[element.text, node.text].join("_")] = node.state.selected;
                })
            } else {
                selectStatus[element.text] = element.state.selected;
            }
        });
        console.log(selectStatus);
    };

    render() {
        return (
            <div className={ css.sidebar + ' col-sm-4 col-md-2' }>
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
                <div className={ css.filterName }>Diseases</div>
                <div className={ css.filter }>
                    {
                        !!this.props.sidebarFilter.length && (<TreeView data={ this.props.sidebarFilter }
                              color="#000000"
                              selectedIcon={ css.selected }
                              unselectedIcon={ css.unCheck }
                              expandIcon=""
                              collapseIcon=""
                              showBorder={false}
                              onClick={this.filterChange.bind(this)}
                        />)
                    }
                </div>
                <Button className={ css.reportBtn } label='GENERATE REPORT' neutral={ false }/>
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
