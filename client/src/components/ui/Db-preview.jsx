import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { API_BASE_URL } from '../../lib/api';

export const DbPreviewOption = ({ dbId, dbName }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buttonRect, setButtonRect] = useState(null);
  
  const fetchPreviewData = async () => {
    if (previewData) return; // Already fetched
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Modified to fetch the correct endpoint and match your data structure
  const response = await fetch(`${API_BASE_URL}/api/database/natural-descriptions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch preview data');
      }
      
      const data = await response.json();
      console.log(data);
      if (data.success) {
        // Find the database that matches our dbId
        const dbData = data.databases.find(db => db.id === dbId);
        
        if (dbData) {
          // Create a properly formatted preview object
          const formattedPreview = {
            name: dbData.name,
            type: dbData.type,
            description: dbData.naturalDescription?.summary || "No description available",
            tableCount: dbData.tableCount,
            tables: dbData.tables || [],
            sampleColumns: {} // This would need to be populated if available
          };
          
          setPreviewData(formattedPreview);
        } else {
          throw new Error('Database not found in response');
        }
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonRect(rect);
    setIsHovering(true);
    fetchPreviewData();
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  // Preview popup component that will be rendered in portal
  const PreviewPopup = () => {
    if (!isHovering || !buttonRect) return null;
    
    const styles = {
      position: 'fixed',
      top: buttonRect.bottom + 8,
      left: Math.max(16, Math.min(buttonRect.left, window.innerWidth - 416)),
      zIndex: 9999,
      width: '400px',
      maxHeight: '500px',
      overflowY: 'auto',
      background: '#1e1e1e',
      borderRadius: '8px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      border: '1px solid #374151',
      color: '#e0e0e0'
    };
    
    return (
      <div style={styles}>
        {/* Arrow pointer */}
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: Math.max(20, buttonRect.left + buttonRect.width/2 - Math.max(16, Math.min(buttonRect.left, window.innerWidth - 416))),
          width: '16px',
          height: '16px',
          background: '#1e1e1e',
          border: '1px solid #374151',
          borderBottom: 'none',
          borderRight: 'none',
          transform: 'rotate(45deg)'
        }} />
        
        {isLoading ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px'
            }} />
            <p>Loading preview...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#ef4444' }}>{error}</p>
          </div>
        ) : previewData ? (
          <div>
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #374151',
              background: '#111827'
            }}>
              <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600' }}>
                {dbName} - Preview
              </h3>
            </div>
            
            {/* Database preview content */}
            <div style={{ padding: '16px' }}>
              <div style={{
                background: '#111827',
                border: '1px solid #374151',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.5',
                overflow: 'hidden'
              }}>
                {/* Database header */}
                <div style={{
                  padding: '12px',
                  background: '#1f2937',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #374151'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {previewData.name}
                  </span>
                  <span style={{
                    color: '#9ca3af',
                    fontSize: '12px',
                    padding: '2px 8px',
                    background: '#374151',
                    borderRadius: '4px'
                  }}>
                    {previewData.type}
                  </span>
                </div>
                
                {/* Description */}
                <div style={{
                  padding: '12px',
                  borderBottom: '1px solid #374151',
                  color: '#9ca3af',
                  fontStyle: 'italic',
                  fontSize: '12px'
                }}>
                  {previewData.description}
                </div>
                
                {/* Tables section */}
                <div style={{ padding: '12px' }}>
                  <div style={{
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: '#d1d5db'
                  }}>
                    Tables ({previewData.tableCount})
                  </div>
                  
                  {previewData.tables && previewData.tables.length > 0 ? (
                    <div style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                      {previewData.tables.slice(0, 8).map((table, idx) => (
                        <div key={idx} style={{ padding: '4px 0' }}>
                          <span style={{
                            fontWeight: 'bold',
                            color: '#6366f1'
                          }}>
                            {table}
                          </span>
                          {previewData.sampleColumns[table] && (
                            <span style={{
                              color: '#9ca3af',
                              fontSize: '12px',
                              marginLeft: '6px'
                            }}>
                              ({previewData.sampleColumns[table].join(', ')}
                              {previewData.sampleColumns[table].length < 3 ? '' : ', ...'})
                            </span>
                          )}
                        </div>
                      ))}
                      {previewData.tableCount > 8 && (
                        <div style={{
                          color: '#9ca3af',
                          fontStyle: 'italic',
                          padding: '4px 0'
                        }}>
                          ... and {previewData.tableCount - Math.min(8, previewData.tables.length)} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      color: '#9ca3af',
                      fontStyle: 'italic',
                      padding: '4px 0'
                    }}>
                      No tables found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p>Loading preview...</p>
          </div>
        )}
      </div>
    );
  };
  
  // Add spinner keyframes
  useEffect(() => {
    if (!document.getElementById('spinner-keyframes')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'spinner-keyframes';
      styleSheet.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);
  
  return (
    <>
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          background: 'none',
          border: 'none',
          color: '#6366f1',
          textDecoration: 'underline',
          cursor: 'pointer',
          padding: '4px 8px',
          fontSize: '14px'
        }}
      >
        Preview Data
      </button>
      
      {/* Render popup in portal to escape card container */}
      {typeof document !== 'undefined' && createPortal(
        <PreviewPopup />,
        document.body
      )}
    </>
  );
};

export default DbPreviewOption;