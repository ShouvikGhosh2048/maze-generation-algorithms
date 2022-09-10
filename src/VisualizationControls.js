import { useEffect } from 'react';

function VisualizationControls({ history, setHistory, currentStepIndex, setCurrentStepIndex, generateNextStep, playing, setPlaying, hidePrev, hideNext }) {
  useEffect(() => {
    if(playing) {
      let timeoutId = setTimeout(() => {
        if (currentStepIndex < history.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
        }
        else {
          let nextStep = generateNextStep(history);
          if (nextStep === null) {
            setPlaying(false);
            return;
          }
          setHistory([
            ...history,
            nextStep
          ]);
          setCurrentStepIndex(currentStepIndex + 1);
        }
      },200);
      return () => {clearTimeout(timeoutId);};
    }
  });

  function onPrev() {
    setPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }

  function onNext() {
    setPlaying(false);
    if (currentStepIndex < history.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
    else {
      let nextStep = generateNextStep(history);
      if (nextStep === null) {
        return;
      }
      setHistory([
        ...history,
        nextStep
      ]);
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }

  function onPlay() {
    let currentStep = history[currentStepIndex];
    if (currentStep.stepType !== '') {
      setPlaying(true);
    }
  }

  function onPause() {
    setPlaying(false);
  }

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