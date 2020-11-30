import React from 'react';
import './App.css';
import Header from './components/header';
import Result from './components/resultView';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryTags: ["easy-medium"],
      page: 1
    };
    if (window.location.protocol == "https:") {
      window.location.replace("http://quiet-savannah-14489.herokuapp.com/");
    }
  }

  addTag = (tagName) => {
    let currentQuery = [...this.state.queryTags];
    currentQuery.push(tagName);
    this.setState({
      queryTags: [...currentQuery],
    });
  };

  removeTag = (tagName) => {
    let currentQuery = this.state.queryTags.filter((tag) => tag != tagName);
    this.setState({
      queryTags: [...currentQuery],
    });
  };


  render() {
    return (
      <div className="App" >
        <Header addTag={this.addTag} removeTag={this.removeTag} queryTags={this.state.queryTags} />
        <Result addTag={this.addTag} removeTag={this.removeTag} queryTags={this.state.queryTags} />
      </div>
    );
  }
}
