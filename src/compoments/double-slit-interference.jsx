import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { useState, useRef, useEffect }from 'react';
import Sketch from 'react-p5';
import { SliderInput } from './simply-imput';
import '../App.css'

function MySketch({waveColor, lambda, d, L, s}) {
    const p5Ref = useRef(null);
    const preload = (p5) => {
        p5.laserImg  = p5.loadImage('/laser.png');
    };

    const setup = (p5, canvasParentRef) => {
        p5Ref.current = p5;
        p5.createCanvas(1250, 500).parent(canvasParentRef);
        p5.background('white');
    };

    const draw = (p5) => {
        p5.background('white');

        //laser picture
        if (p5.laserImg) { p5.image(p5.laserImg, 0, 245, 50, 10)};
        
        //laser
        p5.stroke(waveColor);
        p5.strokeWeight(2);
        p5.line(50, 250, 150, 250); 
        
        //double-d plate
        
        var slit = 20;
        const length = (500-d-2*slit) / 2;
        p5.stroke('black')
        p5.strokeWeight(2);
        p5.line(200, 0, 200, length);
        p5.line(200, length + slit, 200, length+d+slit);
        p5.line(200, length+d+2*slit, 200, 500); 

        //screen
        p5.strokeWeight(5);
        p5.line(200+L, 0, 200+L, 500);
        //interference fringe
        p5.strokeWeight(2);
        p5.stroke('#91C8E4');
        p5.line(1220, 0, 1220, 500);

        p5.noStroke();
        var color = 'white', y = L*lambda*1e-2/d, up = 250, down = 250-y;
        
        while (up > 0 || down < 500){
            p5.fill(color);
            p5.rect(1221, up, 30, -y);
            p5.rect(1221, down, 30, y);
            color = (color === 'white')?waveColor:'white';
            up -= y;
            down += y;
        }
        color = (color === 'white')?waveColor:'white';
        p5.fill(color);
        p5.rect(1221, 0, 30, up);
        p5.rect(1221, down, 30, 500-down);

    };

    useEffect(() => {
        if (p5Ref.current){p5Ref.current.redraw();}
    }, [d, L, lambda])
    return <Sketch preload={preload} setup={setup} draw={draw} />;
}

const waveColor = (lambda) =>{
  if (425 > lambda){ return 'purple';} 
  else if (450 > lambda){ return 'indigo';} 
  else if (495 > lambda){ return 'blue';} 
  else if (570 > lambda){ return 'green';}  
  else if (590 > lambda){ return 'yellow';} 
  else if (620 > lambda){ return 'orange';} 
  else{ return 'red'; }
}

export default function DSI() {
  const [lambda, setLambda] = useState(380);
  const [d, setD] = useState(10);
  const [L, setL] = useState(100);

  const [base, exponent] = (L*lambda*1e-9/d).toExponential().split('e');
	const letex_num = `\\Delta y_{double \\  slits} = \\frac{L \\lambda}{d} = ${Number(base).toFixed(2)} \\times 10^{${Number(exponent)}}`;
  return (
    <>
      <h1>雙狹縫干涉實驗</h1>
      <div className="slider-row">
        <SliderInput
          label="波長"
          value={lambda}
          setValue={setLambda}
          min={380}
          max={750}
          step={0.1}
          labelAfter={`nm、顏色：${waveColor(lambda)}`}
        />
        <SliderInput
          label="兩個狹縫間距"
          value={d}
          setValue={setD}
          min={10}
          max={100}
          step={0.1}
          labelAfter="mm"
        />
        <SliderInput
          label="屏幕距離"
          value={L}
          setValue={setL}
          min={100}
          max={500}
          labelAfter="mm"
        />
         <div>
            <BlockMath math={letex_num}/>    
          </div>
      </div>
      
      <div className='canvas-border'>
        <MySketch 
          waveColor={waveColor(lambda)}
          lambda={lambda}
          d={d}
          L={L}
        />
      </div>
    </>
  );
}