import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface MenuItemProps {
  route: string;
  item: string;
}

const NavItem: React.FC<MenuItemProps> = ({ route, item }) => {
  const location = useLocation();
  const isActive = route ? location.pathname === route : false;

  return (
        <Link 
          to={route} 
          className={`menu-item ${isActive ? 'selected': "inherit"}`}
          >
            {item}
        </Link> 
    );
};

export default NavItem;