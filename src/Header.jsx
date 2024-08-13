import React from "react";
import { Button, Layout } from "antd";
import logo from './assets/BCID_H_rgb_pos.png';

const { Header: AntHeader } = Layout;

const Header = ({ title, buttonText, buttonAction }) => {
  return (
    <AntHeader style={{ backgroundColor: 'navy', color: 'white', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: 200, height: 'auto', marginRight: 20 }} />
        <h1 style={{ color: 'white', margin: 0 }}>{title}</h1>
      </div>
      <Button type="primary" style={{ backgroundColor: 'orange', borderColor: 'orange' }} onClick={buttonAction}>
        {buttonText}
      </Button>
    </AntHeader>
  );
};

export default Header;
