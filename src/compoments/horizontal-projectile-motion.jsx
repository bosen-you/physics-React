import { useState, useMemo, useEffect, useRef } from "react";
import 'katex/dist/katex.min.css'
import Sketch from "react-p5";
import { SliderInput, Eq } from "./simply-imput";

export default function ProjectileMotion(){
    const [h0, setH] = useState(0);
    const [v0, setV] = useState(0);
    const [t, setT] = useState(1);
    const [checked, setChecked] = useState(false);

    const {point, eq, calc} = useMemo(() =>{
        const g = 9.8;

        const point = [];
        for (let time = 0; time < 10; time += 0.5){
            const x = v0 * time, y = h0 - 0.5*g*time*time;
            if (y >= 0){
                point.push({x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)), t: time});
            }
            else{
                break;
            }
        }
        const calc = [
            ['最終水平位置', v0*t], 
            ['最終垂直位置', h0 - 0.5*9.8*t*t],
            ['最終水平速度', v0], 
            ['最終垂直速度',-g*t]
        ];
        
        const format = (val) => {
            if (typeof val === 'string') return val;
            return val < 0 ? `(${val.toFixed(2)})` : `${val.toFixed(2)}`;
        };

        const h0_disp = checked ? 'h_{0}' : format(h0);
        const v0_disp = checked ? 'v_{0}' : format(v0);
        const t_disp = checked ? 't' : format(t);
        const g_disp = checked ? 'g' : format(g);

        const equations = [
            ['水平位移', `x(t) = ${v0_disp} \\cdot ${t_disp}`],
            ['垂直位移', `y(t) = ${h0_disp} - \\frac{1}{2} \\cdot ${g_disp} \\cdot ${t_disp}^{2}`],
            ['水平速度', `v_{x}(t) = ${v0_disp}`],
            ['垂直速度', `v_{y}(t) = -${g_disp} \\cdot ${t_disp}`],
            ['軌跡方程', `y = ${h0_disp} - ${checked ? '\\frac{g}{2v_{0}^2}' : format(g/(2*v0*v0))} \\cdot x^2`]
        ];

        return {point: point, eq:equations, calc: calc};
    }, [h0, v0, t, checked]); 

    const p5Ref = useRef(null);
    const setup = (p5, canvasParentRef) =>{
        p5Ref.current = p5;
        p5.createCanvas(600, 530).parent(canvasParentRef);
        p5.noLoop();
    } 

    const draw = (p5) =>{
        p5.background(255);
        
        const maxRange = v0*Math.sqrt(2*h0/9.8);
        const scale = Math.min(4, (p5.width - 100) / Math.max(maxRange, 50));
        const offsetX = 50;
        const offsetY = p5.height - 50;
        
        // coordinate
        p5.stroke('#ccc');
        p5.strokeWeight(1);
        // X Asis
        p5.line(offsetX, offsetY, p5.width-20, offsetY);
        // Y Asis
        p5.line(offsetX, offsetY, offsetX, 20);
        
        //coordinate label
        p5.fill('#666');
        p5.textFont('Arial', 12);
        p5.text('x (m)', p5.width - 40, offsetY + 20);
        p5.text('y (m)', offsetX - 30, 30);
        
        // X Asis scale
        p5.stroke('#ddd');
        p5.strokeWeight(1);
        for (let i = 0; i <= maxRange; i += 10) {
            const x = offsetX + i * scale;
            if (x < p5.width - 20) {
                p5.line(x, offsetY - 5, x, offsetY + 5);
                p5.fill('#666');
                p5.text(i.toString(), x - 8, offsetY + 20);
            }
        }
        
        // Y Asis scale
        for (let i = 0; i <= h0 + 10; i += 10) {
            const y = offsetY - i * scale;
            if (y > 20) {
                p5.stroke('#ddd');
                p5.line(offsetX - 5, y, offsetX + 5, y);
                p5.fill('#666');
                p5.text(i.toString(), offsetX - 25, y + 5);
            }
        }
        
        // parabola
        if (point.length > 0) {
            p5.stroke('#2563eb');
            p5.strokeWeight(3);
            p5.noFill();
            p5.beginShape();
            
            point.forEach((point) => {
                const x = offsetX + point.x * scale;
                const y = offsetY - point.y * scale;
                p5.vertex(x, y);
            });
            p5.endShape();
        }
        
        // start position
        const startX = offsetX;
        const startY = offsetY - h0 * scale;
        p5.fill('#16a34a');
        p5.noStroke();
        p5.circle(startX, startY, 12);
        
        // current position
        const currentX = offsetX + calc[0][1] * scale;
        const currentY = offsetY - calc[1][1] * scale;
        
        p5.fill('#dc2626');
        p5.noStroke();
        p5.circle(currentX, currentY, 16);
        
        // velcoity vector
        const vScale = 0.8;
        p5.stroke('#dc2626');
        p5.strokeWeight(2);
        const vEndX = currentX + calc[2][1] * vScale;
        const vEndY = currentY - calc[3][1] * vScale;
        p5.line(currentX, currentY, vEndX, vEndY);
        
        const angle = Math.atan2(calc[3][1], calc[2][1]);
        p5.line(vEndX, vEndY, 
                vEndX - 10 * Math.cos(angle - Math.PI/6), 
                vEndY + 10 * Math.sin(angle - Math.PI/6));
        p5.line(vEndX, vEndY, 
                vEndX - 10 * Math.cos(angle + Math.PI/6), 
                vEndY + 10 * Math.sin(angle + Math.PI/6));
        
        // ground
        p5.stroke('#16a34a');
        p5.strokeWeight(4);
        p5.line(0, offsetY, p5.width, offsetY);
        
        // point of ground
        if (maxRange > 0) {
            const landingX = offsetX + maxRange * scale;
            p5.stroke('#f59e0b');
            p5.strokeWeight(2);
            p5.drawingContext.setLineDash([5, 5]);
            p5.line(landingX, offsetY, landingX, offsetY - 20);
            p5.drawingContext.setLineDash([]);
            
            p5.fill('#f59e0b');
            p5.noStroke();
            p5.text('落地點', landingX - 20, offsetY - 25);
        }
    }

    useEffect(() =>{
        if (p5Ref.current){p5Ref.current.redraw()};
    }, [point]);
    return (
        <>
            <h1>平拋運動</h1>
            <div className="slider-row">
                <SliderInput label='初始高度' value={h0} setValue={setH} min={0} max={100} labelAfter="m" />
                <SliderInput label='初速度' value={v0} setValue={setV} min={0} max={50} labelAfter="m/s" />
                <SliderInput label='時間' value={t} setValue={setT} min={0} max={10} labelAfter="s" />    
                <div className="legend">
                    <div className="legend-item">
                        <span className="circle-box" style={{ backgroundColor: 'red' }}></span>
                        <span className="label">目前位置</span>
                    </div>
                    <div className="legend-item">
                        <span className="circle-box" style={{ backgroundColor: 'green'}}></span>
                        <span className="label">初始高度</span>
                    </div>
                    <div className="legend-item">
                        <span className="line-box" style={{ backgroundColor: 'blue' }}></span>
                        <span className="label">拋物線軌跡</span>
                    </div>
                    <div className="legend-item">
                        <span className="line-box" style={{ backgroundColor: 'red' }}></span>
                        <span className="label">速度向量</span>
                    </div>
                </div>
            </div>
            <div className="slider-row">
                <div className="calc-background" style={{"--calc-width": "500px", "--calc-height": "560px"}}>
                    <div>
                        <h3>
                            當前運度方程式：
                            <input 
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {setChecked(e.target.checked)}}
                            />
                            公式
                        </h3> 
                        <Eq equation={eq}/>
                        <h3>計算結果：</h3>
                        {calc.map((value, index) =>(
                            <h4 key={index}>{value[0]}：{value[1].toFixed(2)}</h4>
                        ))}
                    </div>
                </div>
                <div className="canvas-border">
                    <Sketch setup={setup} draw={draw}/>
                </div>
            </div>
            
       </>
    )
}