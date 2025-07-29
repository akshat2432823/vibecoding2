import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GenCList from './pages/GenCList';
import MentorList from './pages/MentorList';
import AccountList from './pages/AccountList';
import AccountServiceLineList from './pages/AccountServiceLineList';
import GenCFeedbackList from './pages/GenCFeedbackList';
import ApplicationUserList from './pages/ApplicationUserList';
import SkillList from './pages/SkillList';
import SkillMatrix from './pages/SkillMatrix';
import RoleRequirements from './pages/RoleRequirements';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="gencs" element={<GenCList />} />
          <Route path="mentors" element={<MentorList />} />
          <Route path="accounts" element={<AccountList />} />
          <Route path="account-service-lines" element={<AccountServiceLineList />} />
          <Route path="feedbacks" element={<GenCFeedbackList />} />
          <Route path="skills" element={<SkillList />} />
          <Route path="skill-matrix" element={<SkillMatrix />} />
          <Route path="role-requirements" element={<RoleRequirements />} />
          <Route path="users" element={<ApplicationUserList />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App; 