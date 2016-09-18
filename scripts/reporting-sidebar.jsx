import React from "react";
import {Button} from "react-toolbox/lib/button";
import DatePicker from "react-toolbox/lib/date_picker";
import TreeView from "treeview-react-bootstrap";

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

        var headSytles = {
            fontWeight: "bolder",
            fontSize: "large"
        };

        var filterStyles = {
            border: "thin solid grey",
            height: "400px",
            overflow: "auto"
        };

        var reportBtnStyles = {
            marginTop: "30px",
            width: "100%",
            background: "#1b5184"
        };

        var exportDivStyles = {
            textAlign: "center"
        };

        var exportBtnStyles = {
            color: "grey",
            fontSize: "small",
            whiteSpace: "normal",

        };

        return (
            <div className="col-sm-4 col-md-3 sidebar">
                <div style={headSytles}>B.E.S - Multiple locations</div>
                <DatePickerBar label='Start epidemiological week'/>
                <DatePickerBar label='End epidemiological week'/>
                <div>Diseases</div>
                <div style={filterStyles}>
                    <TreeView data={data} color="#000000"
                              selectedIcon="glyphicon glyphicon-ok"
                              unselectedIcon="glyphicon glyphicon-remove"
                              expandIcon=""
                              collapseIcon=""
                              showBorder={false} z
                    />
                </div>
                <Button style={reportBtnStyles} label='GENERATE REPORT' raised primary/>
                <div style={exportDivStyles}>
                    <Button style={exportBtnStyles} icon="get_app" label='Export data to xls  '/>
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
