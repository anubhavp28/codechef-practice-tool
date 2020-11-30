import React, { Component } from 'react';
import { InputGroup, FormControl, Button, ListGroup, Badge } from 'react-bootstrap';
import './autocomplete.css';

export default class AutocompleteInput extends Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
        this.state = {
            activeSuggestion: -1,
            userInput: "",
            relevantSuggestions: [],
            renderSuggestions: false,
        };
    }

    componentDidMount = () => {
        document.addEventListener('mousedown', this.onFocusOut, false);
    };

    componentWillUnmount = () => {
        document.removeEventListener('mousedown', this.onFocusOut, false);
    };

    getRelevantSuggestions = (userInput) => {
        const relevantSuggestions = this.props.suggestions.filter((tag) => {
            return tag.tag_name.toLowerCase().startsWith(userInput.toLowerCase())
        });

        return relevantSuggestions;
    };

    onInput = (e) => {
        const userInput = e.currentTarget.value;
        const relevantSuggestions = this.getRelevantSuggestions(userInput);

        this.setState({
            userInput: userInput,
            relevantSuggestions: relevantSuggestions,
            activeSuggestion: -1,
        });
    };

    onClicked = (suggestion) => {
        this.setState({
            userInput: suggestion.tag_name,
            renderSuggestions: false,
        });
    };

    onFocusIn = (e) => {
        const userInput = e.currentTarget.value;
        const relevantSuggestions = this.getRelevantSuggestions(userInput);

        this.setState({
            renderSuggestions: true,
            relevantSuggestions: relevantSuggestions,
            activeSuggestion: -1,
        });
    };

    onFocusOut = (e) => {
        if (this.containerRef.current.contains(e.target))
            return;

        this.setState({
            renderSuggestions: false,
        });
    };

    ApplyTag = (e) => {
        const userInput = this.state.userInput;
        console.log(this.props);
        this.props.addTag(userInput);
        this.setState({
            userInput: "",
            relevantSuggestions: [],
            activeSuggestion: -1,
            renderSuggestions: false,
        });
    };

    render() {
        var suggestionUI = <></>;
        if (this.state.renderSuggestions) {
            if (this.state.userInput == "") {
                suggestionUI = (
                    <ListGroup className="suggestions-container suggestions-container-active">
                        <ListGroup.Item
                            disabled
                            style={{ border: "0px" }}
                        >
                            Please type more characters.
                        </ListGroup.Item>
                    </ListGroup>
                );
            }
            else if (this.state.relevantSuggestions.length > 0) {
                suggestionUI = (
                    <ListGroup className="suggestions-container suggestions-container-active">
                        {this.state.relevantSuggestions.map((suggestion, index) => {
                            return (
                                <ListGroup.Item
                                    style={{ border: "0px" }}
                                    key={index.toString()}
                                    as="button"
                                    action
                                    onClick={(e) => this.onClicked(suggestion)}
                                >
                                    {suggestion.tag_name} &nbsp;&nbsp;
                                    <Badge variant="secondary">
                                        {suggestion.tag_type}
                                    </Badge>
                                </ListGroup.Item>
                            );
                        })
                        }
                    </ListGroup >
                );
            }
            else {
                suggestionUI = (
                    <ListGroup className="suggestions-container suggestions-container-active">
                        <ListGroup.Item
                            disabled
                            style={{ border: "0px" }}
                        >
                            No match found.
                        </ListGroup.Item>
                    </ListGroup>
                );
            }
        }

        return (
            <div style={{ width: "100%", position: "relative" }} ref={this.containerRef}>
                <InputGroup>
                    <FormControl
                        type="text"
                        placeholder="Select tag to apply"
                        value={this.state.userInput}
                        aria-label="select tags to apply"
                        onInput={this.onInput}
                        onFocus={this.onFocusIn}
                    />
                    <InputGroup.Append>
                        <Button variant="primary" onClick={this.ApplyTag}>Apply Tag</Button>
                    </InputGroup.Append>
                </InputGroup>
                {suggestionUI}
            </div >
        );
    }
}