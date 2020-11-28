import React, { Component } from 'react';
import { Pagination, Card, Button, Badge } from 'react-bootstrap';
import './resultView.css';
import axios from 'axios';

export default class ResultView extends Component {
    constructor(props) {
        super(props);
        this.pageSize = 10;
        this.state = {
            data: [],
            queryTags: [...this.props.queryTags],
            page: 1,
        };
    }

    componentDidMount() {
        let queryString = "";
        if (this.props.queryTags.length > 0)
            queryString = "?tags=" + this.props.queryTags.join(",");
        let url = "http://localhost/index.php/problems" + queryString;
        axios.get(url).then(resp => {
            this.setState({
                data: [...resp.data.data],
            });
        });
    }

    componentDidUpdate() {
        let equalArrays = (arr1, arr2) => arr1.length == arr2.length && arr1.every((val, idx) => val === arr2[idx]);
        if (!equalArrays(this.props.queryTags, this.state.queryTags)) {
            let queryString = "";
            if (this.props.queryTags.length > 0)
                queryString = "?tags=" + this.props.queryTags.join(",");
            let url = "http://localhost/index.php/problems" + queryString;
            axios.get(url).then(resp => {
                this.setState({
                    data: [...resp.data.data],
                    queryTags: [...this.props.queryTags],
                    page: 1,
                });
            });
        }
    }

    nextPage = () => {
        const { page } = this.state;
        if ((page) * this.pageSize < this.state.data.length)
            this.setState({
                page: (page + 1),
            });
    };

    prevPage = () => {
        const { page } = this.state;
        if (page > 1)
            this.setState({
                page: (page - 1),
            });
    };

    render() {
        const pageComponent = (
            <div style={{ width: "400px", margin: "auto", display: "flex", justifyContent: "center" }}>
                <Button variant="outline-secondary" style={{ width: "88px" }} onClick={this.prevPage}>Previous</Button>
                <div style={{ margin: "12px 35px 12px 35px" }}>{this.state.page} {' of '} {Math.ceil(this.state.data.length / 10)}</div>
                <Button variant="outline-secondary" style={{ width: "88px" }} onClick={this.nextPage}>Next</Button>
            </div>
        );

        let cards = [];
        for (let idx = (this.state.page - 1) * this.pageSize; idx < Math.min((this.state.page) * this.pageSize, this.state.data.length); idx++) {
            cards.push(
                <Card
                    bg="light"
                    key={idx}
                    text='dark'
                    style={{ width: '90%', margin: "auto" }}
                    className="mb-3"
                >
                    <Card.Header>
                        <b>Problem Code :</b> <Button as="a" variant="link">{this.state.data[idx].code}</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <b>Contest Code :</b>  <Button as="a" variant="link">NOV20</Button>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <b>Author :</b> <Button variant="link">a_coder_hack</Button>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>Iron, Magnet and Wall</Card.Title>
                        <b>Attempted : </b> 100  &nbsp;&nbsp;&nbsp; <b> Solved : </b>  50 &nbsp;&nbsp;&nbsp; <b> Partially Solved : </b>  5
                        <Card.Text>
                            <h5><Badge variant="info">a_coder_hack</Badge>{' '}
                                <Badge variant="info">easy</Badge>{' '}
                                <Badge variant="info">queue</Badge>{' '}
                                <Badge variant="info">greedy</Badge>{' '}
                                <Badge variant="info">nov20</Badge>{' '}
                            </h5>
                            <hr />
                            <Button variant="link" style={{ position: "relative", left: "-12px" }} >Solve on CodeChef</Button>{' '}
                        </Card.Text>
                    </Card.Body>
                </Card>
            );
        }

        return (
            <div id="base-container">
                <div className="page-nav">
                    {pageComponent}
                </div>
                <div className="result-container">
                    {cards}
                </div>
                <div className="page-nav mt-5">
                    {pageComponent}
                </div>
            </div>
        )
    }
}