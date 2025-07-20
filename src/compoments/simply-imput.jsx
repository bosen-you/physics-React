import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import {XAxis, YAxis, LineChart, Tooltip, Line, CartesianGrid } from "recharts";

export function SliderInput({ label, value, setValue, min, max, labelAfter = '', step = 1 }) {
  const handleChange = (e) => {
    const val = Number(e.target.value);
    if (val >= min && val <= max) {
      setValue(val);
    }
  };

  return (
    <div className="slider-container">
      <h3>{label}：{value} {<InlineMath math={labelAfter}/>}</h3>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export function Line_Chart({topic, data, dataKey, xlabel, ylabel, color}){
  return(
  <div className='slider-container'>
    <h2>{topic}</h2>
    <LineChart
        width={400}
        height={300}
        data={data}
        margin={{
            top: 30,
            bottom: 30, 
            right: 30, 
            left: 5
        }}
    >
      <CartesianGrid strokeDasharray="3" />
      <XAxis 
          dataKey={dataKey}
          label={{ value: xlabel, position: 'insideBottom', offset: -10}}
      />
      <YAxis label={{ value: ylabel, angle: -90, position: 'insideLeft' }}/>
      <Tooltip />
      <Line type="monotone" dataKey={dataKey} stroke={color}/>
    </LineChart>
  </div >
)}

export function Eq({equation}){
  return (
    <div >
      {equation.map((eq, index)=> (
        <h4 key={index}>{eq[0]}：<InlineMath math={eq[1]} /></h4>
      ))}
    </div>
  )
}