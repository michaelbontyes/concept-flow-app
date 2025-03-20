import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the sample report from the file system
    const reportPath = path.join(process.cwd(), 'report.json');
    const reportContent = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    return NextResponse.json(reportContent);
  } catch (error) {
    console.error('Error reading sample report:', error);
    
    // Return a fallback sample report if the file cannot be read
    return NextResponse.json({
      concepts: {},
      syncedAt: new Date().toISOString(),
      projectID: "sample-project-id",
      attributes: {},
      sourceFile: "sample-source-file.xlsx",
      environment: "sample-environment",
      identifiers: {},
      environments: {
        "sample-environment": {
          stats: {
            summary: {
              found: 0,
              total: 0,
              missing: 0,
              foundPercentage: "0% ✅",
              missingPercentage: "0% ❌"
            }
          },
          display: "Sample Environment",
          timestamp: new Date().toISOString()
        }
      },
      fileDateModified: new Date().toISOString()
    }, { status: 200 });
  }
} 