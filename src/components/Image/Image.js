import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      filter: 'none',
      imagePage: Math.floor(props.index / 100)
    };
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  handleFilterbutton = () => {
    const filters = ['grayscale(100%)', 'sepia(500%)', 'invert(200%)', 'hue-rotate(45deg)', 'blur(2px)'];
    var chossenFilter = filters[Math.floor(Math.random() * 5)]
    this.setState({filter: chossenFilter})
  }

  handleClonebutton = () => {
    this.props.cloneRequest(this.props.index)
  }

  handleExpandbutton = () => {
    this.props.expandRequest(this.props.index)
  }

  handleResetFilterbutton = () => {
    this.setState({filter: 'none'})
  }

  handleDeletebutton = () => {
    this.props.deleteRequest(this.props.index)
  }

  handleScrollTopbutton () {
    document.documentElement.scrollTop = 0;
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: (Math.abs(this.state.imagePage - this.props.onScreenPage) <2 ? `url(${this.urlFromDto(this.props.dto)})`: null),
          width: this.props.imageSize + 'px',
          height: this.props.imageSize + 'px',
          filter: this.state.filter
        }}
        >
          <div>
          <FontAwesome onClick={this.handleClonebutton} className="image-icon" name="clone" title="Clone"/>
          <FontAwesome onClick={this.handleDeletebutton} className="image-icon" name="trash-alt" title="Delete"/>
          <FontAwesome onClick={this.handleExpandbutton} className="image-icon" name="expand" title="Expand"/>
          </div>

          <div>
          <FontAwesome onClick={this.handleFilterbutton} className="image-icon-up" name="paint-brush" title="Filter"/>
          <FontAwesome onClick={this.handleResetFilterbutton} className="image-icon-up" name="eraser" title="Reset Filter"/>
          <FontAwesome onClick={this.handleScrollTopbutton} className="image-icon-up" name="rocket" title="Scroll Top"/>
          </div>
      </div>
    );
  }
}

export default Image;