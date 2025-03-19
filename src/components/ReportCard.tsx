'use client'

interface ReportCardProps {
  report: {
    id: string;
    report_type: string;
    title?: string;
    summary?: string;
    created_at: string;
  }
}

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <div className="p-4 border border-foreground/10 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary mb-2 inline-block">
            {report.report_type}
          </span>
          <h4 className="text-lg font-medium text-foreground/90">{report.title || report.report_type}</h4>
        </div>
        <span className="text-xs text-foreground/60">
          {new Date(report.created_at).toLocaleDateString()}
        </span>
      </div>
      {report.summary && (
        <p className="text-sm text-foreground/80 mt-2 line-clamp-2">{report.summary}</p>
      )}
      <div className="mt-3 text-xs text-primary hover:underline cursor-pointer">
        View full report
      </div>
    </div>
  )
}
