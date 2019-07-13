import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import Lightbox from 'react-images';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this)
    this.urlFromDto = this.urlFromDto.bind(this)
    this.calcImageNum = this.calcImageNum.bind(this)
    
    this.state = {
      images: [],
      numPhotos: 100,
      galleryWidth: this.getGalleryWidth(),
      isExpand: false,
      expandIndex: -1,
      imageSize: 200,
      Timer: null,
      numPage: 1,
      lastTag: null,
      onScreenPage: 1,
      imagesOnScreen: 0
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${this.state.numPhotos}&page=${this.state.numPage}&format=json&safe_search=1&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          let slicer = res.photos.photo.slice(this.state.numPhotos-100, this.state.numPhotos)
          this.setState({images: (this.state.images.concat(slicer))})}
      });
      this.calcImageSize()
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({galleryWidth: document.body.clientWidth, lastTag: this.props.tag});
    window.addEventListener('resize', this.onresize)
    window.addEventListener('scroll', this.onscroll)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onresize)
    window.removeEventListener('scroll', this.onscroll)
  }

  componentWillReceiveProps(props) {
    if (props.sortByTitle === true)
      this.sortImages()
    if (this.state.lastTag != props.tag)
     {
      clearTimeout(this.state.Timer)
      this.setState({Timer: (setTimeout(this.TimeOut, 500, props.tag)), lastTag: props.tag})
     }
  }

  TimeOut = (tag) => {
    this.setState({numPhotos: 100, images: []})
    this.getImages(tag)
  }

  cloneRequest = (index) => {
    const help = this.state.images.concat(this.state.images.slice(index, index+1))
    this.setState({images: help})
  }

  deleteRequest = (index) => {
    const help = this.state.images.slice(0, index).concat(this.state.images.slice(index+1,))
      this.setState({images: help})
  }

  expandRequest = (index) => {
    this.setState({isExpand: true, expandIndex: index})
  }

  closeLightbox = () => {
    this.setState({isExpand: false})
  }

  gotoPrevious = () => {
    this.setState({expandIndex: (this.state.expandIndex-1)})
  }

  gotoNext = () => {
    this.setState({expandIndex: (this.state.expandIndex+1)})
  }

  onresize = () => {
    this.setState({galleryWidth: (this.getGalleryWidth())}, this.calcImageSize)
  }

  calcImageSize() {
    const targetSize = 200;
    const imagesPerRow = Math.round(this.state.galleryWidth / targetSize);
    this.setState({imageSize: (this.state.galleryWidth / imagesPerRow)}, this.calcImageNum);
  }

  calcImageNum(){
    const colNum = window.innerHeight / this.state.imageSize
    const RowNum = window.innerWidth / this.state.imageSize
    const pagesForHundred = 100 / (colNum * RowNum)
    this.setState({hundredLength: window.innerHeight * pagesForHundred})
    this.setState({imagesOnScreen: Math.round(colNum)*(RowNum)})
  }

  onscroll = () => {
    this.setState({onScreenPage: Math.floor(document.documentElement.scrollTop/ this.state.hundredLength)})
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight)
    {
      if(this.state.numPhotos === 500) {
        this.setState({numPage: this.state.numPage+=1 , numPhotos: 100}, this.getImages(this.props.tag))
      }
      else {
        this.setState({numPhotos: (this.state.numPhotos+=100)}, this.getImages(this.props.tag))
      }
    }
  }

  sortImages = () => {
      this.state.images.sort(function(a, b){
      if(a.title < b.title) { return -1; }
      if(a.title > b.title) { return 1; }
      return 0;
    })
  }

  render() {
    return (
      <div className="gallery-root">
       
       {
          this.state.isExpand && (this.state.expandIndex>=0) && (
          <Lightbox
          images= {this.state.images.map((dto)=> ({src: this.urlFromDto(dto)}))}
          currentImage= {this.state.expandIndex}
          isOpen={this.state.isExpand}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.closeLightbox}
          onClickImage={this.closeLightbox}
          backdropClosesModal={true}
          enableKeyboardInput= {true}
          spinnerSize= {300}/>)
        }
        
        {this.state.images.map((dto, index) => {
          return <Image key={'image-' + index}
                        dto={dto}
                        imageSize={this.state.imageSize}
                        cloneRequest={this.cloneRequest}
                        expandRequest={this.expandRequest}
                        deleteRequest={this.deleteRequest}
                        index={index}
                        imagesOnScreen={this.state.imagesOnScreen}
                        onScreenPage={this.state.onScreenPage}/>;
        })}
      </div>
    );
  }
}

export default Gallery;