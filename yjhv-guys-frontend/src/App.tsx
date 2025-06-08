import './App.css';
import { Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import UploadForm from './components/UploadForm';
import ResultPage from './components/ResultPage';
import NoMatch from './components/NoMatch';

const App = () => {
  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="*" element={<NoMatch />} />
      </Routes> 
    </MantineProvider>
  );
};

export default App;