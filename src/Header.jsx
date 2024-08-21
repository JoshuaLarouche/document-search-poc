import React from "react";
import { Button, Layout } from "antd";
import logo from './assets/BCID_H_rgb_pos.png';

const { Header: AntHeader } = Layout;

const Header = ({ title, buttonText, buttonAction }) => {
  return (
    <AntHeader
      style={{
        backgroundColor: 'navy',
        color: 'white',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative', // Ensure positioning is relative
        height: 'auto', // Adjust height to fit content
        borderBottom: '2px solid orange', // Adds the orange line at the bottom
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px', // Adds space between logo and title
        height: '100%', // Ensures the container takes up full height
      }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '150px', // Adjust width as needed
            height: 'auto',
            marginTop: '10px', // Adjust margin to center vertically
          }}
        />
        <h1
          style={{
            color: 'white',
            margin: 0,
            fontSize: '2vw', // Responsive font size
          }}
        >
          {title}
        </h1>
      </div>
      <Button
        type="primary"
        style={{
          backgroundColor: 'orange',
          borderColor: 'orange',
        }}
        onClick={buttonAction}
      >
        {buttonText}
      </Button>
    </AntHeader>
  );
};

export default Header;
