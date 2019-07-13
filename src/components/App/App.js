import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import FontAwesome from 'react-fontawesome';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'lakes',
      sortByTitle: false
    };
  }

  handleSortbutton = () => {
    if (this.state.sortByTitle === false)
      this.setState({sortByTitle: true}, this.resetSort)
  }

  resetSort = () => {
    this.setState({sortByTitle: false})
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h3>Flickr Gallery</h3>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value, sortByTitle: false})} value={this.state.tag}/>
          <FontAwesome onClick={this.handleSortbutton} className="image-icon_app" name="sort-alpha-down" title="Sort by title"/>
        </div>
        <Gallery tag={this.state.tag} sortByTitle={this.state.sortByTitle}/>
      </div>
    );
  }
}

export default App;
