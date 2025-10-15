import { Book, Review, ReviewReport } from '../lib/bookData';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Trash2, Flag } from 'lucide-react';

interface ReportedReviewsTableProps {
  reports: ReviewReport[];
  books: Book[];
  reviews: Review[];
  onUpdateReportStatus: (reportId: string, status: ReviewReport['status']) => void;
  onDeleteReview: (reviewId: string) => void;
}

export function ReportedReviewsTable({
  reports,
  books,
  reviews,
  onUpdateReportStatus,
  onDeleteReview
}: ReportedReviewsTableProps) {
  
  const getStatusBadge = (status: ReviewReport['status']) => {
    const statusConfig = {
      pending: { 
        label: 'Pending', 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300' 
      },
      actionTaken: { 
        label: 'Action Taken', 
        className: 'bg-green-100 text-green-800 border-green-300' 
      },
      dismissed: { 
        label: 'Dismissed', 
        className: 'bg-blue-100 text-blue-800 border-blue-300' 
      },
      reviewed: { 
        label: 'Reviewed', 
        className: 'bg-gray-100 text-gray-800 border-gray-300' 
      }
    };
    
    return statusConfig[status] || statusConfig.reviewed;
  };

  const getReasonLabel = (reason: string) => {
    const reasonMap: { [key: string]: string } = {
      'spam': 'Spam',
      'harassment': 'Harassment',
      'hate-speech': 'Hate Speech',
      'inappropriate': 'Inappropriate',
      'fake': 'Fake Review',
      'copyright': 'Copyright',
      'other': 'Other'
    };
    return reasonMap[reason] || reason;
  };

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Flag className="w-16 h-16 text-muted-foreground opacity-30 mb-4" />
        <h3 className="text-lg text-muted-foreground mb-1">No Reported Reviews</h3>
        <p className="text-sm text-muted-foreground">All reviews are currently in good standing</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-[#f9f8f6]">
              <th className="text-left py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '28%' }}>
                Review Content
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '13%' }}>
                Reported By
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '13%' }}>
                Reason
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '13%' }}>
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '11%' }}>
                Date
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '22%' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const review = reviews.find(r => r.id === report.reviewId);
              const book = books.find(b => b.id === review?.bookId);
              const statusBadge = getStatusBadge(report.status);

              return (
                <tr 
                  key={report.id} 
                  className="border-b border-gray-100 hover:bg-[#faf9f7] transition-colors duration-150"
                >
                  {/* Review Content */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium text-[#535050] leading-tight">
                        {book?.title || 'Unknown Book'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {review?.userName || 'Unknown User'}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        "{review?.content || 'Review not found'}"
                      </p>
                    </div>
                  </td>

                  {/* Reported By */}
                  <td className="py-4 px-4 align-top">
                    <span className="text-sm text-[#535050]">
                      {report.reporterName}
                    </span>
                  </td>

                  {/* Reason - Pill Style */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs px-2.5 py-0.5 rounded-full bg-white border-gray-300 text-[#535050] font-normal"
                      >
                        {getReasonLabel(report.reason)}
                      </Badge>
                      {report.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {report.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Status - Color Coded */}
                  <td className="py-4 px-4 text-center align-top">
                    <Badge 
                      className={`text-xs px-2.5 py-1 rounded-md border ${statusBadge.className} font-medium`}
                    >
                      {statusBadge.label}
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 align-top">
                    <span className="text-sm text-[#535050] whitespace-nowrap">
                      {new Date(report.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right align-top">
                    {report.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateReportStatus(report.id, 'dismissed')}
                          className="h-8 w-8 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all"
                          title="Dismiss Report"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onUpdateReportStatus(report.id, 'actionTaken')}
                          className="h-8 w-8 p-0 hover:opacity-90 transition-all"
                          style={{ backgroundColor: '#879656', color: 'white' }}
                          title="Take Action"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (review) {
                              onDeleteReview(review.id);
                              onUpdateReportStatus(report.id, 'actionTaken');
                            }
                          }}
                          className="h-8 w-8 p-0 hover:bg-red-600 transition-all"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        {report.status === 'actionTaken' ? 'Resolved' : 'Closed'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {reports.map((report) => {
          const review = reviews.find(r => r.id === report.reviewId);
          const book = books.find(b => b.id === review?.bookId);
          const statusBadge = getStatusBadge(report.status);

          return (
            <div 
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
            >
              {/* Header: Book Title & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#535050] leading-tight">
                    {book?.title || 'Unknown Book'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    by {review?.userName || 'Unknown User'}
                  </p>
                </div>
                <Badge 
                  className={`text-xs px-2.5 py-1 rounded-md border ${statusBadge.className} font-medium whitespace-nowrap`}
                >
                  {statusBadge.label}
                </Badge>
              </div>

              {/* Review Content */}
              <div className="text-xs text-muted-foreground line-clamp-3 leading-relaxed bg-[#faf9f7] p-3 rounded">
                "{review?.content || 'Review not found'}"
              </div>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reported By</p>
                  <p className="text-sm text-[#535050]">{report.reporterName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm text-[#535050]">
                    {new Date(report.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Reason</p>
                <Badge 
                  variant="outline" 
                  className="text-xs px-2.5 py-0.5 rounded-full bg-white border-gray-300 text-[#535050] font-normal"
                >
                  {getReasonLabel(report.reason)}
                </Badge>
                {report.description && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {report.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              {report.status === 'pending' && (
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateReportStatus(report.id, 'dismissed')}
                    className="flex-1 h-9 text-xs hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onUpdateReportStatus(report.id, 'actionTaken')}
                    className="flex-1 h-9 text-xs"
                    style={{ backgroundColor: '#879656', color: 'white' }}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (review) {
                        onDeleteReview(review.id);
                        onUpdateReportStatus(report.id, 'actionTaken');
                      }
                    }}
                    className="h-9 w-9 p-0"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
