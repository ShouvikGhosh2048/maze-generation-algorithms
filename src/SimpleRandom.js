import { useState } from 'react';
import WalledGrid from './WalledGrid';
import VisualizationControls from './VisualizationControls';

function labelComponent(componentLabels, grid, i, j, component) {
  if(componentLabels[i][j] !== null) {
    return;
  }
  componentLabels[i][j] = component;
  if (i > 0 && !grid.horizontalWalls[i][j]) {
    labelComponent(componentLabels, grid, i-1, j, component);
  }
  if (i < 9 && !grid.horizontalWalls[i+1][j]) {
    labelComponent(componentLabels, grid, i+1, j, component);
  }
  if (j > 0 && !grid.verticalWalls[i][j]) {
    labelComponent(componentLabels, grid, i, j-1, component);
  }
  if (j < 9 && !grid.verticalWalls[i][j + 1]) {
    labelComponent(componentLabels, grid, i, j+1, component);
  }
}

function generateEndPointsAndComponent(grid) {
  let componentLabels = [];
  for(let i = 0; i < 10; i++) {
    let row = [];
    for (let j = 0; j < 10; j++) {
      row.push(null);
    }
    componentLabels.push(row);
  }

  let counter = 0;
  for(let i = 0; i < componentLabels.length; i++) {
    for (let j = 0; j < componentLabels[0].length; j++) {
      if (componentLabels[i][j] === null) {
        labelComponent(componentLabels, grid, i, j, counter);
        counter++;
      }
    }
  }

  let components = [];
  for(let i = 0; i < counter; i++) {
    components.push([]);
  }
  for(let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      components[componentLabels[i][j]].push([i,j]);
    }
  }

  let maxComponentLength = Math.max(...components.map(component => component.length));
  if (maxComponentLength === 1) {
    return null;
  }
  components = components.filter(component => component.length === maxComponentLength);

  let component = components[Math.floor(Math.random() * components.length)];

  let startIndex = Math.floor(Math.random() * component.length);
  let start = component[startIndex];

  // Swap the start element and last element.
  component[startIndex] = component[component.length - 1];
  component[component.length - 1] = start;

  let end = component[Math.floor(Math.random() * (component.length - 1))];

  return [start, end, component];
}

function generateSimpleRandomNextStep(step) {
  switch(step.stepType) {
    case 'initialGrid': {
      let grid = {};

      grid.verticalWalls = [];
      for(let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 11; j++) {
          if(j === 0 || j === 10 || Math.random() < 0.5) {
            row.push(true);
          }
          else {
            row.push(false);
          }
        }
        grid.verticalWalls.push(row);
      }

      grid.horizontalWalls = [];
      for(let i = 0; i < 11; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
          if(i === 0 || i === 10 || Math.random() < 0.5) {
            row.push(true);
          }
          else {
            row.push(false);
          }
        }
        grid.horizontalWalls.push(row);
      }

      return {
        grid,
        stepType: 'generatedWalls',
      };
    }
    case 'generatedWalls': 
    case 'regeneratedWalls': {
      let result = generateEndPointsAndComponent(step.grid);

      if (result === null) {
        let grid = {};

        grid.verticalWalls = [];
        for(let i = 0; i < 10; i++) {
          let row = [];
          for(let j = 0; j < 11; j++) {
            if(j === 0 || j === 10 || Math.random() < 0.5) {
              row.push(true);
            }
            else {
              row.push(false);
            }
          }
          grid.verticalWalls.push(row);
        }

        grid.horizontalWalls = [];
        for(let i = 0; i < 11; i++) {
          let row = [];
          for(let j = 0; j < 10; j++) {
            if(i === 0 || i === 10 || Math.random() < 0.5) {
              row.push(true);
            }
            else {
              row.push(false);
            }
          }
          grid.horizontalWalls.push(row);
        }

        return {
          grid,
          stepType: 'regeneratedWalls',
        };
      }

      let [start, end, component] = result;
      let grid = {...step.grid};

      grid.squareBackground = [];
      for (let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
          if (i === start[0] && j === start[1]) {
            row.push('bg-blue-900');
          }
          else if (i === end[0] && j === end[1]) {
            row.push('bg-green-900');
          }
          else if (component.findIndex(elem => elem[0] === i && elem[1] === j) !== -1) {
            row.push('bg-red-200');
          }
          else {
            row.push('bg-white');
          }
        }
        grid.squareBackground.push(row);
      }

      return {
        grid,
        stepType: 'generatedEndPointsAndComponent',
      };
    }
    default: {
      return null;
    }
  }
}

function SimpleRandomVisualization() {
  let [history, setHistory] = useState([]);
  let [currentStepIndex, setCurrentStepIndex] = useState(null);
  
  function onNew() {
    let grid = {};

    grid.verticalWalls = [];
    for(let i = 0; i < 10; i++) {
      let row = [];
      for(let j = 0; j < 11; j++) {
        if(j === 0 || j === 10) {
          row.push(true);
        }
        else {
          row.push(false);
        }
      }
      grid.verticalWalls.push(row);
    }

    grid.horizontalWalls = [];
    for(let i = 0; i < 11; i++) {
      let row = [];
      for(let j = 0; j < 10; j++) {
        if(i === 0 || i === 10) {
          row.push(true);
        }
        else {
          row.push(false);
        }
      }
      grid.horizontalWalls.push(row);
    }

    setHistory([{
      grid,
      stepType: 'initialGrid',
    }]);
    setCurrentStepIndex(0);
  }

  function onPrev() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }

  function onNext() {
    if (currentStepIndex < history.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
    else {
      let nextStep = generateSimpleRandomNextStep(history[currentStepIndex]);
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

  if(history.length === 0) {
    return (
      <button onClick={onNew} className="bg-sky-700 text-white px-2 py-1 rounded">Start visualization</button>
    );
  }
  
  let currentStep = history[currentStepIndex];

  let description = '';
  switch(currentStep.stepType) {
    case 'initialGrid': {
      description = 'We start with a grid with walls on the boundary.';
      break;
    }
    case 'generatedWalls': {
      description = 'We generate the walls, each wall having a probability 0.5 of occuring.';
      break;
    }
    case 'regeneratedWalls': {
      description = "We regenerate the walls, as we didn't have any connected component of size greater than 1.";
      break;
    }
    case 'generatedEndPointsAndComponent': {
      description = 'We choose a random component with size greater than 1, and choose the endpoints.';
      break;
    }
  }

  return (
    <div className="flex flex-col w-min">
      <div className="flex justify-end mb-2">
        <button onClick={onNew} className="bg-sky-700 text-white px-2 py-1 rounded">Reset</button>
      </div>
      <WalledGrid grid={currentStep.grid} />
      <p>{description}</p>
      <VisualizationControls onPrev={onPrev} onNext={onNext} hidePrev={currentStep.stepType === 'initialGrid'} hideNext={currentStep.stepType === 'generatedEndPointsAndComponent'}/>
    </div>
  );
}

function SimpleRandom() {
  return (
    <div className="p-5 min-w-min max-w-lg mx-auto">
      <h1 className="font-bold text-lg">Simple Random</h1>
      <p className="mb-5">
        Consider and m by n grid of squares. Each square has 4 sides which can be covered with walls.
      </p>
      <p className="mb-5">
        All square sides lying on the boundary of the rectangle will have walls.  
        For the other square sides, each will have a wall with probability p.
      </p>
      <p className="mb-5">
        We then find the connected components of the grid.
        If all components have size 1, we keep generating a new set of walls until at least one component has size greater than 1.
      </p>
      <p className="mb-5">
        Among all components with the maximum size, we randomly choose a component,
        and choose two squares on the component, one for the start and the other for the end.
      </p>
      <div className="flex justify-center">
        <SimpleRandomVisualization />
      </div>
    </div>
  );
}

export default SimpleRandom;