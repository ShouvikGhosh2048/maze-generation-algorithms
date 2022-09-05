import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <Link to="/visualizations/simple-random">Simple Random</Link>
            <Link to="/visualizations/random-dfs">Random DFS</Link>
        </div>
    );
}

export default Home;