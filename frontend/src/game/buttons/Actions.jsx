//Actions.jsx

import "../styles/Actions.css";

const Actions = ({ handlePlayerAttack }) => {
  return (
    <div className="actions-container">
      <div className="action-btn-group">
        <button className="action-btn" onClick={handlePlayerAttack}></button>
        <span className="action-label">B</span>
      </div>
      <div className="action-btn-group">
        <button className="action-btn"></button>
        <span className="action-label">A</span>
      </div>
    </div>
  );
};

export default Actions;
