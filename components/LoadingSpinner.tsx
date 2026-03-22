'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: LoadingSpinnerProps) {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{
        display: 'inline-block',
        padding: '10px 20px',
        background: '#ffffcc',
        border: '1px solid #cc9900',
        fontSize: '12px'
      }}>
        <span style={{ color: '#cc6600' }}>&#8987;</span> Loading, please wait...
      </div>
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#999' }}>
        Loading data from server...
      </div>
    </div>
  );
}
