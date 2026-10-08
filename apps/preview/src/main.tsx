import { StrictMode } from 'react';
import {createRoot} from 'react-dom/client';
import '@samarinara/polli-ui/styles.css';
import './preview.css';
import {App} from './App';
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
