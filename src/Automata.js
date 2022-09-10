import { useState } from 'react';
import VisualizationControls from './VisualizationControls';
import { Link } from 'react-router-dom';

function Grid({ grid }) {
    let divs = [];
    for(let i = 0; i < 21; i++) {
        for(let j = 0; j < 21; j++) {
            if (grid[i][j]) {
                divs.push(<div key={21 * i + j} className={'bg-black'}></div>);
            }
            else {
                divs.push(<div key={21 * i + j} className={'bg-white'}></div>);
            }
        }
    }
  
    return (
        <div className="grid grid-cols-[repeat(21,_12px)] grid-rows-[repeat(21,_12px)] w-fit">
            {divs}
        </div>
    );
}

function automataForwardStep(grid) {
    let newGrid = [];
    for(let i = 0; i < 21; i++) {
        let row = [];
        for(let j = 0; j < 21; j++) {
            let neighbourCount = 0;
            for(let iDel = -1; iDel <= 1; iDel++) {
                for(let jDel = -1; jDel <= 1; jDel++) {
                    if (0 <= i + iDel && i + iDel < 21 
                    && 0 <= j + jDel && j + jDel < 21
                    && !(iDel === 0 && jDel === 0)
                    && grid[i + iDel][j + jDel]) {
                        neighbourCount++;
                    }
                }
            }

            if (grid[i][j]) {
                row.push(1 <= neighbourCount && neighbourCount <= 5);
            }
            else {
                row.push(neighbourCount === 3);
            }
        }
        newGrid.push(row);
    }
    return newGrid;
}

function generateAutomataNextStep(history) {
    let currentStep = history[history.length - 1];
    switch(currentStep.stepType) {
        case 'initialGrid': {
            let grid = [];
            for(let i = 0; i < 21; i++) {
                let row = [];
                for(let i = 0; i < 21; i++) {
                    row.push(Math.random() < 0.2);
                }
                grid.push(row);
            }
            return {
                stepType: 'randomStart',
                grid
            };
        }
        case 'randomStart': 
        case 'stepForward': {
            if (history.length >= 102) {
                return {
                    stepType: 'mazeGenerated',
                };
            }

            let grid = history[1].grid;
            for(let i = 2; i < history.length; i++) {
                grid = automataForwardStep(grid);
            }

            let newGrid = automataForwardStep(grid);

            let change = false;
            for (let i = 0; i < 21; i++) {
                for (let j = 0; j < 21; j++) {
                    if (newGrid[i][j] !== grid[i][j]) {
                        change = true;
                    }
                }
            }

            if (change) {
                return {
                    stepType: 'stepForward',
                };
            }
            else {
                return {
                    stepType: 'mazeGenerated',
                };
            }
        }
        default: {
            return null;
        }
    }
}

function AutomataVisualization() {
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
        )
    }

    let currentStep = history[currentStepIndex];

    let description = '';
    switch(currentStep.stepType) {
        case 'initialGrid': {
            description = 'We start with a empty grid.';
            break;
        }
        case 'randomStart': {
            description = 'We randomly generate walls.';
            break;
        }
        case 'stepForward': {
            description = 'We step forward.';
            break;
        }
        case 'mazeGenerated': {
            description = 'We flip the squares and get the final maze.';
            break;
        }
    }

    let grid = [];

    console.log(history);
    switch(currentStep.stepType) {
        case 'initialGrid': {
            for(let i = 0; i < 21; i++) {
                let row = [];
                for(let j = 0; j < 21; j++) {
                    row.push(false);
                }
                grid.push(row);
            }
            break;
        }
        case 'randomStart': {
            grid = currentStep.grid;
            break;
        }
        case 'stepForward': {
            grid = history[1].grid;
            for(let i = 2; i <= currentStepIndex; i++) {
                grid = automataForwardStep(grid);
            }
            break;
        }
        case 'mazeGenerated': {
            grid = history[1].grid;
            for(let i = 2; i < history.length - 1; i++) {
                grid = automataForwardStep(grid);
            }
            
            for(let i = 0; i < 21; i++) {
                for (let j = 0; j < 21; j++) {
                    grid[i][j] = !grid[i][j];
                }
            }
            break;
        }
    }

    return (
        <div className="flex flex-col w-min">
            <div className="flex justify-end mb-2">
                <button onClick={onNew} className="bg-sky-700 text-white px-2 py-1 rounded">Reset</button>
            </div>
            <Grid grid={grid} />
            <p>{description}</p>
            <VisualizationControls history={history} setHistory={setHistory} currentStepIndex={currentStepIndex} setCurrentStepIndex={setCurrentStepIndex} generateNextStep={generateAutomataNextStep} playing={playing} setPlaying={setPlaying} hidePrev={currentStep.stepType === 'initialGrid'} hideNext={currentStep.stepType === 'mazeGenerated'} />
        </div>
    );
}

function Automata() {
    return (
        <div className="p-5 min-w-min max-w-lg mx-auto">    
            <Link to="/" className="underline">Home</Link>
            <h1 className="font-bold text-lg">Automata</h1>
            <p className="mb-5">
                We start with a empty grid of squares.
            </p>
            <p className="mb-5">
                We fill each square with probability 0.2.
            </p>
            <p className="mb-5">
                Then at each step, we evolve the grid. If in a current step a square is empty and it has exactly three non-empty neighbours (horizontal, vertical and diagonal), we fill this square. If a square is filled and it has 0 or more than 5 neighbours we empty this square.
            </p>
            <p className="mb-5">
                We repeat this until the grid stops changing or we've performed 100 evolution steps.
            </p>
            <p className="mb-5">
                The filled squares then become the empty space, and the empty squares become the walls.
            </p>
            <div className="flex justify-center">
                <AutomataVisualization />
            </div>
        </div>
    );
}

export default Automata;