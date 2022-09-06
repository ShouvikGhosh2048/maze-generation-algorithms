import { useState, useEffect } from 'react';
import WalledGrid from './WalledGrid';
import VisualizationControls from './VisualizationControls';
import { Link } from 'react-router-dom';

//Use DFS to set componentLabels[x][y] = label for all (x,y) in the connected component of (i,j) in the grid.
function labelComponent(componentLabels, grid, i, j, label) {
  if(componentLabels[i][j] !== null) {
    return;
  }
  componentLabels[i][j] = label;
  if (i > 0 && !grid.horizontalWalls[i][j]) {
    labelComponent(componentLabels, grid, i-1, j, label);
  }
  if (i < 9 && !grid.horizontalWalls[i+1][j]) {
    labelComponent(componentLabels, grid, i+1, j, label);
  }
  if (j > 0 && !grid.verticalWalls[i][j]) {
    labelComponent(componentLabels, grid, i, j-1, label);
  }
  if (j < 9 && !grid.verticalWalls[i][j + 1]) {
    labelComponent(componentLabels, grid, i, j+1, label);
  }
}

// We identify the connencted components.
// If there aren't any connected components of size > 1, we return null.
// Else we choose a random component among connected components of the largest size.
// Within that component, we choose a start and end randomly.
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
      // We will generate a new grid with walls on the edges, 
      // and for the inner walls, each occurs with probability 0.5.
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

      // result === null means that we didn't get a component of size > 1, so we regenerate a grid.
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

      return {
        grid,
        stepType: 'generatedEndPointsAndComponent',
        start,
        end,
        component,
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
  let [playing, setPlaying] = useState(false);

  useEffect(() => {
    if(playing) {
      let timeoutId = setTimeout(() => {
        if (currentStepIndex < history.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
        }
        else {
          let nextStep = generateSimpleRandomNextStep(history[currentStepIndex]);
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
      },100);
      return () => {clearTimeout(timeoutId);};
    }
  });

  function onNew() {
    setPlaying(false);
    setHistory([{
      stepType: 'initialGrid',
    }]);
    setCurrentStepIndex(0);
  }

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

  function onPlay() {
    let currentStep = history[currentStepIndex];
    if (currentStep.stepType !== 'mazeGenerated') {
      setPlaying(true);
    }
  }

  function onPause() {
    setPlaying(false);
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

  let wallMeetingPoints = [];
  let horizontalWalls = [];
  let verticalWalls = [];
  let squares = [];
  switch(currentStep.stepType) {
    case 'initialGrid': {
      // There will be black walls on the grid edge, black wall meetings on the grid edge, 
      // and all the squares will be white.
      for(let i = 0; i < 11; i++) {
        let row = [];
        for(let j = 0; j < 11; j++) {
          if(i === 0 || i === 10 || j === 0 || j === 10) {
            row.push('bg-black');
          }
          else {
            row.push('bg-white');
          }
        }
        wallMeetingPoints.push(row);
      }
      
      for(let i = 0; i < 11; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
          if(i === 0 || i === 10) {
            row.push('bg-black');
          }
          else {
            row.push('bg-white');
          }
        }
        horizontalWalls.push(row);
      }

      for(let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 11; j++) {
          if(j === 0 || j === 10) {
            row.push('bg-black');
          }
          else {
            row.push('bg-white');
          }
        }
        verticalWalls.push(row);
      }

      for(let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
          row.push('bg-white');
        }
        squares.push(row);
      }
      break;
    }
    case 'generatedWalls':
    case 'regeneratedWalls': {
      // There will be black walls depending on currentStep.grid, and all the squares will be white.
      // For wall meetings, we check if there are any adjacent black walls - if so we make it black.
      for(let i = 0; i < 11; i++) {
        let row = [];
        for(let j = 0; j < 11; j++) {
          let adjacentWall = false;
          if (j < 10 && currentStep.grid.horizontalWalls[i][j]) {
            adjacentWall = true;
          }
          if (j > 0 && currentStep.grid.horizontalWalls[i][j-1]) {
            adjacentWall = true;
          }
          if (i < 10 && currentStep.grid.verticalWalls[i][j]) {
            adjacentWall = true;
          }
          if (i > 0 && currentStep.grid.verticalWalls[i-1][j]) {
            adjacentWall = true;
          }

          if(adjacentWall) {
            row.push('bg-black');
          }
          else {
            row.push('bg-white');
          }
        }
        wallMeetingPoints.push(row);
      }
      
      for(let i = 0; i < 11; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
          if(currentStep.grid.horizontalWalls[i][j]) {
            row.push('bg-black');
          }
          else {
            row.push('bg-white');
          }
        }
        horizontalWalls.push(row);
      }

      for(let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 11; j++) {
          if(currentStep.grid.verticalWalls[i][j]) {
            row.push('bg-black');
          }
          else {
            row.push('bg-white');
          }
        }
        verticalWalls.push(row);
      }

      for(let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
          row.push('bg-white');
        }
        squares.push(row);
      }
      break;
    }
    case 'generatedEndPointsAndComponent': {
      // There will be black walls depending on currentStep.grid.
      // If currentStep.grid doesn't place a black wall at a location, 
      // we check if the wall has an adjacent square which is a member of the component.
      // If so, we make it red.
      // The start square and end square will be blue and green respectively.
      // Other squares in the component will be red.
      // For wall meetings, we check if there are any adjacent black walls - if so we make it black.
      // Else if there are any adjacent red walls, we make it red.
      let isComponentSquare = [];
      for(let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
          row.push(false);
        }
        isComponentSquare.push(row);
      }

      currentStep.component.forEach(element => {
        isComponentSquare[element[0]][element[1]] = true;
      });
      
      for(let i = 0; i < 11; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
          if(currentStep.grid.horizontalWalls[i][j]) {
            row.push('bg-black');
          }
          else if(isComponentSquare[i][j] || isComponentSquare[i-1][j]) {
            row.push('bg-red-200');
          }
          else {
            row.push('bg-white');
          }
        }
        horizontalWalls.push(row);
      }

      for(let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 11; j++) {
          if(currentStep.grid.verticalWalls[i][j]) {
            row.push('bg-black');
          }
          else if(isComponentSquare[i][j] || isComponentSquare[i][j-1]) {
            row.push('bg-red-200');
          }
          else {
            row.push('bg-white');
          }
        }
        verticalWalls.push(row);
      }

      for(let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
          if(i === currentStep.start[0] && j === currentStep.start[1]) {
            row.push('bg-blue-900');
          }
          else if (i === currentStep.end[0] && j === currentStep.end[1]) {
            row.push('bg-green-900');
          }
          else if (isComponentSquare[i][j]) {
            row.push('bg-red-200');
          }
          else {
            row.push('bg-white');
          }
        }
        squares.push(row);
      }

      for(let i = 0; i < 11; i++) {
        let row = [];
        for(let j = 0; j < 11; j++) {
          let adjacentWall = false;
          if (j < 10 && currentStep.grid.horizontalWalls[i][j]) {
            adjacentWall = true;
          }
          if (j > 0 && currentStep.grid.horizontalWalls[i][j-1]) {
            adjacentWall = true;
          }
          if (i < 10 && currentStep.grid.verticalWalls[i][j]) {
            adjacentWall = true;
          }
          if (i > 0 && currentStep.grid.verticalWalls[i-1][j]) {
            adjacentWall = true;
          }

          let adjacentRed = false;
          if (j < 10 && horizontalWalls[i][j] === 'bg-red-200') {
            adjacentRed = true;
          }
          if (j > 0 && horizontalWalls[i][j-1] === 'bg-red-200') {
            adjacentRed = true;
          }
          if (i < 10 && verticalWalls[i][j] === 'bg-red-200') {
            adjacentRed = true;
          }
          if (i > 0 && verticalWalls[i-1][j] === 'bg-red-200') {
            adjacentRed = true;
          }
          if(adjacentWall) {
            row.push('bg-black');
          }
          else if(adjacentRed) {
            row.push('bg-red-200');
          }
          else {
            row.push('bg-white');
          }
        }
        wallMeetingPoints.push(row);
      }
      break;
    }
  }

  return (
    <div className="flex flex-col w-min">
      <div className="flex justify-end mb-2">
        <button onClick={onNew} className="bg-sky-700 text-white px-2 py-1 rounded">Reset</button>
      </div>
      <WalledGrid wallMeetingPoints={wallMeetingPoints} horizontalWalls={horizontalWalls} verticalWalls={verticalWalls} squares={squares} />
      <p>{description}</p>
      <VisualizationControls onPrev={onPrev} onNext={onNext} onPlay={onPlay} onPause={onPause} playing={playing} hidePrev={currentStep.stepType === 'initialGrid'} hideNext={currentStep.stepType === 'generatedEndPointsAndComponent'}/>
    </div>
  );
}

function SimpleRandom() {
  return (
    <div className="p-5 min-w-min max-w-lg mx-auto">
      <Link to="/" className="underline">Home</Link>
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