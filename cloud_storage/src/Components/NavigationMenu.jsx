import React from "react";

// Navigation Item Component
const NavItem = ({ label, active, onClick }) => {
  return (
    <li 
      className={active ? "active" : ""} 
      onClick={onClick}
    >
      {label}
    </li>
  );
};

// Navigation Menu Component
const NavigationMenu = ({ activeItem, onItemClick }) => {
  const navItems = [
    { id: "my-files", label: "My Files" },
    { id: "shared", label: "Shared with Me" },
    { id: "recent", label: "Recent" },
    { id: "favorites", label: "Favorites" },
    { id: "trash", label: "Trash" }
  ];

  return (
    <nav className="sidebar-nav">
      <ul>
        {navItems.map(item => (
          <NavItem 
            key={item.id}
            label={item.label}
            active={activeItem === item.id}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;