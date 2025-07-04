'use client'
import React from 'react'

const PendingVerification: React.FC = () => {
  const handleLogout = () => {
    window.location.href = '/admin/logout'
  }

  const buttonStyle = {
    color: 'black',
    backgroundColor: 'transparent',
    border: '1px solid black',
    padding: '8px 24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  return (
    <>
      <style jsx>{`
        .logout-button {
          color: black;
          background-color: transparent;
          border: 1px solid black;
          padding: 8px 24px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .logout-button:hover {
          background-color: black;
          color: white;
        }
      `}</style>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: '400px',
            margin: '0 auto',
            padding: '0 16px',
          }}
        >
          <p
            style={{
              color: 'black',
              marginBottom: '32px',
              fontSize: '18px',
              lineHeight: '1.6',
            }}
          >
            Thank you for logging in. Your provider is still pending verification and someone will
            get in touch with you soon.
          </p>
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
        </div>
      </div>
    </>
  )
}

export default PendingVerification
