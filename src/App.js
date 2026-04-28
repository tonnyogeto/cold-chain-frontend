import Dashboard from './components/Dashboard';

function App() {
  return (
    // min-h-screen ensures the dark background covers the whole page
    // bg-slate-950 is that deep "almost black" navy
    <div className="min-h-screen bg-[#020617] text-slate-200 antialiased font-sans">
      <Dashboard />
    </div>
  );
}

export default App;