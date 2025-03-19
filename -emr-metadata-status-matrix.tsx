import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, AlertCircle, CheckCircle, Download, ChevronDown, ChevronRight, Copy, Plus } from 'lucide-react';

const StatusMatrix = () => {
  // Sample data based on the provided JSON
  const [activeProject, setActiveProject] = useState({
    id: '6d9cddc4-802f-48a6-bddc-7d2038c5fa92',
    name: 'Iraq MHPSS Project'
  });
  
  const [reports, setReports] = useState({
    deploy: {
      'Lime-Mosul-Uat': {
        syncedAt: '2025-03-18T20:59:04.000Z',
        stats: {
          summary: { found: 71, total: 85, missing: 14, foundPercentage: "84% ✅", missingPercentage: "16% ❌" },
          concepts: { found: 63, total: 72, missing: 9 },
          attributes: { found: 6, total: 11, missing: 5 },
          identifiers: { found: 2, total: 2, missing: 0 }
        }
      },
      'Lime-Mosul-Dev': {
        syncedAt: '2025-03-17T14:30:22.000Z',
        stats: {
          summary: { found: 68, total: 85, missing: 17, foundPercentage: "80% ✅", missingPercentage: "20% ❌" },
          concepts: { found: 60, total: 72, missing: 12 },
          attributes: { found: 6, total: 11, missing: 5 },
          identifiers: { found: 2, total: 2, missing: 0 }
        }
      }
    },
    metadata: {
      'OCL-Source-MSF': {
        syncedAt: '2025-03-18T10:12:45.000Z',
        stats: {
          summary: { found: 82, total: 85, missing: 3, foundPercentage: "96% ✅", missingPercentage: "4% ❌" },
          concepts: { found: 70, total: 72, missing: 2 },
          attributes: { found: 10, total: 11, missing: 1 },
          identifiers: { found: 2, total: 2, missing: 0 }
        }
      },
      'OCL-Collection-Mosul': {
        syncedAt: '2025-03-15T09:45:33.000Z',
        stats: {
          summary: { found: 79, total: 85, missing: 6, foundPercentage: "93% ✅", missingPercentage: "7% ❌" },
          concepts: { found: 68, total: 72, missing: 4 },
          attributes: { found: 9, total: 11, missing: 2 },
          identifiers: { found: 2, total: 2, missing: 0 }
        }
      }
    },
    integration: {
      'DHIS2-MSF-UAT': {
        syncedAt: '2025-03-16T15:30:10.000Z',
        stats: {
          summary: { found: 65, total: 85, missing: 20, foundPercentage: "76% ✅", missingPercentage: "24% ❌" },
          concepts: { found: 58, total: 72, missing: 14 },
          attributes: { found: 5, total: 11, missing: 6 },
          identifiers: { found: 2, total: 2, missing: 0 }
        }
      }
    }
  });

  // Sample entity lists data
  const [entityLists, setEntityLists] = useState({
    concepts: [
      { uuid: '08cd4b4a-4b0b-4391-987b-b5b3d770d30f', name: 'F01-MHPSS Baseline', status: { 'Lime-Mosul-Uat': 'Found', 'Lime-Mosul-Dev': 'Found', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Found', 'DHIS2-MSF-UAT': 'Found' } },
      { uuid: '0a0c70d2-2ba5-4cb3-941f-b4a9a4a7ec6d', name: 'F02-MHPSS Follow-up', status: { 'Lime-Mosul-Uat': 'Found', 'Lime-Mosul-Dev': 'Found', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Found', 'DHIS2-MSF-UAT': 'Missing' } },
      { uuid: '15748787-7372-4022-b5d4-81ff8d6887ca', name: 'F03-mhGAP Baseline', status: { 'Lime-Mosul-Uat': 'Found', 'Lime-Mosul-Dev': 'Missing', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Found', 'DHIS2-MSF-UAT': 'Missing' } },
      { uuid: '1a8bf24f-4f36-4971-aad9-ae77f3525738', name: 'F04-mhGAP Follow-up', status: { 'Lime-Mosul-Uat': 'Found', 'Lime-Mosul-Dev': 'Found', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Missing', 'DHIS2-MSF-UAT': 'Missing' } },
      { uuid: '4ab28f46-8704-42b9-b0a0-c9f828a3b0ba', name: 'F05-Psych Assessment', status: { 'Lime-Mosul-Uat': 'Missing', 'Lime-Mosul-Dev': 'Missing', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Found', 'DHIS2-MSF-UAT': 'Missing' } },
    ],
    attributes: [
      { uuid: '24d1fa23-9778-4a8e-9f7b-93f694fc25e2', name: 'Patient Name', status: { 'Lime-Mosul-Uat': 'Found', 'Lime-Mosul-Dev': 'Found', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Found', 'DHIS2-MSF-UAT': 'Found' } },
      { uuid: '3884dc76-c271-4bcb-8df8-81c6fb897f53', name: 'Date of Birth', status: { 'Lime-Mosul-Uat': 'Found', 'Lime-Mosul-Dev': 'Found', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Found', 'DHIS2-MSF-UAT': 'Found' } },
      { uuid: '38ef5485-e67f-4a10-bf36-08304fe63877', name: 'Gender', status: { 'Lime-Mosul-Uat': 'Missing', 'Lime-Mosul-Dev': 'Missing', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Found', 'DHIS2-MSF-UAT': 'Missing' } },
      { uuid: 'a9b2c642-097f-43f8-b96b-4d2f50ffd9b1', name: 'Phone Number', status: { 'Lime-Mosul-Uat': 'Found', 'Lime-Mosul-Dev': 'Found', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Missing', 'DHIS2-MSF-UAT': 'Found' } },
      { uuid: 'c020e465-d495-4f6b-97fa-6d4c0009fcd2', name: 'Address', status: { 'Lime-Mosul-Uat': 'Missing', 'Lime-Mosul-Dev': 'Missing', 'OCL-Source-MSF': 'Missing', 'OCL-Collection-Mosul': 'Missing', 'DHIS2-MSF-UAT': 'Missing' } },
    ],
    identifiers: [
      { uuid: '05a29f94-c0ed-11e2-94be-8c13b969e334', name: 'Patient ID', status: { 'Lime-Mosul-Uat': 'Found', 'Lime-Mosul-Dev': 'Found', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Found', 'DHIS2-MSF-UAT': 'Found' } },
      { uuid: '8d79403a-c2cc-11de-8d13-0010c6dffd0f', name: 'Medical Record Number', status: { 'Lime-Mosul-Uat': 'Found', 'Lime-Mosul-Dev': 'Found', 'OCL-Source-MSF': 'Found', 'OCL-Collection-Mosul': 'Found', 'DHIS2-MSF-UAT': 'Found' } },
    ]
  });

  const [expandedSections, setExpandedSections] = useState({
    concepts: false,
    attributes: false,
    identifiers: false
  });

  const [selectedUUIDs, setSelectedUUIDs] = useState({
    concepts: [],
    attributes: [],
    identifiers: []
  });

  const [activeTab, setActiveTab] = useState('deploy');

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const toggleUUIDSelection = (section, uuid) => {
    if (selectedUUIDs[section].includes(uuid)) {
      setSelectedUUIDs({
        ...selectedUUIDs,
        [section]: selectedUUIDs[section].filter(id => id !== uuid)
      });
    } else {
      setSelectedUUIDs({
        ...selectedUUIDs,
        [section]: [...selectedUUIDs[section], uuid]
      });
    }
  };

  const selectAllMissingUUIDs = (section, environment) => {
    const missingUUIDs = entityLists[section]
      .filter(entity => entity.status[environment] === 'Missing')
      .map(entity => entity.uuid);
    
    setSelectedUUIDs({
      ...selectedUUIDs,
      [section]: missingUUIDs
    });
  };

  const clearSelection = (section) => {
    setSelectedUUIDs({
      ...selectedUUIDs,
      [section]: []
    });
  };

  const handleTriggerReport = (environment) => {
    console.log(`Triggering new verification for ${environment}`);
    // Here you would make an API POST call to trigger a new verification
    // POST to webhook endpoint
  };

  const handleAddToSource = (uuids, section) => {
    console.log(`Adding ${uuids.length} ${section} UUIDs to OCL Source`);
    // API call to add UUIDs to OCL Source
  };

  const handleAddToCollection = (uuids, section) => {
    console.log(`Adding ${uuids.length} ${section} UUIDs to OCL Collection`);
    // API call to add UUIDs to OCL Collection
  };

  const handleCloneUUID = (uuid, section) => {
    console.log(`Cloning UUID ${uuid} for ${section}`);
    // API call to clone UUID
  };

  const handleCreateUUID = (section) => {
    console.log(`Creating new UUID for ${section}`);
    // API call or dialog to create UUID
  };

  const renderSummaryHeader = (tabKey) => {
    return (
      <tr>
        <th className="border p-3 bg-gray-100">Entity Type</th>
        {Object.keys(reports[tabKey]).map(environment => {
          const stats = reports[tabKey][environment]?.stats?.summary;
          const syncedAt = new Date(reports[tabKey][environment]?.syncedAt).toLocaleString();
          
          return (
            <th key={environment} className="border p-3 bg-gray-100">
              <div className="flex flex-col items-center">
                <span className="font-bold">{environment}</span>
                <span className="text-sm">{stats?.foundPercentage}</span>
                <span className="text-xs text-gray-500">Updated: {syncedAt}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="mt-2 flex items-center"
                  onClick={() => handleTriggerReport(environment)}
                >
                  <RefreshCw size={14} className="mr-1" />
                  Refresh
                </Button>
              </div>
            </th>
          );
        })}
      </tr>
    );
  };

  const renderStatusCell = (category, environment, tabKey) => {
    const stats = reports[tabKey][environment]?.stats;
    if (!stats) return null;

    const categoryStats = stats[category];
    const percentage = Math.round((categoryStats.found / categoryStats.total) * 100);
    const missingCount = categoryStats.missing;
    
    const hasMissing = missingCount > 0;
    const cellColorClass = percentage >= 90 ? 'bg-green-100' : 
                           percentage >= 80 ? 'bg-yellow-100' : 'bg-red-100';

    return (
      <td className={`border p-3 text-center ${cellColorClass}`}>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{`${percentage}%`}</span>
          <span className="text-sm">
            {hasMissing ? (
              <span className="flex items-center text-red-600">
                <AlertCircle size={14} className="mr-1" />
                {`${missingCount} missing`}
              </span>
            ) : (
              <span className="flex items-center text-green-600">
                <CheckCircle size={14} className="mr-1" />
                All found
              </span>
            )}
          </span>
          {hasMissing && (
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-1 text-xs"
              onClick={() => selectAllMissingUUIDs(category, environment)}
            >
              Select Missing
            </Button>
          )}
        </div>
      </td>
    );
  };

  const renderEntityList = (section, tabKey) => {
    if (!expandedSections[section]) return null;

    return (
      <tr>
        <td colSpan={Object.keys(reports[tabKey]).length + 1} className="p-0">
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <h4 className="font-bold">{section.charAt(0).toUpperCase() + section.slice(1)} Details</h4>
                <span className="ml-2 text-sm text-gray-500">({entityLists[section].length} items)</span>
              </div>
              <div className="flex gap-2">
                {selectedUUIDs[section].length > 0 && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddToSource(selectedUUIDs[section], section)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add {selectedUUIDs[section].length} to OCL Source
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddToCollection(selectedUUIDs[section], section)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Add {selectedUUIDs[section].length} to OCL Collection
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => clearSelection(section)}
                    >
                      Clear Selection
                    </Button>
                  </>
                )}
                <Button 
                  size="sm" 
                  onClick={() => handleCreateUUID(section)}
                  className="flex items-center ml-2"
                >
                  <Plus size={14} className="mr-1" />
                  Create New
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 w-8 text-center">
                      <Checkbox 
                        checked={entityLists[section].length > 0 && selectedUUIDs[section].length === entityLists[section].length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUUIDs({
                              ...selectedUUIDs,
                              [section]: entityLists[section].map(entity => entity.uuid)
                            });
                          } else {
                            clearSelection(section);
                          }
                        }}
                      />
                    </th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">UUID</th>
                    {Object.keys(reports[tabKey]).map(env => (
                      <th key={env} className="p-2 text-center">{env}</th>
                    ))}
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entityLists[section].map((entity, idx) => (
                    <tr key={entity.uuid} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-2 text-center">
                        <Checkbox 
                          checked={selectedUUIDs[section].includes(entity.uuid)}
                          onCheckedChange={() => toggleUUIDSelection(section, entity.uuid)}
                        />
                      </td>
                      <td className="p-2">{entity.name}</td>
                      <td className="p-2 font-mono text-xs">{entity.uuid}</td>
                      {Object.keys(reports[tabKey]).map(env => (
                        <td key={env} className="p-2 text-center">
                          {entity.status[env] === 'Found' ? (
                            <CheckCircle size={16} className="mx-auto text-green-500" />
                          ) : (
                            <AlertCircle size={16} className="mx-auto text-red-500" />
                          )}
                        </td>
                      ))}
                      <td className="p-2">
                        <div className="flex justify-center gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            title="Copy UUID" 
                            onClick={() => {
                              navigator.clipboard.writeText(entity.uuid);
                            }}
                          >
                            <Copy size={14} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            title="Clone UUID" 
                            onClick={() => handleCloneUUID(entity.uuid, section)}
                          >
                            <Copy size={14} className="rotate-90" />
                          </Button>
                          {Object.values(entity.status).includes('Missing') && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0" 
                                title="Add to OCL Source" 
                                onClick={() => handleAddToSource([entity.uuid], section)}
                              >
                                <Plus size={14} className="text-blue-600" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0" 
                                title="Add to OCL Collection" 
                                onClick={() => handleAddToCollection([entity.uuid], section)}
                              >
                                <Plus size={14} className="text-green-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-blue-50 p-4 mb-4 rounded-md border border-blue-200">
        <h2 className="text-xl font-bold mb-2">Project: {activeProject.name}</h2>
        <p className="text-sm text-gray-600">Metadata status reports across different environments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="deploy">Deployment</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        {['deploy', 'metadata', 'integration'].map(tabKey => (
          <TabsContent key={tabKey} value={tabKey} className="border rounded-md p-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">
                {tabKey === 'deploy' ? 'Deployment Reports' : 
                 tabKey === 'metadata' ? 'Metadata Reports' : 'Integration Reports'}
              </h3>
              <Button className="flex items-center">
                <Download size={16} className="mr-2" />
                Export Report
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  {renderSummaryHeader(tabKey)}
                </thead>
                <tbody>
                  <tr>
                    <td 
                      className="border p-3 font-semibold bg-gray-50 cursor-pointer" 
                      onClick={() => toggleSection('concepts')}
                    >
                      <div className="flex items-center">
                        {expandedSections.concepts ? 
                          <ChevronDown size={16} className="mr-2" /> : 
                          <ChevronRight size={16} className="mr-2" />}
                        <span>Concepts (Forms)</span>
                      </div>
                    </td>
                    {Object.keys(reports[tabKey]).map(environment => 
                      renderStatusCell('concepts', environment, tabKey)
                    )}
                  </tr>
                  {renderEntityList('concepts', tabKey)}
                  
                  <tr>
                    <td 
                      className="border p-3 font-semibold bg-gray-50 cursor-pointer" 
                      onClick={() => toggleSection('attributes')}
                    >
                      <div className="flex items-center">
                        {expandedSections.attributes ? 
                          <ChevronDown size={16} className="mr-2" /> : 
                          <ChevronRight size={16} className="mr-2" />}
                        <span>Attributes</span>
                      </div>
                    </td>
                    {Object.keys(reports[tabKey]).map(environment => 
                      renderStatusCell('attributes', environment, tabKey)
                    )}
                  </tr>
                  {renderEntityList('attributes', tabKey)}
                  
                  <tr>
                    <td 
                      className="border p-3 font-semibold bg-gray-50 cursor-pointer" 
                      onClick={() => toggleSection('identifiers')}
                    >
                      <div className="flex items-center">
                        {expandedSections.identifiers ? 
                          <ChevronDown size={16} className="mr-2" /> : 
                          <ChevronRight size={16} className="mr-2" />}
                        <span>Identifiers</span>
                      </div>
                    </td>
                    {Object.keys(reports[tabKey]).map(environment => 
                      renderStatusCell('identifiers', environment, tabKey)
                    )}
                  </tr>
                  {renderEntityList('identifiers', tabKey)}
                </tbody>
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default StatusMatrix;
