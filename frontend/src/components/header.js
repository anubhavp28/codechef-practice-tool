import React, { Component } from 'react';
import SearchBox from './searchBox';
import './header.css';
import logo from './logo.svg';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="app-nav-bar">
                    <div className="app-nav-container">
                        <div className="app-nav-logo-container">
                            <img src={logo} style={{ padding: "0.5rem 0rem", height: "inherit" }} />
                        </div>
                        <a
                            href="javascript::void(0)"
                            className="app-nav-link"
                        >
                            Sign In
                        </a>
                    </div>
                </div >
                <SearchBox
                    addTag={this.props.addTag}
                    removeTag={this.props.removeTag}
                    queryTags={this.props.queryTags}
                />
            </>
        )
    }
}