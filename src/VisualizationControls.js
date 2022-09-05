function VisualizationControls({ onPrev, onNext, onPlay, onPause, playing, hidePrev, hideNext }) {
    let playControl;
    if (playing) {
      playControl = <button onClick={onPause} className="bg-sky-700 text-white px-2 py-1 rounded">Pause</button>
    }
    else {
      playControl = <button onClick={onPlay} className="bg-sky-700 text-white px-2 py-1 rounded">Play</button>;
    }
    return (
      <div className="flex justify-between">
        <div>
          {!hidePrev && <button onClick={onPrev} className="bg-sky-700 text-white px-2 py-1 rounded">Previous</button>}
        </div>
        <div>
          {!hideNext && playControl}
        </div>
        <div>
          {!hideNext && <button onClick={onNext} className="bg-sky-700 text-white px-2 py-1 rounded">Next</button>}
        </div>
      </div>
    );
}

export default VisualizationControls;