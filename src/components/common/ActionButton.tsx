import React from 'react';

interface ActionButtonProps {
    label: string;
    loading?: boolean; // Optional loading prop
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, loading }) => {
    return (
        <button type="submit" className="submit" disabled={loading}>
            {loading ? (
                <div className="spinner"></div>
            ) : (
                label
            )}
        </button>
    );
};

export default ActionButton;
