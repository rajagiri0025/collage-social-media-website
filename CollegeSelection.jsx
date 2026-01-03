import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CollegeSelection.css';

const colleges = [
    { name: "St. Stephen's College, Delhi", id: 1 },
    { name: "Hindu College, Delhi", id: 2 },
    { name: "Miranda House, Delhi", id: 3 },
    { name: "Shri Ram College of Commerce (SRCC), Delhi", id: 4 },
    { name: "Lady Shri Ram College for Women (LSR), Delhi", id: 5 },
    { name: "Indian Institute of Technology Delhi (IIT Delhi)", id: 6 },
    { name: "Delhi Technological University (DTU), Delhi", id: 7 },
    { name: "Netaji Subhas University of Technology (NSUT), Delhi", id: 8 },
    { name: "Indraprastha Institute of Information Technology Delhi (IIIT-D)", id: 9 },
    { name: "Jaypee Institute of Information Technology (JIIT), Noida", id: 10 },
    { name: "Amity University, Noida", id: 11 },
    { name: "Sharda University, Greater Noida", id: 12 },
    { name: "Ashoka University, Sonipat (NCR)", id: 13 },
    { name: "O.P. Jindal Global University, Sonipat (NCR)", id: 14 },
];

const CollegeSelection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredColleges, setFilteredColleges] = useState(colleges);
    const [backgroundImage, setBackgroundImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Set background based on time of day
        const hour = new Date().getHours();
        let bgClass = 'bg-day';

        if (hour >= 6 && hour < 17) {
            bgClass = 'bg-day';
        } else if (hour >= 17 && hour < 20) {
            bgClass = 'bg-evening';
        } else {
            bgClass = 'bg-night';
        }

        setBackgroundImage(bgClass);
    }, []);

    useEffect(() => {
        const filtered = colleges.filter(college =>
            college.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredColleges(filtered);
    }, [searchQuery]);

    const handleCollegeSelect = (college) => {
        localStorage.setItem('selectedCollege', college.name);
        navigate('/login');
    };

    return (
        <div className={`college-selection ${backgroundImage}`}>
            <div className="college-container">
                <h1 className="college-title">Select Your College</h1>
                <p className="college-subtitle">Join your campus community</p>

                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search your college..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="college-grid">
                    {filteredColleges.map((college) => (
                        <div
                            key={college.id}
                            className="college-card"
                            onClick={() => handleCollegeSelect(college)}
                        >
                            <div className="college-icon">🎓</div>
                            <div className="college-name">{college.name}</div>
                        </div>
                    ))}
                </div>

                {filteredColleges.length === 0 && (
                    <div className="no-results">
                        <p>No colleges found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollegeSelection;
