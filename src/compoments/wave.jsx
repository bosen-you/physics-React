import { useState, useRef, useEffect } from 'react';
import Sketch from 'react-p5';
import { SliderInput } from './simply-imput';
import '../App.css'

function WaveSketch({lambda, freq, amplit}) {
  const p5Ref = useRef(null);
  const tRef = useRef(0);

  const setup = (p5, canvasParentRef) => {
    p5Ref.current = p5;
    p5.createCanvas(1250, 200).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(255);
    p5.stroke(0);
    p5.noFill();
    p5.beginShape();
    const k = (2*Math.PI) / lambda;
    const omega = 2*Math.PI*freq;
    for (let x = 0; x < p5.width; x += 0.05){
      const y = p5.height/2 + amplit * Math.sin(k*x + omega*tRef.current);
      p5.vertex(x, y);
    }
    p5.endShape();
    tRef.current += 0.05; 
  };

  useEffect(() =>{
    if (p5Ref.current){p5Ref.current.redraw();}
  }, [lambda, freq, amplit]);

  return <Sketch setup={setup} draw={draw} />;
}

export default function Dymatic_wave(){
  const [lambda, setLambda] = useState(10);
  const [freq, setFreq] = useState(1);
  const [amplit, setAmplit] = useState(10);
  return (
    <>
      <h1>動態的波</h1>
      <div className="slider-row">
        <SliderInput
          label="波長"
          value={lambda}
          setValue={setLambda}
          min={10}
          max={100}
          step={0.1}
          labelAfter='mm'
        />
        <SliderInput
          label="頻率"
          value={freq}
          setValue={setFreq}
          min={1}
          max={100}
          step={0.1}
          labelAfter='s^{-1}'
        />
        <SliderInput
          label="振幅"
          value={amplit}
          setValue={setAmplit}
          min={10}
          max={100}
          labelAfter='mm'
        />
      </div>
      <div className='canvas-border'>
        <WaveSketch 
          lambda={lambda}
          freq={freq}
          amplit={amplit}
        />
      </div>
    </>
  )
}