import React from 'react';
import Spinner from './Spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface ActionButtonProps {
    label: string;
    loading?: boolean; // Optional loading prop
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, loading }) => {
    return (
        <div className="content-center gap-4">
                <button type="submit" disabled={loading}><h4>{label}</h4></button>
                <NavigateNextIcon></NavigateNextIcon>
		</div>
    );
};

export default ActionButton;
