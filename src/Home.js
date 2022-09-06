import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="p-5">
            <h1 className="font-bold text-lg">Maze Generation Algorithms</h1>
            <ul>
                <li><Link to="/visualizations/simple-random" className="underline">Simple Random</Link></li>
                <li><Link to="/visualizations/random-dfs" className="underline">Random DFS</Link></li>
                <li><Link to="/visualizations/automata" className="underline">Automata</Link></li>
            </ul>
        </div>
    );
}

export default Home;