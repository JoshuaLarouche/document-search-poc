import React, { useEffect, useRef } from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
// import '@uppy/core/dist/style.min.css';
// import '@uppy/dashboard/dist/style.min.css';
import "./UploadPage.css";
import logo from './assets/BCID_H_rgb_pos.png';

const UploadPage = () => {
  const uppyRef = useRef(null);

  useEffect(() => {
    const uppy =new Uppy({
      id: 'uppy',
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
      }
    }).use(Dashboard, {
      inline: true,
      target: '#uppy-dashboard',
      showProgressDetails: true,
      height: 400
    }).use(XHRUpload, {
      method: 'PUT',
      endpoint: 'https://tika-test.apps.silver.devops.gov.bc.ca/tika',
      fieldName: 'file', // This should match the field name in your form
      headers: {
        'Accept': 'text/plain'
      }
    });

    uppyRef.current = uppy;

    return () => uppy.close;
  }, []);

  return (
    <div className="upload-page">
      <div className="upload-header">
        <img src={logo} alt="Logo" className="upload-header-logo" />
        <h1>Document Upload</h1>
        <button onClick={() => window.location.href = "/"} className="upload-upload-button">Back to Search</button>
      </div>
      <div id="uppy-dashboard"></div>
    </div>
  );
};

export default UploadPage;