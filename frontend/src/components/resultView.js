import React, { Component } from 'react';
import { Card, Button, Badge, Alert } from 'react-bootstrap';
import './resultView.css';
import axios from 'axios';
import date from 'date-and-time';

export default class ResultView extends Component {
    constructor(props) {
        super(props);
        this.pageSize = 10;
        this.state = {
            // list of problems matching the queried tags
            data: [],
            // count of problems matching the queried tags
            count: 0,
            // the queried tags
            queryTags: [...this.props.queryTags],
            // current page number
            page: 0,
            // whether page has changed since last render of UI
            pageChanged: false,
        };
    }

    fetchData = (callback) => {
        // build url for fetching data
        let queryString = `offset=${this.state.page * this.pageSize}&`;
        if (this.props.queryTags.length > 0)
            queryString = queryString + `tags=${this.props.queryTags.join(",")}`;

        // send request and attach callback
        let url = `http://52.249.194.218/index.php/problems?${queryString}`;
        axios.get(url).then(resp => callback(resp));
    };

    componentDidMount() {
        this.fetchData(resp => {
            this.setState({
                data: [...resp.data.data],
                count: resp.data.count,
            });
        });
    }

    componentDidUpdate() {
        console.log("checking if update is required");
        // function to check if two arrays are equal or not
        let equalArrays = (arr1, arr2) => arr1.length == arr2.length && arr1.every((val, idx) => val === arr2[idx]);
        // check if list of query tags have changed or not
        let propsChanged = !equalArrays(this.props.queryTags, this.state.queryTags);

        if (propsChanged) {
            console.log("updating");
            this.fetchData(resp => {
                this.setState({
                    data: [...resp.data.data],
                    count: resp.data.count,
                    queryTags: [...this.props.queryTags],
                    page: 0,
                    pageChanged: false,
                });
            });
        }
        else if (this.state.pageChanged) {
            console.log("updating");
            this.fetchData(resp => {
                this.setState({
                    data: [...resp.data.data],
                    count: resp.data.count,
                    pageChanged: false,
                });
            });
        }
    }

    nextPage = () => {
        const { page } = this.state;
        if ((page + 1) * this.pageSize < this.state.count)
            this.setState({
                page: (page + 1),
                pageChanged: true,
            });
    };

    prevPage = () => {
        const { page } = this.state;
        if (page > 0)
            this.setState({
                page: (page - 1),
                pageChanged: true,
            });
    };

    render() {
        const pageComponent = (
            <div className="page-buttons">
                <Button
                    variant="outline-secondary"
                    style={{ width: "88px" }}
                    onClick={this.prevPage}
                >
                    Previous
                </Button>
                <div style={{ margin: "12px 35px 12px 35px" }}>
                    {Math.min(Math.ceil(this.state.count / 10), this.state.page + 1)}
                    {' of '}
                    {Math.ceil(this.state.count / 10)}
                </div>
                <Button
                    variant="outline-secondary"
                    style={{ width: "88px" }}
                    onClick={this.nextPage}
                >
                    Next
                </Button>
            </div>
        );

        let cards = this.state.data.map((problem, idx) => {
            return (
                <Card
                    bg="light"
                    key={idx}
                    text='dark'
                    style={{ width: '90%', margin: "auto" }}
                    className="mb-3"
                >
                    <Card.Header>
                        <b>Problem Code :</b>
                        <Button
                            as="a"
                            variant="link"
                            href={`https://www.codechef.com/problems/${problem.code}`}
                        >
                            {problem.code}
                        </Button>
                        <span className="space" />
                        <b>Contest Code :</b>
                        <Button
                            as="a"
                            variant="link"
                            href={`https://www.codechef.com/${problem.contest_code}`}
                        >
                            {problem.contest_code}
                        </Button>
                        <span className="space" />
                        <b>Author :</b>
                        <Button
                            variant="link"
                            href={`https://www.codechef.com/users/${problem.author}`}
                        >
                            {problem.author}
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>{problem.name}</Card.Title>

                        <b> Contest Name : </b>  {problem.contest_name} <span className="space" />
                        <br />

                        <b>Attempted : </b> {problem.attempted}
                        <span className="space" />
                        <b> Solved : </b>  {problem.solved}
                        <span className="space" />
                        <b> Partially Solved : </b>  {problem.partially_solved}
                        <span className="space" />

                        <br />
                        <b> Date Added : </b>  {date.transform(problem.date_added, 'YYYY-MM-DD', 'DD MMM YYYY')}
                        <span className="space" />
                        <b> Time Limit : </b>  {problem.time_limit} seconds
                        <span className="space" />
                        <b> Scoring : </b>  {problem.challenge_type.charAt(0).toUpperCase() + problem.challenge_type.slice(1)}
                        <span className="space" />

                        <Card.Text>
                            <h5>
                                {problem.tags.map((tag_name) =>
                                    <><Badge variant="info">{tag_name}</Badge>{' '}</>
                                )}
                            </h5>
                            <hr />
                            <Button
                                variant="link"
                                style={{ position: "relative", left: "-12px" }}
                                href={`https://www.codechef.com/problems/${problem.code}`}
                            >
                                Solve on CodeChef
                            </Button>{' '}
                        </Card.Text>
                    </Card.Body>
                </Card>
            );
        });

        if (this.state.data.length == 0) {
            cards = (
                <Alert variant="info">
                    <center>No matching problems found. Have you select any tags?</center>
                </Alert>
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