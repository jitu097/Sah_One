import React from 'react';

const AdminDeleteButton = ({ onClick, title = "Delete", style = {} }) => {
    return (
        <button
            className="icon-btn delete-custom"
            onClick={(e) => {
                e.stopPropagation();
                onClick(e);
            }}
            title={title}
            style={{
                background: '#fff1f2',
                border: '1px solid #fda4af',
                borderRadius: '6px',
                padding: '6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                minWidth: '32px',
                height: '32px',
                ...style
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffe4e6';
                e.currentTarget.style.borderColor = '#f43f5e';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff1f2';
                e.currentTarget.style.borderColor = '#fda4af';
            }}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e11d48"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
        </button>
    );
};

export default AdminDeleteButton;
