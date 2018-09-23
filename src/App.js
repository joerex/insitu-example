import React, { Component } from 'react';
import './App.css';
import Insitu from './components/insitu/Insitu';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleLoadComplete = this.handleLoadComplete.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleLoadComplete() {
    // in situ loaded
  }

  handleError(error) {
    console.log('Load error:', error);
  }

  render() {
    const columnWidth = (window.innerWidth / 3) - 30;
    const rowHeight = window.innerHeight / 2;

    const options = {
      width: columnWidth,
      height: rowHeight,
      device: 'iphone',
      zoom: 0,
      imagePath: null,
      loadComplete: this.handleLoadComplete,
      error: this.handleError
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            <Insitu options={{...options, name: '1', imagePath: '/screens/mobile-example-image.png'}}/>
          </div>
          <div className="col-4">
            <Insitu options={{...options, name: '2', imagePath: '/screens/mobile-example-image.png'}}/>
          </div>
          <div className="col-4">
            <Insitu options={{...options, name: '3', videoPath: '/screens/mobile-screencast-example.mp4'}}/>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <Insitu options={{...options, name: '1', imagePath: '/screens/mobile-example-image.png'}}/>
          </div>
          <div className="col-4">
            <Insitu options={{...options, name: '2', imagePath: '/screens/mobile-example-image.png'}}/>
          </div>
          <div className="col-4">
            <Insitu options={{...options, name: '3', videoPath: '/screens/mobile-screencast-example.mp4'}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
