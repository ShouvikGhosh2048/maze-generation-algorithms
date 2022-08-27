import { Routes, Route } from 'react-router-dom';
import SimpleRandom from './SimpleRandom';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/visualizations/simple-random" element={<SimpleRandom />} />
      </Routes>
    </div>
  );
}

export default App;
