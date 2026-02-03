import { useState } from 'react';
import Landing from './screens/Landing';
import Input from './screens/Input';
import Loading from './screens/Loading';
import Error from './screens/Error';
import Results from './screens/Results';
import { runAnalysis } from './api';

const SCREENS = {
  landing: 'landing',
  input: 'input',
  loading: 'loading',
  error: 'error',
  results: 'results',
};

function App() {
  const [screen, setScreen] = useState(SCREENS.landing);
  const [report, setReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStart = () => setScreen(SCREENS.input);
  const handleBack = () => setScreen(SCREENS.landing);
  const handleSubmit = async (formData) => {
    setScreen(SCREENS.loading);
    setErrorMessage('');
    try {
      const data = await runAnalysis(formData);
      if (data.report) {
        setReport(data.report);
        setScreen(SCREENS.results);
      } else {
        throw new Error('No report in response.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setScreen(SCREENS.error);
    }
  };
  const handleDismissError = () => setScreen(SCREENS.input);
  const handleNewAnalysis = () => {
    setReport(null);
    setErrorMessage('');
    setScreen(SCREENS.input);
  };

  return (
    <div className="app" style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
      {screen === SCREENS.landing && <Landing onStart={handleStart} />}
      {screen === SCREENS.input && <Input onBack={handleBack} onSubmit={handleSubmit} />}
      {screen === SCREENS.loading && <Loading />}
      {screen === SCREENS.error && <Error message={errorMessage} onDismiss={handleDismissError} />}
      {screen === SCREENS.results && report && (
        <Results report={report} onNewAnalysis={handleNewAnalysis} />
      )}
    </div>
  );
}

export default App;
