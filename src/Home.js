import { Link } from 'react-router-dom';
import simpleRandom from './mazePictures/SimpleRandom.JPG';
import randomDFS from './mazePictures/RandomDFS.JPG';
import automata from './mazePictures/Automata.JPG';
import recursiveDivision from './mazePictures/RecursiveDivision.JPG';

function Home() {
    return (
        <div className="p-5 min-w-min max-w-lg mx-auto">
            <h1 className="font-bold text-lg">Maze Generation Algorithms</h1>
            <div className="grid grid-cols-2 gap-2">
                <Link to="/visualizations/simple-random" className="underline text-center w-fit">
                    <img src={simpleRandom} alt="Simple Random" width="150" height="150"/>
                    Simple Random
                </Link>
                <Link to="/visualizations/random-dfs" className="underline text-center w-fit">
                    <img src={randomDFS} alt="Random DFS" width="150" height="150"/>
                    Random DFS
                </Link>
                <Link to="/visualizations/automata" className="underline text-center w-fit">
                    <img src={automata} alt="Automata" width="150" height="150"/>
                    Automata
                </Link>
                <Link to="/visualizations/recursive-division" className="underline text-center w-fit">
                    <img src={recursiveDivision} alt="Recursive Division" width="150" height="150"/>
                    Recursive Division
                </Link>
            </div>
        </div>
    );
}

export default Home;