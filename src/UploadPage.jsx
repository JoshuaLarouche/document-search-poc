import React, { useEffect, useRef, useState } from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { Form, Input, Button, Layout, Select, notification, Typography } from "antd";

const { Content } = Layout;
const { Option } = Select;
const { Paragraph } = Typography;
const APP_URL = import.meta.env.VITE_APP_URL;
const TIKA_URL = import.meta.env.VITE_TIKA_URL; 
const MEILISEARCH_URL = import.meta.env.VITE_MEILISEARCH_URL; 

const UploadPage = () => {
  const uppyRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [metadataFields, setMetadataFields] = useState({
    hyperlink: "",
    additionalField: "",
    draftStatus: ""
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
        endpoint: `${APP_URL}/tika/tika`,
        fieldName: "file",
        headers: (file) => ({
          "Content-Type": file.type,
          Accept: "application/json",
        }),
      });

    uppy.on("upload", () => {
      setLoading(true);
    });

    uppy.on("upload-success", (file, response) => {
      handleUploadSuccess(file, response);
    });

    uppy.on("upload-error", (file, error) => {
      console.error("Upload error:", error);
      setLoading(false);
      notification.error({
        message: "Upload Failed",
        description: "There was an error uploading the document.",
      });
    });

    uppyRef.current = uppy;

    return () => {
      uppy.close;
    };
  }, []);

  const handleUploadSuccess = async (file, response) => {
    try {
      const fileData = file.data || response.body || response;

      const metaResponse = await axios.put(`${APP_URL}/tika/tika`, fileData, {
        headers: {
          "Content-Type": file.type,
          Accept: "application/json",
        },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          console.log(`Meta upload progress: ${progress}%`);
        },
      });

      const metadata = metaResponse.data;

      const cleanedContentResponse = await axios.put(
        `${APP_URL}/tika/tika`,
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

      const cleanedContent = cleanedContentResponse.data;

      const combinedData = {
        ...metadata,
        "X-TIKA:content": cleanedContent,
        id: uuidv4(),
        hyperlink: file.meta.hyperlink || metadataFields.hyperlink,
        additionalField:
          file.meta.additionalField || metadataFields.additionalField,
        draftStatus: file.meta.draftStatus || metadataFields.draftStatus
      };

      console.log("Combined data to be sent to Meilisearch:", combinedData);

      await axios.post(
        `${MEILISEARCH_URL}/indexes/uppy/documents`,
        combinedData
      );

      notification.success({
        message: "Upload Successful",
        description: "Document uploaded and indexed successfully!",
      });
    } catch (error) {
      console.error("Error handling upload response:", error);
      notification.error({
        message: "Upload Failed",
        description: "There was an error uploading or indexing the document.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = uppyRef.current.getFiles()[0];
    if (file) {
      uppyRef.current.setFileMeta(file.id, {
        hyperlink: metadataFields.hyperlink,
        additionalField: metadataFields.additionalField,
        draftStatus: metadataFields.draftStatus
      });
    }
    uppyRef.current.upload();
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadataFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleStatusChange = (value) => {
    setMetadataFields((prevFields) => ({
      ...prevFields,
      draftStatus: value
    }));
  };

  return (
    <Content style={{ padding: '20px' }}>
      <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #91d5ff' }}>
        <Paragraph style={{ margin: 0 }}>
          Please ensure that your file has not already been uploaded by searching for it in the system before proceeding with the upload.
        </Paragraph>
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
        <Form.Item label="Draft Status">
          <Select
            name="draftStatus"
            value={metadataFields.draftStatus}
            onChange={handleStatusChange}
            style={{ width: 200 }}
          >
            <Option value="draft">Draft</Option>
            <Option value="final">Final</Option>
          </Select>
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
    </Content>
  );
};

export default UploadPage;
