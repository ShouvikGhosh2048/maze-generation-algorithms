import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import SimpleRandom from './SimpleRandom';
import RandomDFS from './RandomDFS';

function App() {
  return (
    <div>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/visualizations/simple-random" element={<SimpleRandom />} />
        <Route path="/visualizations/random-dfs" element={<RandomDFS />} />
      </Routes>
    </div>
  );
}

export default App;
