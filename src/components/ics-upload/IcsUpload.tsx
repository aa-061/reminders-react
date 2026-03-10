import "./IcsUpload.css";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, Upload, Check, AlertCircle, RefreshCw } from "lucide-react";
import { importIcsFile } from "@/api/import";

export default function IcsUpload() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const importMutation = useMutation({
    mutationFn: importIcsFile,
    onSuccess: (data) => {
      setSuccessMessage(`Reminder "${data.title}" created successfully!`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Invalidate reminders query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".ics")) {
      importMutation.reset();
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setSuccessMessage(null);
    importMutation.reset();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="IcsUpload">
      <div className="IcsUpload__header">
        <div className="IcsUpload__icon">
          <CalendarPlus size={24} />
        </div>
        <div className="IcsUpload__content">
          <h3>Import Calendar Event</h3>
          <p>
            Upload an .ics file to create a reminder from a calendar event.
            The event will be converted to a reminder with your default notification settings.
          </p>
        </div>
      </div>

      <div
        className={`IcsUpload__dropzone ${dragActive ? "IcsUpload__dropzone--active" : ""} ${selectedFile ? "IcsUpload__dropzone--has-file" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".ics"
          onChange={handleInputChange}
          className="IcsUpload__input"
        />

        {selectedFile ? (
          <div className="IcsUpload__file-info">
            <CalendarPlus size={20} />
            <span>{selectedFile.name}</span>
          </div>
        ) : (
          <>
            <Upload size={24} className="IcsUpload__dropzone-icon" />
            <p className="IcsUpload__dropzone-text">
              Drag and drop an .ics file here, or click to browse
            </p>
          </>
        )}
      </div>

      {importMutation.isError && (
        <div className="IcsUpload__error">
          <AlertCircle size={16} />
          <span>{importMutation.error.message}</span>
        </div>
      )}

      {successMessage && (
        <div className="IcsUpload__success">
          <Check size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="IcsUpload__actions">
        <button
          className="btn"
          onClick={handleUpload}
          disabled={!selectedFile || importMutation.isPending}
        >
          {importMutation.isPending ? (
            <>
              <RefreshCw size={18} className="spinner" />
              Importing...
            </>
          ) : (
            <>
              <Upload size={18} />
              Import Event
            </>
          )}
        </button>
      </div>
    </div>
  );
}
