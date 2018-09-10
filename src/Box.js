import React from 'react';
import ReactDOM from 'react-dom';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import Tone from 'tone';
import MouseInput from './MouseInput';

class Box extends React.Component {

  constructor(props, context) {
  super(props, context);
  }
  
 _ref = (mesh) => {
    const {
      onCreate,
    } = this.props;

    onCreate(mesh);
  };
  
  render(){
    return (
      <mesh ref={this._ref}>
        <geometryResource resourceId="boxGeometry"/>
        <meshLambertMaterial color="0xffff00" />
      </mesh>
    );
  }
}

export default Box;