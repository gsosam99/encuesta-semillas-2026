import React from 'react';
import { StoredResponse } from '../../types';
import ProducerStatusList from './ProducerLinkList';
import ResponseList from './ResponseList';

interface AdminPanelProps {
  allResponses: StoredResponse[];
  adminSearch: string;
  onSearchChange: (val: string) => void;
  onRefresh: () => void;
  onExportCSV: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  allResponses,
  adminSearch,
  onSearchChange,
  onRefresh,
  onExportCSV,
}) => (
  <div style={{ animation: 'fadeIn 0.4s' }}>
    <ProducerStatusList
      allResponses={allResponses}
      adminSearch={adminSearch}
      onSearchChange={onSearchChange}
    />
    <ResponseList
      allResponses={allResponses}
      onRefresh={onRefresh}
      onExportCSV={onExportCSV}
    />
  </div>
);

export default AdminPanel;
