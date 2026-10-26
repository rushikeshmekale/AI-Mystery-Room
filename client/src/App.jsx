import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CasePage from './pages/CasePage.jsx';
import './app.css';
export default function App(){return <Routes><Route path="/" element={<HomePage/>}/><Route path="/case/:caseId" element={<CasePage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
