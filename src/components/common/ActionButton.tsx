import React from 'react';
import Spinner from './Spinner';

interface ActionButtonProps {
    label: string;
    loading?: boolean; // Optional loading prop
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, loading }) => {
    return (
        <button type="submit" className="submit" disabled={loading}>
            {loading ? (
                <Spinner/>
            ) : (
                label
            )}
        </button>
    );
};

export default ActionButton;
