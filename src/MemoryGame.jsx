import { useState } from 'react';
import { useGiphy } from './useGiphy';
import { GifGrid } from './GifGrid';

function Modal({ text, score, visible, onClose }) {
  if (!visible) return null;

  return (
    <div className='modal'>
      <div className="modal-content">
        <span className='close' onClick={onClose}>&times;</span>
        <h3>{text}</h3>
        <p>Your score was {score}</p>
      </div>
    </div>
  )
}

function MemoryGame() {
  const [tag, setTag] = useState('cats');
  const [amount, setAmount] = useState(6);
  const { data, setData, loading, reload } = useGiphy(tag, amount);
  const [clicked, setClicked] = useState(new Set());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function shuffleArr(arr) {
    const shuffled = [...arr];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  function handleImageClick(info) {
    if (clicked.has(info.id)) {
      setGameOver(true);
      return;
    }
    
    const updated = new Set(clicked);
    updated.add(info.id);
    setClicked(updated);

    setScore((prev) => {
      const newScore = prev + 1;
      if (newScore > bestScore) {
        setBestScore(newScore);
      }

      if (newScore >= amount) {
        setGameOver(true);
      }

      return newScore;
    });
    
    setData((prev) => shuffleArr(prev));
  }

  if (loading) {
    return <p className='loading'>Loading<span className='dots'></span></p>
  }

  return (
    <>
      <h2>Giphy Memory Game</h2>
      <header>
        <div>
          <p>Score: {score}</p>
          <p>Best score: {bestScore}</p>
        </div>
        <div>
          <div className="headerItem">
            <label htmlFor="tag">Choose a tag </label>
            <select 
              name="tag" 
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="cats">Cats</option>
              <option value="dogs">Dogs</option>
              <option value="corgi">Corgi</option>
            </select>
          </div>
          <div className="headerItem">
            <label htmlFor="count">Gif amount </label>
            <select 
              name="amount" 
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="18">18</option>
            </select>
          </div>

        </div>
      </header>

      <GifGrid gifs={data} onClick={handleImageClick}/>

      <Modal 
        text={score < amount ? 'Game Over' : 'Victory!'}
        score={score}
        visible={gameOver}
        onClose={() => {
          setGameOver(false);
          setScore(0);
          setClicked(new Set());
          reload();
        }}
      />
    </>
  )
}

export { MemoryGame };
