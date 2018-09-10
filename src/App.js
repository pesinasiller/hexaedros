import React from 'react';
import ReactDOM from 'react-dom';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import TrackballControls from './TrackballControls';
import Tone from 'tone';
import Boxes from './Boxes';
const mainCameraName = 'mainCamera';


class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    const cubePositions = [];
    const cubeSizes = [];
    cubeSizes.length = 8;
    cubePositions.length = 8;

    for (let i = 0; i < cubePositions.length; ++i) {
      cubeSizes[i] = { w: 2, h: 2, d: 2};
      
      cubePositions[i] = new THREE.Vector3(
        Math.random() * 10 - 5,
        Math.random()  * 20 - 10,
        Math.random()  * 40  
      );
    }
  
    this.state = {
      activeCameraName: mainCameraName,
      mainCameraPosition: new THREE.Vector3(0, 0, 270),
      cubeRotation: new THREE.Euler(),
           isPlaying: false,
      cubeSizes: cubeSizes,
      cubePositions: cubePositions,
      currentStep: 0
    };

    this._onAnimate = () => {
      this.controls.update();
      this.setState({
        cubeRotation: new THREE.Euler(
        this.state.cubeRotation.x + 0.01,
        this.state.cubeRotation.y + 0.01,
        0)
      })
    }
    
    this.setPlay = this.setPlay.bind(this);   
    this.onClick = this.onClick.bind(this);   
 
  }

  componentDidMount() {
    
    const controls = new TrackballControls(this.refs.mainCamera,
    ReactDOM.findDOMNode(this.refs.react3));

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.addEventListener('change', () => {
      this.setState({
        mainCameraPosition: this.refs.mainCamera.position,
      });
    });
    this.controls = controls;

  }

  componentWillUnmount() {
    this.controls.dispose();
    delete this.controls;
  }

  onClick = () => {
    
    if(!this.melody){
      this.initSamplers();
    }else{
      this.play();
    }
  }
  
  initSamplers(){
    
    const reverb = new Tone.JCReverb(0.5).connect(Tone.Master);
    const reverbChords = new Tone.JCReverb(.6).connect(Tone.Master);
    const vol = new Tone.Volume(-15);

    this.sampler = new Tone.Sampler({
      'C4' : "sounds/arpegio-1.mp3",
      'D4' : "sounds/arpegio-2.mp3",
      'E4' : "sounds/arpegio-3.mp3",
      'F4' : "sounds/arpegio-4.mp3",
      'G4' : "sounds/arpegio-5.mp3",
      'A4' : "sounds/arpegio-6.mp3",
      'B4' : "sounds/arpegio-7.mp3",
      'C5' : "sounds/arpegio-8.mp3"
    }).chain(vol, reverb);
    
    this.samplerChords = new Tone.Sampler({
      'C4' : "sounds/chord1.mp3",
      'D4' : "sounds/chord2.mp3"
    }).chain(vol, reverbChords);
  
    const melodyList = [
      'C4', 'D4', 'E4', 'F4',
      'G4', 'A4', 'B4', 'C5'
    ];

    Tone.Transport.bpm.value = 240;
    
    this.melody = new Tone.Sequence(this.setPlay, melodyList);
    
    const chords = this.samplerChords;
    
    this.chordLoop = new Tone.Sequence(function(time, note){
    	chords.triggerAttackRelease(note, '4:0:0');
    }, ['C4','D4'], '4:0:0' );
    
  }
  
  play(){
    
    Tone.Transport.start();
	  
	  if(this.state.isPlaying){
	    this.melody.stop();
	    this.chordLoop.stop();
	    
	  }else{
	    this.melody.start();
	    this.chordLoop.start();
	  }
  
    this.setState({
      isPlaying: !this.state.isPlaying
    });

  }
  
  setPlay(time, note) {

    this.sampler.triggerAttack(note);
    //this.synth.triggerAttackRelease(note, '1n', time);
    let newSizes = this.state.cubeSizes;
   
    let step = (this.state.currentStep + 1) % 7;
    let nextStep = (step + 1) % 7;
    
    newSizes[step].h = 2;
    newSizes[step].w = 2;
    newSizes[step].d = 2;
    
    newSizes[nextStep].h = 4;
    newSizes[nextStep].w = 4;
    newSizes[nextStep].d = 4;

    this.setState({
      cubeSizes: newSizes,
      currentStep: step
    });
  }

  render() {
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;

    return (
      <div className={this.state.isPlaying ? "playing" : "stopped"}  >
        <div className='playButton' onClick={this.onClick}>
          <span>{this.state.isPlaying ? "pause" : "play"}</span>
        </div>
        <React3
          ref="react3"
          width={width}
          height={height}
          antialias
          alpha={true}
          onAnimate={this._onAnimate}
        >
          <viewport
            x={0}
            y={0}
            width={width}
            height={height}
            cameraName={mainCameraName}
          />
          <scene>
            <perspectiveCamera
              ref="mainCamera"
              name={mainCameraName}
              fov={10}
              aspect={aspectRatio}
              near={1}
              far={10000}
              position={this.state.mainCameraPosition}
            />
            <cameraHelper
              cameraName={this.state.activeCameraName}
            />
            <Boxes onRef={ref => (this.boxes = ref)} cubeSizes={this.state.cubeSizes} cubePositions={this.state.cubePositions} cubeRotation={this.state.cubeRotation} />
          </scene>
        </React3>
      </div>);
  }
}

export default App;