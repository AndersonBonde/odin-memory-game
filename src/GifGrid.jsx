function GifGrid({ gifs, onClick }) {
  return (
    <div className="imageContainer">
      {gifs.map((gif) => (
        <div 
          key={gif.id} 
          className="imageCard"
          onClick={() => onClick(gif)}
        >
          <img src={gif.images?.downsized?.url} alt={gif.title}></img>
        </div>
      ))}
    </div>
  );
}

export { GifGrid };
