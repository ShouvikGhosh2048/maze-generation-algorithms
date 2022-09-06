import {useState, useEffect} from 'react';
import VisualizationControls from './VisualizationControls';
import { Link } from 'react-router-dom';

function WalledGrid({ wallMeetingPoints, horizontalWalls, verticalWalls, squares }) {
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
        <div className="grid grid-cols-[repeat(21,_12px)] grid-rows-[repeat(21,_12px)] w-fit">
            {divs}
        </div>
    );
}

function generateRandomDFSNextStep(history) {
    let currentStep = history[history.length - 1];
    switch(currentStep.stepType) {
        case 'initialGrid': {
            let start = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
            return {
                stepType: 'choseStart',
                start
            };
        }
        case 'choseStart': {
            let nextSquares = [];
            let start = currentStep.start;
            if (0 <= start[0] - 1) {
                nextSquares.push([start[0] - 1, start[1]]);
            }
            if (start[0] + 1 <= 9) {
                nextSquares.push([start[0] + 1, start[1]]);
            }
            if (0 < start[1] - 1) {
                nextSquares.push([start[0], start[1] - 1]);
            }
            if (start[1] + 1 <= 9) {
                nextSquares.push([start[0], start[1] + 1]);
            }
            let nextSquare = nextSquares[Math.floor(Math.random() * nextSquares.length)];
            return {
                stepType: 'expand',
                nextSquare,
            }
        }
        case 'expand': {
            let visited = [];
            for(let i = 0; i < 10; i++) {
                let row = [];
                for(let j = 0; j < 10; j++) {
                    row.push(false);
                }
                visited.push(row);
            }
            visited[history[1].start[0]][history[1].start[1]] = true;
            for(let i = 2; i < history.length; i++) {
                if (history[i].stepType === 'expand') {
                    visited[history[i].nextSquare[0]][history[i].nextSquare[1]] = true;
                }
            }

            let nextSquares = [];
            let currentSquare = currentStep.nextSquare;
            if (0 <= currentSquare[0] - 1 && !visited[currentSquare[0] - 1][currentSquare[1]]) {
                nextSquares.push([currentSquare[0] - 1, currentSquare[1]]);
            }
            if (currentSquare[0] + 1 <= 9 && !visited[currentSquare[0] + 1][currentSquare[1]]) {
                nextSquares.push([currentSquare[0] + 1, currentSquare[1]]);
            }
            if (0 <= currentSquare[1] - 1 && !visited[currentSquare[0]][currentSquare[1] - 1]) {
                nextSquares.push([currentSquare[0], currentSquare[1] - 1]);
            }
            if (currentSquare[1] + 1 <= 9 && !visited[currentSquare[0]][currentSquare[1] + 1]) {
                nextSquares.push([currentSquare[0], currentSquare[1] + 1]);
            }
            if (nextSquares.length === 0) {
                return {
                    stepType: 'backtrack'
                };
            }
            let nextSquare = nextSquares[Math.floor(Math.random() * nextSquares.length)];
            return {
                stepType: 'expand',
                nextSquare,
            };
        }
        case 'backtrack': {
            let visited = [];
            let currentPath = [];
            for(let i = 0; i < 10; i++) {
                let row = [];
                for(let j = 0; j < 10; j++) {
                    row.push(false);
                }
                visited.push(row);
            }
            visited[history[1].start[0]][history[1].start[1]] = true;
            currentPath.push(history[1].start);
            for(let i = 2; i < history.length; i++) {
                if (history[i].stepType === 'expand') {
                    visited[history[i].nextSquare[0]][history[i].nextSquare[1]] = true;
                    currentPath.push(history[i].nextSquare);
                }
                else if (history[i].stepType === 'backtrack') {
                    currentPath.pop();
                }
            }
            if (currentPath.length === 0) {
                return {
                    stepType: 'mazeGenerated'
                };
            }

            let nextSquares = [];
            let currentSquare = currentPath[currentPath.length - 1];
            if (0 <= currentSquare[0] - 1 && !visited[currentSquare[0] - 1][currentSquare[1]]) {
                nextSquares.push([currentSquare[0] - 1, currentSquare[1]]);
            }
            if (currentSquare[0] + 1 <= 9 && !visited[currentSquare[0] + 1][currentSquare[1]]) {
                nextSquares.push([currentSquare[0] + 1, currentSquare[1]]);
            }
            if (0 <= currentSquare[1] - 1 && !visited[currentSquare[0]][currentSquare[1] - 1]) {
                nextSquares.push([currentSquare[0], currentSquare[1] - 1]);
            }
            if (currentSquare[1] + 1 <= 9 && !visited[currentSquare[0]][currentSquare[1] + 1]) {
                nextSquares.push([currentSquare[0], currentSquare[1] + 1]);
            }
            if (nextSquares.length === 0) {
                return {
                    stepType: 'backtrack'
                };
            }
            let nextSquare = nextSquares[Math.floor(Math.random() * nextSquares.length)];
            return {
                stepType: 'expand',
                nextSquare,
            };
        }
        default: {
            return null;
        }
    }
}

function RandomDFSVisualization() {
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
                    let nextStep = generateRandomDFSNextStep(history);
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
            let nextStep = generateRandomDFSNextStep(history);
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
        )
    }

    let currentStep = history[currentStepIndex];

    let description = '';
    switch(currentStep.stepType) {
        case 'initialGrid': {
            description = 'We start with a initial grid.';
            break;
        }
        case 'choseStart': {
            description = 'We choose a random starting square.';
            break;
        }
        case 'expand': {
            description = 'We expand forward.';
            break;
        }
        case 'backtrack': {
            description = 'We backtrack.';
            break;
        }
        case 'mazeGenerated': {
            description = 'The maze is generated.';
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
            row.push('bg-black');
        }
        wallMeetingPoints.push(row);
    }
    for(let i = 0; i < 11; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
            row.push('bg-black');
        }
        horizontalWalls.push(row);
    }
    for(let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 11; j++) {
            row.push('bg-black');
        }
        verticalWalls.push(row);
    }
    for(let i = 0; i < 10; i++) {
        let row = [];
        for(let j = 0; j < 10; j++) {
            row.push('bg-black');
        }
        squares.push(row);
    }

    switch(currentStep.stepType) {
        case 'initialGrid': {
            break;
        }
        case 'choseStart': {
            squares[currentStep.start[0]][currentStep.start[1]] = 'bg-red-500';
            break;
        }
        case 'expand':
        case 'backtrack': 
        case 'mazeGenerated': {
            let currentSquare = history[1].start;
            let currentPath = [currentSquare];
            squares[currentSquare[0]][currentSquare[1]] = 'bg-red-500';
            for(let i = 2; i <= currentStepIndex; i++) {
                if (history[i].stepType === 'expand') {
                    let nextSquare = history[i].nextSquare;
                    if (nextSquare[0] === currentSquare[0] - 1) {
                        horizontalWalls[currentSquare[0]][currentSquare[1]] = 'bg-red-500';
                    }
                    else if (nextSquare[0] === currentSquare[0] + 1) {
                        horizontalWalls[currentSquare[0]+1][currentSquare[1]] = 'bg-red-500';
                    }
                    else if (nextSquare[1] === currentSquare[1] - 1) {
                        verticalWalls[currentSquare[0]][currentSquare[1]] = 'bg-red-500';
                    }
                    else if (nextSquare[1] === currentSquare[1] + 1) {
                        verticalWalls[currentSquare[0]][currentSquare[1]+1] = 'bg-red-500';
                    }
                    squares[nextSquare[0]][nextSquare[1]] = 'bg-red-500';
                    currentSquare = nextSquare;
                    currentPath.push(currentSquare);
                }
                else if (history[i].stepType === 'backtrack') {
                    currentPath.pop();
                    squares[currentSquare[0]][currentSquare[1]] = 'bg-white';
                    if (currentPath.length > 0) {
                        let nextSquare = currentPath[currentPath.length - 1];
                        if (nextSquare[0] === currentSquare[0] - 1) {
                            horizontalWalls[currentSquare[0]][currentSquare[1]] = 'bg-white';
                        }
                        else if (nextSquare[0] === currentSquare[0] + 1) {
                            horizontalWalls[currentSquare[0]+1][currentSquare[1]] = 'bg-white';
                        }
                        else if (nextSquare[1] === currentSquare[1] - 1) {
                            verticalWalls[currentSquare[0]][currentSquare[1]] = 'bg-white';
                        }
                        else if (nextSquare[1] === currentSquare[1] + 1) {
                            verticalWalls[currentSquare[0]][currentSquare[1]+1] = 'bg-white';
                        }
                        currentSquare = nextSquare;
                    }
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
            <WalledGrid wallMeetingPoints={wallMeetingPoints} horizontalWalls={horizontalWalls} verticalWalls={verticalWalls} squares={squares} />
            <p>{description}</p>
            <VisualizationControls onPrev={onPrev} onNext={onNext} onPlay={onPlay} onPause={onPause} playing={playing} hidePrev={currentStep.stepType === 'initialGrid'} hideNext={currentStep.stepType === 'mazeGenerated'} />
        </div>
    );
}

function RandomDFS() {
    return (
        <div className="p-5 min-w-min max-w-lg mx-auto">
            <Link to="/" className="underline">Home</Link>
        <h1 className="font-bold text-lg">Random DFS</h1>
        <p className="mb-5">
            Consider a grid of squares. Initially, the squares will be surrounded with walls.
        </p>
        <p className="mb-5">
            We pick a random starting point.
        </p>
        <p className="mb-5">
            We then randomly choose a neighbour of the square (horizontal and vertical directions). We then remove the wall between the two squares.
        </p>
        <p className="mb-5">
            We again consider the unvisited neighbours of this new square. We choose a random square among them and remove the wall between the two squares.
        </p>
        <p className="mb-5">
            We keep repeating this until we land up at a square with no unvisited neighbours. We then backtrack the path from this square to our original square, checking at each point if the current square has unvisited neighbours. When reach a square which has unvisited neighbours, we repeat our expand and backtrack procedure until all squares are visited.
        </p>
        <div className="flex justify-center">
            <RandomDFSVisualization />
        </div>
      </div>
    );
}

export default RandomDFS;