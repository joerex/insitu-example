import React, {Component} from 'react';
import threeEntryPoint from "./threeEntryPoint";
import './style.css';

class Insitu extends Component {
  componentDidMount() {
    threeEntryPoint(this.threeRootElement, this.props.options);
  }

  render () {
    return (
      <React.Fragment>
        {this.props.options.videoPath &&
        <video id="video" autoPlay loop></video>
        }
        <div className="scene" ref={element => this.threeRootElement = element} />
      </React.Fragment>
    );
  }
}

export default Insitu;