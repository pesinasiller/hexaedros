import React from 'react';

class Boxes extends React.Component {

  render(){
    return (<group>{
      this.props.cubePositions.map((cubePosition, index) => {
        return (
          <group 
          position={cubePosition} 
           rotation={this.props.cubeRotation}
           key={index}>
        <mesh>
          <boxGeometry 
            width={this.props.cubeSizes[index].w}
            height={this.props.cubeSizes[index].h}
            depth={this.props.cubeSizes[index].d}
          />
          <meshNormalMaterial
            //color={0x00ff00}
          />
        </mesh>
        </group>
        );
      })}</group>
    );
  }
}

export default Boxes;