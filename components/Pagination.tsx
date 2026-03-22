'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  basePath: string;
  className?: string;
}

export default function Pagination({ 
  currentPage, 
  hasNextPage, 
  basePath,
  className = '' 
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '10px',
      background: '#f5f5f5',
      border: '1px solid #ccc',
      marginTop: '10px'
    }}>
      <span style={{ fontSize: '11px', marginRight: '10px' }}>
        Page: <strong>{currentPage}</strong>
      </span>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        style={{ marginRight: '5px' }}
      >
        &lt;&lt; Previous
      </button>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        Next &gt;&gt;
      </button>
    </div>
  );
}
