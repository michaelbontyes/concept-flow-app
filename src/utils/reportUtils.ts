export function processReportData(reportsData) {
  // Group reports by type/environment
  const reportsByType = {};
  
  // Process each report
  reportsData.forEach(report => {
    const reportType = report.environment || 'Unknown';
    if (!reportsByType[reportType]) {
      reportsByType[reportType] = [];
    }
    reportsByType[reportType].push(report);
  });
  
  // Process entities from all reports
  const forms = {};
  const attributes = {};
  const identifiers = {};
  
  // Process each report to extract entities
  reportsData.forEach(report => {
    const reportType = report.environment || 'Unknown';
    
    // Process concepts/forms
    if (report.concepts) {
      Object.entries(report.concepts).forEach(([uuid, data]) => {
        if (!forms[uuid]) {
          forms[uuid] = {
            total: data.forms?.length || 0,
            missing: 0,
            missingIds: [],
            formName: data.forms?.[0] || 'Unknown Form'
          };
        }
        
        // Update status for this report type
        const status = data.statuses?.[reportType];
        if (status !== 'Found') {
          forms[uuid].missing += 1;
          forms[uuid].missingIds.push(reportType);
        }
      });
    }
    
    // Process attributes
    if (report.attributes) {
      Object.entries(report.attributes).forEach(([uuid, data]) => {
        if (!attributes[uuid]) {
          attributes[uuid] = {
            total: 1, // Assuming each attribute is counted once per report
            missing: 0,
            missingIds: [],
            formName: data.form || 'Unknown Form'
          };
        }
        
        // Update status for this report type
        const status = data.statuses?.[reportType];
        if (status !== 'Found') {
          attributes[uuid].missing += 1;
          attributes[uuid].missingIds.push(reportType);
        }
      });
    }
    
    // Process identifiers
    if (report.identifiers) {
      Object.entries(report.identifiers).forEach(([uuid, data]) => {
        if (!identifiers[uuid]) {
          identifiers[uuid] = {
            total: 1, // Assuming each identifier is counted once per report
            missing: 0,
            missingIds: [],
            formName: data.form || 'System Identifier'
          };
        }
        
        // Update status for this report type
        const status = data.statuses?.[reportType];
        if (status !== 'Found') {
          identifiers[uuid].missing += 1;
          identifiers[uuid].missingIds.push(reportType);
        }
      });
    }
  });
  
  return {
    reportsByType,
    entityData: {
      forms,
      attributes,
      identifiers
    }
  };
}
