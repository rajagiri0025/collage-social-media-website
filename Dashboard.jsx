import { useNavigate } from 'react-router-dom';
import Feed from './Feed';
import FloatingActionButton from './FloatingActionButton';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-wrapper">
            <Feed />
            <FloatingActionButton />
        </div>
    );
};

export default Dashboard;
