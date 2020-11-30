import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './searchBox.css';
import axios from 'axios';
import AutocompleteInput from './autocomplete';


export default class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSuggestions: [],
        };
    }

    componentDidMount = () => {
        let url = "http://52.249.194.218/index.php/tags";
        axios.get(url).then(resp => {
            console.log(resp.data.data);
            this.setState({
                allSuggestions: resp.data.data,
            });
        });
    };

    render() {
        return (
            <div className="app-search-bar">
                <div className="app-search-container">
                    <AutocompleteInput
                        suggestions={this.state.allSuggestions}
                        addTag={this.props.addTag}
                        removeTag={this.props.removeTag}
                    />
                </div>
                <div className="app-search-container" style={{ textAlign: "center", display: "block" }}>
                    You have selected
                    <span className="space" />
                    {
                        this.props.queryTags.map((tag) => {
                            return (
                                <>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => this.props.removeTag(tag)}
                                    >
                                        {tag} <small><FontAwesomeIcon icon={faTimesCircle} /></small>
                                    </Button>
                                &nbsp;
                                </>
                            );
                        })
                    }
                </div>
            </div >
        );
    }
}