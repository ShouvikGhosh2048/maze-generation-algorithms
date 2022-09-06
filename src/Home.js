import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <Link to="/visualizations/simple-random">Simple Random</Link>
            <Link to="/visualizations/random-dfs">Random DFS</Link>
            <Link to="/visualizations/automata">Automata</Link>
        </div>
    );
}

export default Home;