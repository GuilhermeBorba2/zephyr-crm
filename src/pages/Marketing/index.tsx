import React, { useState, useEffect } from 'react';
import { Plus, FileDown } from 'lucide-react';
import CampaignList from '../../components/marketing/CampaignList';
import ROIDashboard from '../../components/marketing/ROIDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';
import { marketing } from '../../lib/marketing';
import type { Campaign } from '../../types/database.types';
import CampaignEditorModal from '../../components/modals/CampaignEditorModal';
import { useToastStore } from '../../stores/toastStore';

const MarketingPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await marketing.getCampaigns();
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      addToast('Erro ao carregar campanhas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditorOpen(true);
  };

  const handleNewCampaign = () => {
    setSelectedCampaign(null);
    setIsEditorOpen(true);
  };

  const handleExportReport = async () => {
    try {
      const report = await marketing.generateReport();
      const blob = new Blob([report], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio-marketing.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      addToast('Relatório exportado com sucesso!', 'success');
    } catch (error) {
      console.error('Error exporting report:', error);
      addToast('Erro ao exportar relatório', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Marketing
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <FileDown className="w-4 h-4" />
            Exportar Relatório
          </button>
          <button
            onClick={handleNewCampaign}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nova Campanha
          </button>
        </div>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="roi">ROI Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <CampaignList
            campaigns={campaigns}
            loading={loading}
            onEdit={handleEdit}
            onRefresh={fetchCampaigns}
          />
        </TabsContent>

        <TabsContent value="roi">
          <ROIDashboard />
        </TabsContent>
      </Tabs>

      <CampaignEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={fetchCampaigns}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default MarketingPage;