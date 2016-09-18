import React from "react";
import $ from "jquery";
import ReportingHead from "./reporting-head.jsx";
import ReportingBody from "./reporting-body.jsx";
import span from "./span.js";


class ReportingTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            head: [],
            rows: {name: '', values: [], children: [{name: '', values: []}]}
        };
    }


    fetchHead() {
        // $.ajax({
        //     type: 'GET',
        //     dataType: "text",
        //     url: '/head',
        //     success: function (data) {
        //         var json = JSON.parse(data);
        //         this.setState({head: json})
        //     }.bind(this)
        // });
        var data = [
            {
                "name": "SARAMPO 055_Menos de 9 meses"
            },
            {
                "name": "SARAMPO 055_9-23 meses_Nāo Vacinados"
            },
            {
                "name": "SARAMPO 055_9-23 meses_Vacinados"
            },
            {
                "name": "SARAMPO 055_24 meses c mais"
            },
            {
                "name": "037 TÉTANO RECÉM NASCIDOS"
            },
            {
                "name": "MALARIA 084_0-4 anos"
            },
            {
                "name": "MALARIA 084_5 anos +"
            },
            {
                "name": "045 PARALISIA FLÁCIDA AGUDA"
            },
            {
                "name": "071 RAIVA"
            },
            {
                "name": "DIARREIA 009_0-4 anos"
            },
            {
                "name": "DIARREIA 009_5-14 anos"
            },
            {
                "name": "DIARREIA 009_15 anos +"
            },
            {
                "name": "009.2 DISENTERIA"
            },
            {
                "name": "001 CÓLERA"
            },
            {
                "name": "020 PESTE"
            },
            {
                "name": "MENINGITE *036_0-4 anos"
            },
            {
                "name": "MENINGITE *036_5 anos +"
            }
        ];

        this.setState({head: data});
    }

    fetchRows() {
        // $.ajax({
        //     type: 'GET',
        //     dataType: 'json',
        //     url: './data/rows.json',
        //     success: function (data) {
        //         this.setState({rows: data})
        //     }.bind(this)
        // })

        var data = {
            "name": "Moh",
            "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4],
            "children": [
                {
                    "name": "NIASSA",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4],
                    "children": [
                        {
                            "name": "District1",
                            "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                        },
                        {
                            "name": "District2",
                            "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                        }
                    ]
                },
                {
                    "name": "CABO DELGADO",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                },
                {
                    "name": "NAMPULA",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                },
                {
                    "name": "ZAMBEZIA",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                },
                {
                    "name": "TETE",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                },
                {
                    "name": "MANICA",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                },
                {
                    "name": "SOFALA",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                },
                {
                    "name": "INHAMBANE",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                },
                {
                    "name": "GAZA",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                },
                {
                    "name": "MAPUTO PROVINCIA",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                },
                {
                    "name": "MAPUTO CIDADE",
                    "values": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4]
                }
            ]
        };

        this.setState({rows: data})
    }

    render() {
        return (
            <table className="ReportingTable">
                <ReportingHead spans={span.calculateSpan(this.state.head)}/>
                <ReportingBody data={this.state.rows}/>
            </table>
        )
    }

    componentDidMount() {
        this.fetchHead();
        this.fetchRows();
    }
}

export default ReportingTable;
