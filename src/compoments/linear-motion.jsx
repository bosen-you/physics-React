import { useState, useMemo, useRef, useEffect } from "react";
import 'katex/dist/katex.min.css';
import Sketch from "react-p5";
import { SliderInput, Line_Chart, Eq} from './simply-imput';

export default function LinearMotion(){
    const [x0, setX] = useState(0);
    const [v0, setV] = useState(0);
    const [a0, setA] = useState(0);
    const [t, setT] = useState(1);
    const [k, setK] = useState(0);
    const [motion, setMotion] = useState('constant');
    const [running, setRunning] = useState(false);
    const [cur_time, setCur_time] = useState(0);
    const [checked, setChecked] = useState(false);

    const cal = (time) =>{
        const curX = x0 + v0*time + 0.5*a0*time*time, curV = v0 + a0*time;
        var curA;
        switch (motion){
            case 'constant':
                curA = a0;
                break;
            case 'linear':
                curA = a0 + k * time;
                break;
            case 'damped':
                curA = a0 - k * time;
                break;
            case 'SHM':
                curA = -1 * k * time;
                break;
            default: 
                curA = 0;
        }
        return {curX, curV, curA};
    }

    const latex = () => {
        let x_t, v_t, a_t;

        const format = (val) => {
            if (typeof val === 'string') return val;
            return val < 0 ? `(${val})` : `${val}`;
        };

        const x0_disp = checked? 'x_{0}': format(x0);
        const v0_disp = checked? 'v_{0}': format(v0);
        const a0_disp = checked? 'a_{0}': format(a0);
        const t_disp = checked? 't': format(t);
        const k_disp = checked ? 'k': format(k);

        x_t = `x(t) = ${x0_disp} + \\frac{1}{2} \\cdot ${a0_disp} \\cdot ${t_disp}^{2}`;
        v_t = `v(t) = ${v0_disp} + ${a0_disp} \\cdot ${t_disp}`;

        switch (motion) {
            case 'constant':
                a_t = `a(t) = ${a0_disp}`;
                break;
            case 'linear':
                a_t = `a(t) = ${a0_disp} + ${k_disp} \\cdot ${t_disp}`;
                break;
            case 'damped':
                a_t = `a(t) = ${a0_disp} - ${k_disp} \\cdot ${v0_disp}`;
                break;
            case 'SHM':
                a_t = `a(t) = -${k_disp} \\cdot ${x0_disp}`;
                break;
            default:
                a_t = 'a(t) = 0';
        }

        return [["位置", x_t], ["速度", v_t], ["加速度", a_t]];
    };

    const { dataX, dataV, dataA, x1, v1, a1, all} = useMemo(() =>{
        const timestep = t / 50;
        const x_point = [], v_point = [], a_point = [];

        let x1, v1, a1;
        for (var i = 0; i <= 30; i++){
            const curT = timestep*i;
            const {curX, curV, curA} = cal(curT);
            if (i == 30){ x1 = curX, v1 = curV, a1 = curA;}
            x_point.push({ t: parseFloat(curT.toFixed(2)), x: parseFloat(curX.toFixed(2)) });
            v_point.push({ t: parseFloat(curT.toFixed(2)), v: parseFloat(curV.toFixed(2)) });
            a_point.push({ t: parseFloat(curT.toFixed(2)), a: parseFloat(curA.toFixed(2))});
        }
        const all = latex();
        return {
            dataX: x_point, 
            dataV: v_point,
            dataA: a_point,
            x1, v1, a1, 
            all
        };
    }, [x0, v0, a0, t, k, motion, checked]); 


    const startTimeRef = useRef(0);
    const animationRef = useRef(null);
    let p5Ref = useRef(0);
    const setup = (p5, canvasParentRef) =>{
        p5Ref.current = p5;
        p5.createCanvas(800, 190).parent(canvasParentRef);
        p5.noLoop();
    };

    const draw = (p5) =>{
        p5.background('white');

        //coordinate
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.line(50, 135, 750, 135);

        p5.strokeWeight(1);
        p5.textAlign(p5.CENTER);
        p5.textSize(10);
        p5.fill(0);
        for (var point = 0; point <= 10; point++){
            const x = 50 + 70*point;
            p5.line(x, 135, x, 140);
            const pos = (point-5)*20;
            p5.text(pos, x, 150);
        }
        
        //circle
        const {curX, curV, curA} = cal(cur_time);
        let ballX = 400 + curX*3.5;
        if (ballX > 750 || ballX < 50){
            ballX = (ballX > 750)?50:750;
            if (running){
                startTimeRef.current = Date.now();
                setCur_time(0);
            }
        }

        p5.fill('red');
        p5.stroke('red');
        p5.strokeWeight(2);
        p5.circle(ballX, 120, 30);

        //velocity
        if (Math.abs(curX) > 0.1){
            const v_len = curX*5;
            p5.stroke('blue');
            p5.strokeWeight(3);
            p5.line(ballX, 95, ballX+v_len, 95);

            if (Math.abs(v_len) > 5){
                const arrow_size = 8, arrow_dir = (v_len > 0)?1:-1;
                const arrow_len = ballX+v_len;
                p5.line(arrow_len, 95, arrow_len-arrow_size*arrow_dir, 95-arrow_size); 
                p5.line(arrow_len, 95, arrow_len-arrow_size*arrow_dir, 95+arrow_size); 
            }

            p5.fill('blue');
            p5.noStroke();
            p5.textAlign(p5.LEFT);
            p5.textSize(12);
            p5.text(`v = ${curV.toFixed(2)} m/s`, ballX+20, 85);
        }

        // acceleration
        if (Math.abs(curA) > 0.1) {
            const acc_len = curA * 10;
            
            p5.stroke('green');
            p5.strokeWeight(3);
            p5.line(ballX, 65, ballX + acc_len, 65);
            
            // arrow
            if (Math.abs(acc_len) > 5) {
                const arrow_size = 8, arrow_dir = (acc_len > 0)?1:-1;
                const arrow_len = ballX+acc_len;
                p5.line(arrow_len, 65, arrow_len-arrow_size*arrow_dir, 65-arrow_size); 
                p5.line(arrow_len, 65, arrow_len-arrow_size*arrow_dir, 65+arrow_size); 
            }
            
            p5.fill('green');
            p5.noStroke();
            p5.textAlign(p5.LEFT);
            p5.textSize(12);
            p5.text(`a = ${curA.toFixed(2)} m/s²`, ballX + 20, 50);
        }
    }

    useEffect(() => {
        if (!running) return;
        
        const animate = () => {
            const now = Date.now();
            const elapsed = (now - startTimeRef.current) / 1000; // 轉換為秒
            setCur_time(elapsed);
            
            if (p5Ref.current) {
                p5Ref.current.redraw();
            }
            
            if (running) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };
        
        startTimeRef.current = Date.now();
        animationRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [running, x0, v0, a0, motion, k]);

    
    useEffect(() => {
        if (!running && p5Ref.current) {
            p5Ref.current.redraw();
        }
    }, [x0, v0, a0, motion, k, running]);

    // start or stop
    const togglePlay = () => {
        setRunning(!running);
    };

    const resetAnimation = () => {
        setRunning(false);
        setCur_time(0);
        if (p5Ref.current) {
            p5Ref.current.redraw();
        }
    };
    
    return(
        <>
            <div className="slider-row">
                <h1>一維直線運動</h1>
                <select value={motion} onChange={(e) => {setMotion(e.target.value)}} className="dropdown"> 
                    <option value="constant">等加速度運動 (a = 常數)</option>
                    <option value="linear">線性變加速度 (a = a₀ + kt)</option>
                    <option value="damped">阻尼運動 (a = a₀ - kv)</option>
                    <option value="SHM">簡諧運動 (a = -kx)</option>
                </select>
            </div>
            <div className="slider-row">
                <SliderInput label="初始位置" value={x0} setValue={setX} min={-100} max={100} labelAfter='m'/>
                <SliderInput label="初始速度" value={v0} setValue={setV} min={-100} max={100} labelAfter='m/s'/>
                <SliderInput label="初始加速度" value={a0} setValue={setA} min={-10} max={10} labelAfter="m/s^{2}"/>
                <SliderInput label="時間" value={t} setValue={setT} min={1} max={50} labelAfter="s"/>
                {motion !== 'constant' && (<SliderInput label="常數k" value={k} setValue={setK} min={-100} max={100} />)}
            </div>
            <div className="slider-row">
                {/* 動畫控制按鈕 */}
                <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                    <button 
                        onClick={togglePlay}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: running ? '#ff4444' : '#44ff44',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {running ? '暫停' : '播放'}
                    </button>
                    <button 
                        onClick={resetAnimation}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4444ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        重置
                    </button>
                </div>
            </div>
            <div className="slider-row">
                <div className="calc-background">
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
                        <Eq equation={all} />
                    </div>
                    <div>
                        <h3>計算結果：</h3>
                        <h4>最終位置：{x1.toFixed(2)}</h4>
                        <h4>最終速度：{v1.toFixed(2)}</h4>
                        <h4>最終加速度：{a1.toFixed(2)}</h4>
                    </div>
                </div>
                <div className="canvas-border">
                    <Sketch setup={setup} draw={draw} />
                </div>
            </div>
            <div className="slider-row">
                <Line_Chart topic="X-t圖" data={dataX} dataKey='x' xlabel='時間 t (s)' ylabel='位移 x (m)' color='blue'/>
                <Line_Chart topic="V-t圖" data={dataV} dataKey='v' xlabel='時間 t (s)' ylabel='速度 v (m/s)' color='red'/>
                <Line_Chart topic="A-t圖" data={dataA} dataKey='a' xlabel='時間 t (s)' ylabel='加速度 a (m/s*s)' color='orange'/>
            </div>
        </>
    );
}