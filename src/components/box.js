import React, { useRef, useState, Suspense, useEffect, useMemo} from 'react'
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber'
import palettes from 'nice-color-palettes/500';
import random from 'canvas-sketch-util/random';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './box.css';
import * as THREE from 'three'


const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()


extend({OrbitControls})

function Controls() {
    const controls =useRef()
    const {camera, gl } = useThree()
    useFrame(() => controls.current.update())
    return <orbitControls ref={controls} args={[camera, gl.domElement]} enableDamping dampingFactor={0.1} rotateSpeed={0.5} />
}

/* function swapPalette() {
   const palette = random.pick(palettes);
   console.log('palette change');
   return palette;
} */


        function RandomBoxes(props) {
            const [colorset, changeColor] = useState(props.palette)
            const colorArray = useMemo(() => Float32Array.from(new Array(100).fill().flatMap((_, i) => tempColor.set(colorset[i]).toArray())), [colorset])
        
            useEffect(() => { 
              changeColor(props.palette) },
               [props.palette]);
            // This reference will give us direct access to the mesh
            const ref = useRef()
            //const texture = useLoader(THREE.TextureLoader, image)
            // Set up state for the hovered and active state
            // Rotate mesh every frame, this is outside of React without overhead
            
            console.log('here1')

            const numberOfObjects = Math.floor(random.range(3,15))
            console.log(numberOfObjects)

            useFrame(state => {
              const time = state.clock.getElapsedTime()
              ref.current.rotation.x = Math.sin(time / 2) 
              ref.current.rotation.y = Math.sin(time / 1)
              let iter = 0;
              for (let i = 0; i < numberOfObjects; i++)
                {
                    const x = random.range(-1,1)
                    const y = random.range(-1,1)
                    const z = random.range(-1,1)
                    const id = iter++
                    tempObject.position.set(x, y, z)
                    tempObject.scale.set(random.range(-1,1), random.range(-1, 1), random.range(-1,1))
                    tempObject.scale.multiplyScalar(0.5);
                    tempColor.set(random.pick(colorset)).toArray(colorArray, id * 5);
                    tempObject.updateMatrix()
                    ref.current.setMatrixAt(id, tempObject.matrix)
                }
                
            })
            
            console.log('here3')
            console.log(props.numberOfObjects)

            return (
              <instancedMesh
                ref={ref}
                args={[null, null, numberOfObjects]}>
                <boxBufferGeometry attach="geometry" args={props.size}>
                <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
                </boxBufferGeometry>
                <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
              </instancedMesh>
            )
          }


  function Boxes(){
    
    const palette1 = random.pick(palettes);
    const palette2 = random.pick(palettes);
    const palette3 = random.pick(palettes);
    /* const [color, randomizeColor] = useState(palette)
    const [objectNumber, setObjectNumber] = useState(15); */
    let numberPlaceholder= 15;
    console.log(numberPlaceholder)
    const sizeX = random.range(.5,1.2)
    const sizeY = random.range(.5,1.2)
    const sizeZ = random.range(.5,1.2)


    return(
    <div className='canvas-layout'>
      <Canvas className='canvas'>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={<>Loading...</>}>
        <RandomBoxes /* numberOfObjects={objectNumber} */  palette={palette1}  size={[sizeX, sizeY, sizeZ]} ></RandomBoxes>
        <RandomBoxes /* numberOfObjects={objectNumber} */  palette={palette2}  size={[sizeX * random.range(0.5,2), sizeY * random.range(0.5,2), sizeZ * random.range(0.5,2)]} ></RandomBoxes>
        <RandomBoxes /* numberOfObjects={objectNumber} */  palette={palette3}  size={[sizeX * random.range(0.5,1.2), sizeY * random.range(0.5,1.2), sizeZ * random.range(0.5,1.2)]} ></RandomBoxes>
        </Suspense>
        <Controls/>
      </Canvas> 
      <div className='settings-layout'>
        <span className='caption'>*Interact with the 3D model by dragging or scrolling</span>
      </div>
      <form className= 'form-container'>
         {/*  <label> Number of objects: 
              <input type='text' className='form-input' defaultValue={objectNumber.toString()} onChange={(e) => changeAmount(e)}></input>
          </label> */}
          <div>
         {/*  <button  className='form-submit' onClick={() =>setObjectNumber(numberPlaceholder)} >Re-render</button>
          <button className= 'setting-buttons' onClick={(e) => randomizeColor(swapPalette)} >Change color </button> */}
          </div>
          <span> *Every re-render will give you a unique generative art</span>
          <input type='submit' className='form-submit' value="Re-render"></input>
      </form>
    </div>
    )
  }

  export default Boxes;