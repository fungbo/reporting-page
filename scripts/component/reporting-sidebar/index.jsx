import React from "react";
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
    }

    handleChange = (item, value) => {
        this.setState({...this.state, [item]: value});
    };

    render() {
        var data = [
            {
                text: "SARAMPO",
                nodes: [
                    {
                        text: "Menos de 9 meses"
                    },
                    {
                        text: "9-23 Meses (Vacinados)"
                    },
                    {
                        text: "9-23 Meses (Não Vacinados)"
                    },
                    {
                        text: "24+ Meses"
                    }
                ]
            },
            {
                text: "TÉTANO RECÉM NASCIDOS",
                nodes: []
            },
            {
                text: "MALARIA",
                nodes: [
                    {
                        text: "0-4 anos"
                    },
                    {
                        text: "5 anos+"
                    }
                ]
            },
            {
                text: "PARALISIA FLÁCIDA AGUDA",
                nodes: []
            },
            {
                text: "RAIVA",
                nodes: []
            },
            {
                text: "DIARREIA",
                nodes: [
                    {
                        text: "0-4 anos"
                    },
                    {
                        text: "5-14 anos"
                    },
                    {
                        text: "15 anos+"
                    }
                ]
            },
            {
                text: "DISENTERIA",
                nodes: []
            },
            {
                text: "CÓLERA",
                nodes: []
            },
            {
                text: "PESTE",
                nodes: []
            },
            {
                text: "MENINGITE",
                nodes: [
                    {
                        text: "0-4 anos"
                    },
                    {
                        text: "5 anos+"
                    }
                ]
            }
        ];

        return (
            <div className="col-sm-4 col-md-3 sidebar">
                <div className={ css.head }>B.E.S - Multiple locations</div>
                <DatePickerBar label='Start epidemiological week'/>
                <DatePickerBar label='End epidemiological week'/>
                <div>Diseases</div>
                <div className={ css.filter }>
                    <TreeView data={data} color="#000000"
                              selectedIcon="glyphicon glyphicon-ok"
                              unselectedIcon="glyphicon glyphicon-remove"
                              expandIcon=""
                              collapseIcon=""
                              showBorder={false} z
                    />
                </div>
                <Button className={ css.reportBtn } label='GENERATE REPORT' raised primary/>
                <div className={ css.exportDiv }>
                    <Button className={ css.exportBtn } icon="get_app" label='Export data to xls  '/>
                </div>
            </div>)
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
