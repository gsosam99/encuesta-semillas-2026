import React from 'react';
import { StoredResponse } from '../../types';
import ProducerLinkList from './ProducerLinkList';
import ResponseList from './ResponseList';

interface AdminPanelProps {
  allResponses: StoredResponse[];
  adminSearch: string;
  onSearchChange: (val: string) => void;
  copied: string;
  onCopyLink: (token: string) => void;
  onRefresh: () => void;
  onExportCSV: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  allResponses,
  adminSearch,
  onSearchChange,
  copied,
  onCopyLink,
  onRefresh,
  onExportCSV,
}) => (
  <div style={{ animation: 'fadeIn 0.4s' }}>
    <ProducerLinkList
      allResponses={allResponses}
      adminSearch={adminSearch}
      onSearchChange={onSearchChange}
      copied={copied}
      onCopyLink={onCopyLink}
    />
    <ResponseList
      allResponses={allResponses}
      onRefresh={onRefresh}
      onExportCSV={onExportCSV}
    />
  </div>
);

export default AdminPanel;
