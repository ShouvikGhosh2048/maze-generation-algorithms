import { useState } from 'react';
import VisualizationControls from './VisualizationControls';
import { Link } from 'react-router-dom';

function Grid({ wallMeetingPoints, horizontalWalls, verticalWalls, squares }) {
  let divs = [];
  for(let i = 0; i < 21; i++) {
      for(let j = 0; j < 21; j++) {
          if(i % 2 === 0) {
              if(j % 2 === 0) {
                  divs.push(<div key={21 * i + j} className={wallMeetingPoints[Math.floor(i/2)][Math.floor(j/2)]}></div>);
              }
              else {
                  divs.push(<div key={21 * i + j} className={horizontalWalls[Math.floor(i/2)][Math.floor(j/2)]}></div>);
              }
          }
          else {
              if(j % 2 === 0) {
                  divs.push(<div key={21 * i + j} className={verticalWalls[Math.floor(i/2)][Math.floor(j/2)]}></div>);
              }
              else {
                  divs.push(<div key={21 * i + j} className={squares[Math.floor(i/2)][Math.floor(j/2)]}></div>);
              }
          }
      }
  }

  return (
      <div className="grid grid-cols-[repeat(10,_3px_25px)_3px] grid-rows-[repeat(10,_3px_25px)_3px] w-fit">
          {divs}
      </div>
  );
}

function generateRecursiveDivisionNextStep(history) {
  let step = history[history.length - 1];
  switch(step.stepType) {
    case 'initialGrid': {
      return {
        stepType: 'placedWalls',
        x: 1 + Math.floor(Math.random() * 9),
        y: 1 + Math.floor(Math.random() * 9),
      };
    }
    case 'placedWalls': 
    case 'removedWalls':
    case 'skippedChamber': {
        let chambers = [[{x: 0, y: 0, w: 10, h: 10}]];

        for (let i = 1; i < history.length; i++) {
            let step = history[i];
            if (step.stepType === 'placedWalls') {
                let chamber_group = chambers[chambers.length - 1];
                let chamber = chamber_group[chamber_group.length - 1];
                let {x, y} = step;
                chambers.push([
                    {x: x, y: y, w: chamber.x + chamber.w - x, h: chamber.y + chamber.h - y},
                    {x: chamber.x, y: y, w: x - chamber.x, h: chamber.y + chamber.h - y},
                    {x: x, y: chamber.y, w: chamber.x + chamber.w - x, h: y - chamber.y},
                    {x: chamber.x, y: chamber.y, w: x - chamber.x, h: y - chamber.y},
                ]);
            }
            else if (step.stepType === 'skippedChamber') {
              while(true) {
                let chamber_group = chambers[chambers.length - 1];
                if (chamber_group.length === 1) {
                  chambers.pop();
                  if (chambers.length === 0) {
                    break;
                  }
                }
                else {
                  chamber_group.pop();
                  break;
                }
              }
            }
        }

        if (step.stepType === 'placedWalls') {
            let chamber_group = chambers[chambers.length - 2];
            let chamber = chamber_group[chamber_group.length - 1];

            let wallX = step.x;
            let wallY = step.y;

            let skipSection = ['U','D','L','R'][Math.floor(Math.random() * 4)];

            let removedWalls = [];
            if (skipSection !== 'U') {
                //[wallX, chamber.y] to [wallX, wallY]
                let choiceY = chamber.y + Math.floor(Math.random() * (wallY - chamber.y));
                removedWalls.push(
                    {
                        endpoint: [wallX, choiceY],
                        type: 'V'
                    }
                );
            }
            if (skipSection !== 'D') {
                //[wallX, wallY] to [wallX, chamber.y + chamber.w]
                let choiceY = wallY + Math.floor(Math.random() * (chamber.y + chamber.h - wallY));
                removedWalls.push(
                  {
                    endpoint: [wallX, choiceY],
                    type: 'V'
                  }
                );
            }
            if (skipSection !== 'L') {
                //[chamber.x, wallY] to [wallX, wallY]
                let choiceX = chamber.x + Math.floor(Math.random() * (wallX - chamber.x));
                removedWalls.push(
                  {
                    endpoint: [choiceX, wallY],
                    type: 'H'
                  }
                );
            }
            if (skipSection !== 'R') {
                //[wallX, wallY] to [chamber.x + chamber.w, wallY]
                let choiceX = wallX + Math.floor(Math.random() * (chamber.x + chamber.w - wallX));
                removedWalls.push(
                  {
                    endpoint: [choiceX, wallY],
                    type: 'H'
                  }
                );
            }

            return {
                stepType: 'removedWalls',
                removedWalls,
            }
        }
        else {
          if (chambers.length === 0) {
            return {
                stepType: 'mazeGenerated',
            };
          }
          else {
              let chamber_group = chambers[chambers.length - 1];
              let chamber = chamber_group[chamber_group.length - 1];
              if (chamber.w === 1 || chamber.h === 1) {
                return {
                  stepType: 'skippedChamber'
                };
              }
              return {
                  stepType: 'placedWalls',
                  x: chamber.x + 1 + Math.floor(Math.random() * (chamber.w - 1)),
                  y: chamber.y + 1 + Math.floor(Math.random() * (chamber.h - 1)),
              };
          }
        }
    }
    default: {
      return null;
    }
  }
}

function RecursiveDivisionVisualization() {
  let [history, setHistory] = useState([]);
  let [currentStepIndex, setCurrentStepIndex] = useState(null);
  let [playing, setPlaying] = useState(false);

  function onNew() {
    setPlaying(false);
    setHistory([{
      stepType: 'initialGrid',
    }]);
    setCurrentStepIndex(0);
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
    case 'placedWalls': {
      description = 'We place walls.';
      break;
    }
    case 'removedWalls': {
      description = "We remove 3 walls.";
      break;
    }
    case 'skippedChamber': {
      description = "We skip this chamber.";
      break;
    }
    case 'mazeGenerated': {
      description = 'We have generated the maze.';
      break;
    }
  }

  let wallMeetingPoints = [];
  let horizontalWalls = [];
  let verticalWalls = [];
  let squares = [];

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

  if (currentStepIndex > 0) {
    let chambers = [[{x: 0, y: 0, w: 10, h: 10}]];
    let currentChamber;

    for(let i = 1; i <= currentStepIndex && history[i].stepType != 'mazeGenerated'; i++) {
      let step = history[i];
      if (step.stepType === 'placedWalls') { //Place walls
          let chamber_group = chambers[chambers.length - 1];
          let chamber = chamber_group[chamber_group.length - 1];
          currentChamber = chamber;
          let {x, y} = step;
          
          for (let j = chamber.x; j < chamber.x + chamber.w; j++) {
            horizontalWalls[y][j] = 'bg-black';
          }
          for (let i = chamber.y; i < chamber.y + chamber.h; i++) {
            verticalWalls[i][x] = 'bg-black';
          }

          chambers.push([
              {x: x, y: y, w: chamber.x + chamber.w - x, h: chamber.y + chamber.h - y},
              {x: chamber.x, y: y, w: x - chamber.x, h: chamber.y + chamber.h - y},
              {x: x, y: chamber.y, w: chamber.x + chamber.w - x, h: y - chamber.y},
              {x: chamber.x, y: chamber.y, w: x - chamber.x, h: y - chamber.y},
          ]);
      }
      else if (step.stepType === 'removedWalls') {
        step.removedWalls.forEach(wall => {
          if (wall.type === 'V') {
            verticalWalls[wall.endpoint[1]][wall.endpoint[0]] = 'bg-white';
          }
          else {
            horizontalWalls[wall.endpoint[1]][wall.endpoint[0]] = 'bg-white';
          }
        });
      }
      else {
        let chamber_group = chambers[chambers.length - 1];
        currentChamber = chamber_group[chamber_group.length - 1];
        while(true) {
          let chamber_group = chambers[chambers.length - 1];
          if (chamber_group.length === 1) {
            chambers.pop();
            if (chambers.length === 0) {
              break;
            }
          }
          else {
            chamber_group.pop();
            break;
          }
        }
      }
    }
    
    if (history[currentStepIndex].stepType !== 'mazeGenerated') {
      for (let i = currentChamber.y; i < currentChamber.y + currentChamber.h; i++) {
        for (let j = currentChamber.x; j < currentChamber.x + currentChamber.w; j++) {
          squares[i][j] = 'bg-red-200';
        }
      }
    }

    for (let i = 0; i < 10; i++) {
      for (let j = 1; j < 10; j++) {
        if (verticalWalls[i][j] !== 'bg-black' && (squares[i][j-1] === 'bg-red-200' || squares[i][j] === 'bg-red-200')) {
          verticalWalls[i][j] = 'bg-red-200';
        }
      }
    }
    for (let i = 1; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (horizontalWalls[i][j] !== 'bg-black' && (squares[i-1][j] === 'bg-red-200' || squares[i][j] === 'bg-red-200')) {
          horizontalWalls[i][j] = 'bg-red-200';
        }
      }
    }

    for (let i = 1; i < 10; i++) {
      for (let j = 1; j < 10; j++) {
        let adjacentBlackWallsCount = 0;
        if (verticalWalls[i][j] === 'bg-black') {
          adjacentBlackWallsCount++;
        }
        if (verticalWalls[i-1][j] === 'bg-black') {
          adjacentBlackWallsCount++;
        }
        if (horizontalWalls[i][j] === 'bg-black') {
          adjacentBlackWallsCount++;
        }
        if (horizontalWalls[i][j-1] === 'bg-black') {
          adjacentBlackWallsCount++;
        }

        let adjacentRedWallsCount = 0;
        if (verticalWalls[i][j] === 'bg-red-200') {
          adjacentRedWallsCount++;
        }
        if (verticalWalls[i-1][j] === 'bg-red-200') {
          adjacentRedWallsCount++;
        }
        if (horizontalWalls[i][j] === 'bg-red-200') {
          adjacentRedWallsCount++;
        }
        if (horizontalWalls[i][j-1] === 'bg-red-200') {
          adjacentRedWallsCount++;
        }

        if (adjacentBlackWallsCount > 0) {
          wallMeetingPoints[i][j] = 'bg-black';
        }
        else if (adjacentRedWallsCount > 0) {
          wallMeetingPoints[i][j] = 'bg-red-200';
        }
      }
    }
  }

  return (
    <div className="flex flex-col w-min">
      <div className="flex justify-end mb-2">
        <button onClick={onNew} className="bg-sky-700 text-white px-2 py-1 rounded">Reset</button>
      </div>
      <Grid wallMeetingPoints={wallMeetingPoints} horizontalWalls={horizontalWalls} verticalWalls={verticalWalls} squares={squares} />
      <p>{description}</p>
      <VisualizationControls history={history} setHistory={setHistory} currentStepIndex={currentStepIndex} setCurrentStepIndex={setCurrentStepIndex} generateNextStep={generateRecursiveDivisionNextStep} playing={playing} setPlaying={setPlaying} hidePrev={currentStep.stepType === 'initialGrid'} hideNext={currentStep.stepType === 'mazeGenerated'}/>
    </div>
  );
}

function RecursiveDivision() {
  return (
    <div className="p-5 min-w-min max-w-lg mx-auto">
      <Link to="/" className="underline">Home</Link>
      <h1 className="font-bold text-lg">Recursive Division</h1>
      <p className="mb-5">
        We start with a grid of squares with walls on the boundary.
      </p>
      <p className="mb-5">
        We divide the grid into 4 parts with a horizontal and vertical line.
        We place walls along the line. For the 4 line segments we get, we choose 3 randomly and remove a wall from each.
      </p>
      <p className="mb-5">
        We recursively repeat this process on each of the 4 subgrids created, provided they have a height and width greater than 1.
      </p>
      <div className="flex justify-center">
        <RecursiveDivisionVisualization />
      </div>
    </div>
  );
}

export default RecursiveDivision;