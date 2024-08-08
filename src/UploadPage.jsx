import React, { useEffect, useRef, useState } from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "./UploadPage.css";
import logo from "./assets/BCID_H_rgb_pos.png";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Import the spinner component
import { Form, Input, Button } from "antd"; // Import Ant Design components

const UploadPage = () => {
  const uppyRef = useRef(null);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [metadataFields, setMetadataFields] = useState({
    hyperlink: "",
    additionalField: "",
  });

  useEffect(() => {
    if (uppyRef.current) {
      return;
    }

    const uppy = new Uppy({
      id: "uppy",
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
      },
    })
      .use(Dashboard, {
        inline: true,
        target: "#uppy-dashboard",
        showProgressDetails: true,
        height: 400,
        hideUploadButton: true,
      })
      .use(XHRUpload, {
        method: "PUT",
        endpoint: "http://localhost:5173/tika/tika", // This needs to match your backend endpoint
        fieldName: "file",
        headers: (file) => ({
          "Content-Type": file.type,
          Accept: "application/json",
        }),
      });

    uppy.on("upload", () => {
      console.log("Upload started");
      setLoading(true); // Show loading when upload starts
    });

    uppy.on("upload-success", (file, response) => {
      console.log("Upload successful:", response);
      handleUploadSuccess(file, response);
    });

    uppy.on("upload-error", (file, error) => {
      console.error("Upload error:", error);
      setLoading(false);
    });

    uppyRef.current = uppy;

    return () => {
      uppy.close;
    };
  }, []);

  const handleUploadSuccess = async (file, response) => {
    try {
      const fileData = file.data || response.body || response;
      console.log("File data to be sent:", fileData);

      const metaResponse = await axios.put(
        "http://localhost:5173/tika/tika",
        fileData,
        {
          headers: {
            "Content-Type": file.type,
            Accept: "application/json",
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            console.log(`Meta upload progress: ${progress}%`);
          },
        }
      );
      console.log("Meta response:", metaResponse);

      const metadata = metaResponse.data;
      console.log("Metadata:", metadata);

      const cleanedContentResponse = await axios.put(
        "http://localhost:5173/tika/tika",
        fileData,
        {
          headers: {
            "Content-Type": file.type,
            Accept: "text/plain",
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            console.log(`Content upload progress: ${progress}%`);
          },
        }
      );
      console.log("Cleaned content response:", cleanedContentResponse);

      const cleanedContent = cleanedContentResponse.data;
      console.log("Cleaned content:", cleanedContent);

      const combinedData = {
        ...metadata,
        "X-TIKA:content": cleanedContent,
        id: uuidv4(),
        hyperlink: file.meta.hyperlink || metadataFields.hyperlink,
        additionalField:
          file.meta.additionalField || metadataFields.additionalField,
      };

      console.log("Combined data to be sent to Meilisearch:", combinedData);
      console.log("metadataFields:", metadataFields);

      await axios.post(
        "https://meilisearch-test.apps.silver.devops.gov.bc.ca/indexes/uppy/documents",
        combinedData
      );

      alert("Document uploaded and indexed successfully!");
    } catch (error) {
      console.error("Error handling upload response:", error);
      alert("There was an error uploading or indexing the document.");
    } finally {
      setLoading(false); // Hide loading when upload completes or fails
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted, starting upload");
    let file = uppyRef.current.getFiles()[0];
    if (file) {
      uppyRef.current.setFileMeta(file.id, {
        hyperlink: metadataFields.hyperlink,
        additionalField: metadataFields.additionalField,
      });
    }
    console.log("file:", file);
    uppyRef.current.upload();
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadataFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <img src={logo} alt="Logo" className="upload-header-logo" />
        <h1>Document Upload</h1>
        <button
          onClick={() => (window.location.href = "/")}
          className="upload-upload-button"
        >
          Back to Search
        </button>
      </div>
      <Form onSubmitCapture={handleSubmit} layout="vertical">
        <Form.Item label="Hyperlink to Original File" required>
          <Input
            type="text"
            name="hyperlink"
            value={metadataFields.hyperlink}
            onChange={handleMetadataChange}
          />
        </Form.Item>
        <Form.Item label="Additional Metadata">
          <Input
            type="text"
            name="additionalField"
            value={metadataFields.additionalField}
            onChange={handleMetadataChange}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Upload File
          </Button>
        </Form.Item>
      </Form>
      <div id="uppy-dashboard"></div>
      {loading && (
        <div className="loading-indicator">
          <ClipLoader color="#123abc" loading={loading} size={50} />
          <p>Uploading and processing file...</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
