import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { UserButton, UserProfile } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import "./Dashboard.css"; // Make sure this exists and includes custom styling



const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;


console.log(pinataApiKey, pinataSecretApiKey);
const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  // New state to track active navigation item
  const [activeNavItem, setActiveNavItem] = useState("my-files");
  // State for storing favorites and deleted files
  const [favorites, setFavorites] = useState([]);
  const [trashedFiles, setTrashedFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);

  const navigate = useNavigate();

  // Initialize with mock data
  useEffect(() => {
    // Get user info from localStorage or sessio




    // Load folders from localStorage if available
    const savedFolders = JSON.parse(localStorage.getItem("folders")) || [
      { id: "1", name: "Documents", path: "/", created: "2025-03-10" },
      { id: "2", name: "Images", path: "/", created: "2025-03-12" },
    ];
    setFolders(savedFolders);

    // Load files from localStorage if available
    const savedFiles = JSON.parse(localStorage.getItem("files")) || [];
    setFiles(savedFiles);
    
    // Load favorites, trash and shared from localStorage if available
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
    
    const savedTrash = JSON.parse(localStorage.getItem("trash")) || [];
    setTrashedFiles(savedTrash);
    
    const savedShared = JSON.parse(localStorage.getItem("shared")) || [];
    setSharedFiles(savedShared);
    
    // Set recent files based on modification date
    updateRecentFiles(savedFiles);
  }, []);

  // Update recent files whenever files change
  useEffect(() => {
    updateRecentFiles(files);
  }, [files]);

  // Update recent files
  const updateRecentFiles = (filesList) => {
    const sorted = [...filesList].sort((a, b) => 
      new Date(b.modified) - new Date(a.modified)
    ).slice(0, 10); // Get 10 most recent files
    setRecentFiles(sorted);
  };

  // Save files and folders to localStorage when they change
  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("trash", JSON.stringify(trashedFiles));
    localStorage.setItem("shared", JSON.stringify(sharedFiles));
  }, [files, folders, favorites, trashedFiles, sharedFiles]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/home");
  };

  const handleFileChange = (event) => {
    setFileToUpload(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!fileToUpload) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);

    const pinataMetadata = JSON.stringify({
      name: fileToUpload.name,
      keyvalues: {
        path: currentPath
      }
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      console.log("File uploaded to IPFS:", ipfsHash);

      // Add the new file to the list
      const newFile = {
        id: Date.now().toString(),
        name: fileToUpload.name,
        type: fileToUpload.name.split(".").pop(),
        size: `${(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB`,
        modified: new Date().toISOString().split("T")[0],
        path: currentPath,
        hash: ipfsHash,
      };

      setFiles([...files, newFile]);
      setFileToUpload(null);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("IPFS upload error:", error);
      alert("Failed to upload file to IPFS");
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    // Create a new folder
    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      path: currentPath,
      created: new Date().toISOString().split("T")[0],
    };

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setIsCreateFolderModalOpen(false);
  };

  const handleViewFile = (file) => {
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${file.hash}`;
    window.open(ipfsUrl, "_blank");
  };

  const handleShareFile = () => {
    if (!selectedFile || !shareEmail.trim()) return;

    // Add file to shared files
    const sharedFile = {
      ...selectedFile,
      sharedWith: shareEmail,
      sharedDate: new Date().toISOString().split("T")[0]
    };
    
    setSharedFiles([...sharedFiles, sharedFile]);
    
    // In a real app, this would integrate with your blockchain contract to share access
    alert(`File ${selectedFile.name} shared with ${shareEmail}`);
    setShareEmail("");
    setSelectedFile(null);
    setIsShareModalOpen(false);
  };

  const handleDeleteFile = (file) => {
    if (activeNavItem === "trash") {
      // Permanently delete from trash
      const updatedTrash = trashedFiles.filter((f) => f.id !== file.id);
      setTrashedFiles(updatedTrash);
    } else {
      // Move to trash
      const updatedFiles = files.filter((f) => f.id !== file.id);
      setFiles(updatedFiles);
      
      // Remove from favorites if it's there
      const updatedFavorites = favorites.filter((f) => f.id !== file.id);
      setFavorites(updatedFavorites);
      
      // Add to trash
      setTrashedFiles([...trashedFiles, {...file, deletedDate: new Date().toISOString().split("T")[0]}]);
    }
  };

  const handleDeleteFolder = (folder) => {
    // Remove folder from list
    const updatedFolders = folders.filter((f) => f.id !== folder.id);
    setFolders(updatedFolders);
  };

  const openFolder = (folder) => {
    // Navigate to folder
    setCurrentPath(`${currentPath}${folder.name}/`);
  };

  const navigateUp = () => {
    if (currentPath === "/") return;

    // Remove the last folder from the path
    const newPath = currentPath.split("/").slice(0, -2).join("/") + "/";
    setCurrentPath(newPath);
  };

  // New functions for favorites
  const addToFavorites = (file) => {
    if (!favorites.some(f => f.id === file.id)) {
      setFavorites([...favorites, file]);
    }
  };
  
  const removeFromFavorites = (file) => {
    const updatedFavorites = favorites.filter(f => f.id !== file.id);
    setFavorites(updatedFavorites);
  };
  
  // Restore from trash
  const restoreFile = (file) => {
    // Remove from trash
    const updatedTrash = trashedFiles.filter(f => f.id !== file.id);
    setTrashedFiles(updatedTrash);
    
    // Add back to files
    setFiles([...files, file]);
  };

  // Navigation click handler
  const handleNavClick = (navItem) => {
    setActiveNavItem(navItem);
    
    // Reset path if navigating away from My Files
    if (navItem !== "my-files") {
      setCurrentPath("/");
    }
  };

  // Calculate total storage used
  const totalStorageUsed = files.reduce((total, file) => {
    const sizeInMB = parseFloat(file.size);
    return total + (isNaN(sizeInMB) ? 0 : sizeInMB);
  }, 0);

  // Determine which files to display based on active navigation item
  const getDisplayContent = () => {
    switch (activeNavItem) {
      case "my-files":
        return {
          files: files.filter(file => file.path === currentPath),
          folders: folders.filter(folder => folder.path === currentPath),
          showFolders: true
        };
      case "shared":
        return {
          files: sharedFiles,
          folders: [],
          showFolders: false
        };
      case "recent":
        return {
          files: recentFiles,
          folders: [],
          showFolders: false
        };
      case "favorites":
        return {
          files: favorites,
          folders: [],
          showFolders: false
        };
      case "trash":
        return {
          files: trashedFiles,
          folders: [],
          showFolders: false
        };
      default:
        return {
          files: [],
          folders: [],
          showFolders: false
        };
    }
  };

  const { files: displayFiles, folders: displayFolders, showFolders } = getDisplayContent();

  // Get action buttons based on context
  const getFileActions = (file) => {
    switch (activeNavItem) {
      case "trash":
        return (
          <>
            <button
              className="item-action view"
              onClick={() => handleViewFile(file)}
            >
              View
            </button>
            <button
              className="item-action restore"
              onClick={() => restoreFile(file)}
            >
              Restore
            </button>
            <button
              className="item-action delete"
              onClick={() => handleDeleteFile(file)}
            >
              Delete Permanently
            </button>
          </>
        );
      case "favorites":
        return (
          <>
            <button
              className="item-action view"
              onClick={() => handleViewFile(file)}
            >
              View
            </button>
            <button
              className="item-action share"
              onClick={() => {
                setSelectedFile(file);
                setIsShareModalOpen(true);
              }}
            >
              Share
            </button>
            <button
              className="item-action remove"
              onClick={() => removeFromFavorites(file)}
            >
              Remove Favorite
            </button>
          </>
        );
      default:
        return (
          <>
            <button
              className="item-action view"
              onClick={() => handleViewFile(file)}
            >
              View
            </button>
            <button
              className="item-action share"
              onClick={() => {
                setSelectedFile(file);
                setIsShareModalOpen(true);
              }}
            >
              Share
            </button>
            <button
              className="item-action favorite"
              onClick={() => addToFavorites(file)}
              disabled={favorites.some(f => f.id === file.id)}
            >
              {favorites.some(f => f.id === file.id) ? "Favorited" : "Favorite"}
            </button>
            <button
              className="item-action delete"
              onClick={() => handleDeleteFile(file)}
            >
              Delete
            </button>
          </>
        );
    }
  };

  return (
    
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">BlockSafe</div>
          <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {username}!</h2>
        <UserButton afterSignOutUrl="/" />
        {/* <SignOutButton>
          <button className="btn btn-outline-danger">Sign Out</button>
        </SignOutButton> */}
      </div>
      </header>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="storage-info">
            <h3>Storage</h3>
            <div className="storage-bar">
              <div
                className="storage-used"
                style={{ width: `${Math.min((totalStorageUsed / 15) * 100, 100)}%` }}
              ></div>
            </div>
            <p>{totalStorageUsed.toFixed(2)} MB / 15 GB used</p>
          </div>

          <nav className="sidebar-nav">
            <ul>
              <li 
                className={activeNavItem === "my-files" ? "active" : ""} 
                onClick={() => handleNavClick("my-files")}
              >
                My Files
              </li>
              <li 
                className={activeNavItem === "shared" ? "active" : ""} 
                onClick={() => handleNavClick("shared")}
              >
                Shared with Me
              </li>
              <li 
                className={activeNavItem === "recent" ? "active" : ""} 
                onClick={() => handleNavClick("recent")}
              >
                Recent
              </li>
              <li 
                className={activeNavItem === "favorites" ? "active" : ""} 
                onClick={() => handleNavClick("favorites")}
              >
                Favorites
              </li>
              <li 
                className={activeNavItem === "trash" ? "active" : ""} 
                onClick={() => handleNavClick("trash")}
              >
                Trash
              </li>
            </ul>
          </nav>
        </div>

        <main className="content-area">
          <div className="actions-bar">
            <div className="path-navigation">
              {activeNavItem === "my-files" && (
                <button
                  className="nav-btn"
                  onClick={navigateUp}
                  disabled={currentPath === "/"}
                >
                  &#8593; Up
                </button>
              )}
              <span className="current-path">
                {activeNavItem === "my-files" ? currentPath : `/${activeNavItem.replace("-", " ")}`}
              </span>
            </div>
            <div className="action-buttons">
              {activeNavItem === "my-files" && (
                <>
                  <button
                    className="action-btn upload"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    Upload File
                  </button>
                  <button
                    className="action-btn create-folder"
                    onClick={() => setIsCreateFolderModalOpen(true)}
                  >
                    Create Folder
                  </button>
                </>
              )}
              {activeNavItem === "trash" && (
                <button
                  className="action-btn empty-trash"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to permanently delete all items in the trash?")) {
                      setTrashedFiles([]);
                    }
                  }}
                  disabled={trashedFiles.length === 0}
                >
                  Empty Trash
                </button>
              )}
            </div>
          </div>
          {/* File Upload Section */}
        <div style={{ marginTop: "30px" }}>
          <FileUpload />
        </div>

        {/* File List Section */}
        <div style={{ marginTop: "40px" }}>
          <FileList />
        </div>

          <div className="files-container">
            {showFolders && (
              <>
                <h2>Folders</h2>
                {displayFolders.length > 0 ? (
                  <div className="folders-grid">
                    {displayFolders.map((folder) => (
                      <div className="folder-item" key={folder.id}>
                        <div
                          className="folder-icon"
                          onClick={() => openFolder(folder)}
                        >
                          📁
                        </div>
                        <div className="folder-name">{folder.name}</div>
                        <div className="folder-actions">
                          <button
                            className="item-action delete"
                            onClick={() => handleDeleteFolder(folder)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-items">No folders found</p>
                )}
              </>
            )}

            <h2>
              {activeNavItem === "my-files" 
                ? "Files" 
                : activeNavItem === "shared" 
                  ? "Files Shared With Me" 
                  : activeNavItem === "recent" 
                    ? "Recent Files" 
                    : activeNavItem === "favorites" 
                      ? "Favorite Files" 
                      : "Deleted Files"}
            </h2>
            {displayFiles.length > 0 ? (
              <div className="files-table-container">
                <table className="files-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Modified</th>
                      {activeNavItem === "shared" && <th>Shared By</th>}
                      {activeNavItem === "trash" && <th>Deleted Date</th>}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayFiles.map((file) => (
                      <tr key={file.id}>
                        <td className="file-name">
                          <span className="file-icon">
                            {file.type === "pdf" && "📄"}
                            {file.type === "jpg" && "🖼️"}
                            {file.type === "png" && "🖼️"}
                            {file.type === "sol" && "📝"}
                            {!["pdf", "jpg", "png", "sol"].includes(
                              file.type
                            ) && "📄"}
                          </span>
                          {file.name}
                        </td>
                        <td>{file.size}</td>
                        <td>{file.modified}</td>
                        {activeNavItem === "shared" && <td>{file.sharedWith || "Unknown"}</td>}
                        {activeNavItem === "trash" && <td>{file.deletedDate || "Unknown"}</td>}
                        <td className="file-actions">
                          {getFileActions(file)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-items">No files found</p>
            )}
          </div>
        </main>
      </div>

      {/* Upload File Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Upload File to IPFS</h2>
            <div className="modal-content">
              <input type="file" onChange={handleFileChange} />
              {fileToUpload && (
                <div className="file-info">
                  <p>Name: {fileToUpload.name}</p>
                  <p>
                    Size: {(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn upload"
                onClick={handleFileUpload}
                disabled={!fileToUpload}
              >
                Upload to IPFS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {isCreateFolderModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Folder</h2>
            <div className="modal-content">
              <input
                type="text"
                placeholder="Folder Name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setIsCreateFolderModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn create"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share File Modal */}
      {isShareModalOpen && selectedFile && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Share File</h2>
            <div className="modal-content">
              <p>
                Sharing: <strong>{selectedFile.name}</strong>
              </p>
              <p>IPFS Hash: {selectedFile.hash}</p>
              <input
                type="email"
                placeholder="Enter recipient's email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setIsShareModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn share"
                onClick={handleShareFile}
                disabled={!shareEmail.trim()}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;























