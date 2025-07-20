import '../App';
import ai_photo from '../assets/ai_photo.png';

export default function Intro() {
  return (
    <section className='intro'>
      <h1>物理複習＆React練習小站</h1>
      <p>
        這個網站是我用來複習高中物理的同時，
        練習用 <strong>React</strong> 和 <strong>Vite</strong> 打造前端專案。
      </p>

      <h2>網站特色：</h2>
      <ul>
        <li>整理物理重點，幫助自己複習課程內容</li>
        <li>練習 React 組件拆分與互動設計</li>
        <li>使用 Vite 來快速開發與打包</li>
        <li>未來會加入更多物理模擬</li>
      </ul>

      <p>
        希望這個專案不只是自己的筆記，也能幫助想一起複習物理的你！
      </p>
      <strong><li>建議開縮放大小110%</li></strong>
      <h1>製作者：Bosenda</h1>
			<img src={ai_photo} alt="Bosenda photo" className='photo'/>
    </section>
  );
}
