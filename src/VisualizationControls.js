function VisualizationControls({ onPrev, onNext, hidePrev, hideNext }) {
    return (
      <div className="flex justify-between">
        <div>
          {!hidePrev && <button onClick={onPrev} className="bg-sky-700 text-white px-2 py-1 rounded">Previous</button>}
        </div>
        <div>
          {!hideNext && <button onClick={onNext} className="bg-sky-700 text-white px-2 py-1 rounded">Next</button>}
        </div>
      </div>
    );
}

export default VisualizationControls;