import React from "react";
import DrawIcon from "@mui/icons-material/Draw";
import { SightingStatus } from "@/lib/db/dbHelpers";

interface StatusIconProps {
    status?: string | boolean | undefined
  }
  
export const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
    if (!status) return null;

    switch (status) {
        case SightingStatus.DRAFT:
        return <DrawIcon fontSize="small" />;
        default:
        return null;
    }
};
  