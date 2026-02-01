import { useState } from 'react';
import Landing from './screens/Landing';
import Input from './screens/Input';

const SCREENS = {
  landing: 'landing',
  input: 'input',
};

function App() {
  const [screen, setScreen] = useState(SCREENS.landing);

  const handleStart = () => setScreen(SCREENS.input);
  const handleBack = () => setScreen(SCREENS.landing);

  return (
    <div className="app" style={{ maxWidth: 720, margin: '0 auto' }}>
      {screen === SCREENS.landing && <Landing onStart={handleStart} />}
      {screen === SCREENS.input && <Input onBack={handleBack} onSubmit={() => {}} />}
    </div>
  );
}

export default App;
