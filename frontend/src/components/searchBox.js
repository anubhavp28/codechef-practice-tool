import React, { Component } from 'react';
import { InputGroup, FormControl, Button, ListGroup, Badge, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './searchBox.css';
import axios from 'axios';

class AutocompleteInput extends Component {
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
                    <ListGroup className="app-suggestions-container app-suggestions-container-active">
                        <ListGroup.Item disabled style={{ border: "0px" }}>Please type more characters.</ListGroup.Item>
                    </ListGroup>
                );
            }
            else if (this.state.relevantSuggestions.length > 0) {
                suggestionUI = (
                    <ListGroup className="app-suggestions-container app-suggestions-container-active">
                        {this.state.relevantSuggestions.map((suggestion, index) => {
                            return (
                                <ListGroup.Item
                                    style={{ border: "0px" }}
                                    key={index.toString()}
                                    as="button"
                                    action
                                    onClick={(e) => this.onClicked(suggestion)}
                                >
                                    {suggestion.tag_name} &nbsp;&nbsp; <Badge variant="secondary">{suggestion.tag_type}</Badge>
                                </ListGroup.Item>
                            );
                        })
                        }
                    </ListGroup >
                );
            }
            else {
                suggestionUI = (
                    <ListGroup className="app-suggestions-container app-suggestions-container-active">
                        <ListGroup.Item disabled style={{ border: "0px" }}>No match found.</ListGroup.Item>
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

// class DropDownCheckBox extends Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return (
//             <DropdownButton
//                 as={ButtonGroup}
//                 variant="secondary"
//                 title={this.props.title}
//                 style={{ maxHeight: "163px" }}
//             >
//                 <Dropdown.Item eventKey="1">Action</Dropdown.Item>
//                 <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
//                 <Dropdown.Item eventKey="3" active>
//                     Active Item
//                 </Dropdown.Item>
//                 <Dropdown.Item eventKey="11">Action</Dropdown.Item>
//                 <Dropdown.Item eventKey="22">Another action</Dropdown.Item>
//                 <Dropdown.Item eventKey="33" active>
//                     Active Item
//                 </Dropdown.Item>
//                 <Dropdown.Item eventKey="111">Action</Dropdown.Item>
//                 <Dropdown.Item eventKey="222">Another action</Dropdown.Item>
//                 <Dropdown.Item eventKey="3333" active>
//                     Active Item
//                 </Dropdown.Item>
//                 <Dropdown.Item eventKey="1111">Action</Dropdown.Item>
//                 <Dropdown.Item eventKey="2222">Another action</Dropdown.Item>
//                 <Dropdown.Item eventKey="3333" active>
//                     Active Item
//                 </Dropdown.Item>
//                 <Dropdown.Divider />
//                 <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
//             </DropdownButton>
//         );
//     }
// }

export default class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSuggestions: [],
        };
    }

    componentDidMount = () => {
        let url = "http://localhost/index.php/tags";
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
                        addTag={this.props.addTag} removeTag={this.props.removeTag}
                    />
                </div>
                <div className="app-search-container" style={{ textAlign: "center", display: "block" }}>
                    You have selected &nbsp;&nbsp;&nbsp; {
                        this.props.queryTags.map((tag) => {
                            return (
                                <>
                                    <Button variant="secondary" size="sm" onClick={() => this.props.removeTag(tag)}>
                                        {tag} <small><FontAwesomeIcon icon={faTimesCircle} /></small>
                                    </Button>
                                &nbsp;
                                </>
                            );
                        })
                    }
                    {/* <DropDownCheckBox title="Problem Difficulty" />
                    <DropDownCheckBox title="Author" />
                    <DropDownCheckBox title="Data Structure" />
                    <DropDownCheckBox title="Algorithm and Technique" /> */}
                </div>
            </div >
        );
    }
}