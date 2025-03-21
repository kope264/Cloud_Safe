import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  
  const navigate = useNavigate();

  // Mock data - replace with actual API calls to your blockchain storage
  useEffect(() => {
    // Get user info from localStorage or session
    const user = JSON.parse(localStorage.getItem('user')) || { username: 'User' };
    setUsername(user.username);
    
    // Mock files data - replace with actual blockchain data fetch
    setFiles([
      { id: '1', name: 'document.pdf', type: 'pdf', size: '2.5 MB', modified: '2025-03-20', path: '/', hash: '0x1a2b3c...' },
      { id: '2', name: 'image.jpg', type: 'jpg', size: '1.8 MB', modified: '2025-03-18', path: '/', hash: '0x4d5e6f...' },
      { id: '3', name: 'contract.sol', type: 'sol', size: '0.5 MB', modified: '2025-03-15', path: '/', hash: '0x7g8h9i...' }
    ]);
    
    setFolders([
      { id: '1', name: 'Documents', path: '/', created: '2025-03-10' },
      { id: '2', name: 'Images', path: '/', created: '2025-03-12' }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFileUpload = () => {
    if (!fileToUpload) return;
    
    // Here you would integrate with IPFS and your blockchain contract
    // to upload and store the file
    console.log('Uploading file:', fileToUpload);
    
    // Mock implementation - add file to list
    const newFile = {
      id: Date.now().toString(),
      name: fileToUpload.name,
      type: fileToUpload.name.split('.').pop(),
      size: `${(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB`,
      modified: new Date().toISOString().split('T')[0],
      path: currentPath,
      hash: `0x${Math.random().toString(16).substring(2, 10)}...`
    };
    
    setFiles([...files, newFile]);
    setFileToUpload(null);
    setIsUploadModalOpen(false);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    // Here you would integrate with your blockchain contract to create a folder
    console.log('Creating folder:', newFolderName);
    
    // Mock implementation - add folder to list
    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      path: currentPath,
      created: new Date().toISOString().split('T')[0]
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setIsCreateFolderModalOpen(false);
  };

  const handleViewFile = (file) => {
    // Here you would fetch the file from IPFS using the hash stored in your blockchain
    console.log('Viewing file:', file);
    
    // Open file in new tab or preview component
    alert(`Viewing ${file.name} with hash ${file.hash}`);
  };

  const handleShareFile = () => {
    if (!selectedFile || !shareEmail.trim()) return;
    
    // Here you would integrate with your blockchain contract to share access
    console.log('Sharing file:', selectedFile, 'with:', shareEmail);
    
    // Mock implementation - show success message
    alert(`File ${selectedFile.name} shared with ${shareEmail}`);
    setShareEmail('');
    setSelectedFile(null);
    setIsShareModalOpen(false);
  };

  const handleDeleteFile = (file) => {
    // Here you would integrate with your blockchain contract to delete the file reference
    console.log('Deleting file:', file);
    
    // Mock implementation - remove file from list
    const updatedFiles = files.filter(f => f.id !== file.id);
    setFiles(updatedFiles);
  };

  const handleDeleteFolder = (folder) => {
    // Here you would integrate with your blockchain contract to delete the folder
    console.log('Deleting folder:', folder);
    
    // Mock implementation - remove folder from list
    const updatedFolders = folders.filter(f => f.id !== folder.id);
    setFolders(updatedFolders);
  };

  const openFolder = (folder) => {
    // Navigate to folder
    setCurrentPath(`${currentPath}${folder.name}/`);
    
    // In a real implementation, you would fetch files/folders for this path
    console.log('Opening folder:', folder);
  };

  const navigateUp = () => {
    if (currentPath === '/') return;
    
    // Remove the last folder from the path
    const newPath = currentPath.split('/').slice(0, -2).join('/') + '/';
    setCurrentPath(newPath);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">BlockStore</div>
        <div className="user-info">
          <span>Welcome, {username}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <div className="sidebar">
          <div className="storage-info">
            <h3>Storage</h3>
            <div className="storage-bar">
              <div className="storage-used" style={{width: '35%'}}></div>
            </div>
            <p>4.8 GB / 15 GB used</p>
          </div>
          
          <nav className="sidebar-nav">
            <ul>
              <li className="active">My Files</li>
              <li>Shared with Me</li>
              <li>Recent</li>
              <li>Favorites</li>
              <li>Trash</li>
             
            </ul>
          </nav>
        </div>
        
        <main className="content-area">
          <div className="actions-bar">
            <div className="path-navigation">
              <button className="nav-btn" onClick={navigateUp} disabled={currentPath === '/'}>
                &#8593; Up
              </button>
              <span className="current-path">{currentPath}</span>
            </div>
            <div className="action-buttons">
              <button className="action-btn upload" onClick={() => setIsUploadModalOpen(true)}>
                Upload File
              </button>
              <button className="action-btn create-folder" onClick={() => setIsCreateFolderModalOpen(true)}>
                Create Folder
              </button>
            </div>
          </div>
          
          <div className="files-container">
            <h2>Folders</h2>
            {folders.length > 0 ? (
              <div className="folders-grid">
                {folders.filter(folder => folder.path === currentPath).map(folder => (
                  <div className="folder-item" key={folder.id}>
                    <div className="folder-icon" onClick={() => openFolder(folder)}>📁</div>
                    <div className="folder-name">{folder.name}</div>
                    <div className="folder-actions">
                      <button className="item-action delete" onClick={() => handleDeleteFolder(folder)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-items">No folders found</p>
            )}
            
            <h2>Files</h2>
            {files.length > 0 ? (
              <div className="files-table-container">
                <table className="files-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Modified</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.filter(file => file.path === currentPath).map(file => (
                      <tr key={file.id}>
                        <td className="file-name">
                          <span className="file-icon">
                            {file.type === 'pdf' && '📄'}
                            {file.type === 'jpg' && '🖼️'}
                            {file.type === 'sol' && '📝'}
                            {!['pdf', 'jpg', 'sol'].includes(file.type) && '📄'}
                          </span>
                          {file.name}
                        </td>
                        <td>{file.size}</td>
                        <td>{file.modified}</td>
                        <td className="file-actions">
                          <button className="item-action view" onClick={() => handleViewFile(file)}>
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
                          <button className="item-action delete" onClick={() => handleDeleteFile(file)}>
                            Delete
                          </button>
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
            <h2>Upload File</h2>
            <div className="modal-content">
              <input 
                type="file" 
                onChange={(e) => setFileToUpload(e.target.files[0])} 
              />
              {fileToUpload && (
                <div className="file-info">
                  <p>Name: {fileToUpload.name}</p>
                  <p>Size: {(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </button>
              <button 
                className="modal-btn upload" 
                onClick={handleFileUpload}
                disabled={!fileToUpload}
              >
                Upload
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
              <button className="modal-btn cancel" onClick={() => setIsCreateFolderModalOpen(false)}>
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
              <p>Sharing: <strong>{selectedFile.name}</strong></p>
              <input 
                type="email" 
                placeholder="Enter recipient's email" 
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setIsShareModalOpen(false)}>
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