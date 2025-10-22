import { Book, Review } from '../lib/bookData';
import { Button } from './ui/button';
import { Printer } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PrintBookReportProps {
  book: Book;
  reviews: Review[];
  onPrint?: () => void;
}

export function PrintBookReport({ book, reviews, onPrint }: PrintBookReportProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error('Please allow popups to print the report');
      return;
    }

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2)
      : book.rating.toFixed(2);
    
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    const genres = Array.isArray(book.genre) ? book.genre.join(', ') : book.genre;

    // Generate HTML content for printing
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Book Report - ${book.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          @page {
            size: A4;
            margin: 15mm;
          }
          
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            color: #2d2d2d;
            line-height: 1.6;
            background: white;
          }
          
          .container {
            max-width: 100%;
            padding: 20px;
          }
          
          /* Header */
          .header {
            text-align: center;
            border-bottom: 3px solid #879656;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            font-size: 28px;
            color: #879656;
            margin-bottom: 5px;
          }
          
          .header .subtitle {
            font-size: 14px;
            color: #666;
            font-style: italic;
          }
          
          /* Book Info Section */
          .book-info {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 30px;
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          
          .book-cover {
            text-align: center;
          }
          
          .book-cover img {
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          
          .book-details h2 {
            font-size: 24px;
            color: #535050;
            margin-bottom: 10px;
          }
          
          .book-details .author {
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
          }
          
          .detail-row {
            display: flex;
            margin-bottom: 8px;
            font-size: 14px;
          }
          
          .detail-label {
            font-weight: bold;
            min-width: 140px;
            color: #535050;
          }
          
          .detail-value {
            color: #666;
          }
          
          /* Description */
          .description {
            margin: 30px 0;
            padding: 20px;
            background: #f9f9f9;
            border-left: 4px solid #879656;
            page-break-inside: avoid;
          }
          
          .description h3 {
            font-size: 18px;
            color: #535050;
            margin-bottom: 10px;
          }
          
          .description p {
            font-size: 14px;
            color: #444;
            line-height: 1.8;
          }
          
          /* Statistics */
          .statistics {
            margin: 30px 0;
            page-break-inside: avoid;
          }
          
          .statistics h3 {
            font-size: 20px;
            color: #535050;
            margin-bottom: 20px;
            border-bottom: 2px solid #879656;
            padding-bottom: 10px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .stat-card {
            text-align: center;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
          }
          
          .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: #879656;
            margin-bottom: 5px;
          }
          
          .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          /* Rating Distribution */
          .rating-distribution {
            margin-top: 20px;
          }
          
          .rating-bar {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .rating-label {
            min-width: 80px;
            font-size: 14px;
            color: #535050;
          }
          
          .bar-container {
            flex: 1;
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin: 0 10px;
          }
          
          .bar-fill {
            height: 100%;
            background: #879656;
            transition: width 0.3s ease;
          }
          
          .rating-count {
            min-width: 40px;
            text-align: right;
            font-size: 14px;
            color: #666;
          }
          
          /* Reviews Section */
          .reviews-section {
            margin-top: 40px;
          }
          
          .reviews-section h3 {
            font-size: 20px;
            color: #535050;
            margin-bottom: 20px;
            border-bottom: 2px solid #879656;
            padding-bottom: 10px;
          }
          
          .review-item {
            margin-bottom: 25px;
            padding: 15px;
            background: #f9f9f9;
            border-left: 3px solid #879656;
            page-break-inside: avoid;
          }
          
          .review-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .review-user {
            font-weight: bold;
            color: #535050;
            font-size: 14px;
          }
          
          .review-date {
            font-size: 12px;
            color: #999;
          }
          
          .review-rating {
            margin-bottom: 8px;
          }
          
          .star {
            color: #ffc107;
            font-size: 16px;
          }
          
          .review-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #535050;
            font-size: 15px;
          }
          
          .review-content {
            font-size: 14px;
            color: #444;
            line-height: 1.8;
          }
          
          /* Footer */
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #879656;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          
          /* Print-specific styles */
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            
            .container {
              padding: 0;
            }
            
            .page-break {
              page-break-before: always;
            }
            
            h2, h3 {
              page-break-after: avoid;
            }
            
            .no-break {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>LitLens Book Report</h1>
            <p class="subtitle">Comprehensive Analysis and Review Summary</p>
          </div>
          
          <!-- Book Information -->
          <div class="book-info">
            <div class="book-cover">
              <img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'">
            </div>
            
            <div class="book-details">
              <h2>${book.title}</h2>
              <p class="author">by ${book.author}</p>
              
              <div class="detail-row">
                <span class="detail-label">Genre:</span>
                <span class="detail-value">${genres}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Published Year:</span>
                <span class="detail-value">${book.publishedYear}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Pages:</span>
                <span class="detail-value">${book.pages}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">ISBN:</span>
                <span class="detail-value">${book.isbn}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Publisher:</span>
                <span class="detail-value">${book.publisher}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Language:</span>
                <span class="detail-value">${book.language}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Length:</span>
                <span class="detail-value">${book.length || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <!-- Description -->
          <div class="description">
            <h3>Description</h3>
            <p>${book.description}</p>
          </div>
          
          <!-- Statistics -->
          <div class="statistics">
            <h3>Book Statistics</h3>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${averageRating}</div>
                <div class="stat-label">Average Rating</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-value">${totalReviews}</div>
                <div class="stat-label">Total Reviews</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-value">${book.viewCount || 0}</div>
                <div class="stat-label">View Count</div>
              </div>
            </div>
            
            ${totalReviews > 0 ? `
              <div class="rating-distribution">
                <h4 style="margin-bottom: 15px; color: #535050;">Rating Distribution</h4>
                ${[5, 4, 3, 2, 1].map(rating => {
                  const count = ratingDistribution[rating];
                  const percentage = totalReviews > 0 ? (count / totalReviews * 100) : 0;
                  return `
                    <div class="rating-bar">
                      <span class="rating-label">${rating} Star${rating !== 1 ? 's' : ''}</span>
                      <div class="bar-container">
                        <div class="bar-fill" style="width: ${percentage}%"></div>
                      </div>
                      <span class="rating-count">${count}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
          </div>
          
          <!-- Reviews -->
          ${totalReviews > 0 ? `
            <div class="reviews-section page-break">
              <h3>User Reviews (${totalReviews} total)</h3>
              
              ${reviews.slice(0, 20).map(review => `
                <div class="review-item">
                  <div class="review-header">
                    <span class="review-user">${review.userName}</span>
                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                  </div>
                  
                  ${review.title ? `<div class="review-title">${review.title}</div>` : ''}
                  
                  <div class="review-content">${review.content}</div>
                </div>
              `).join('')}
              
              ${reviews.length > 20 ? `
                <p style="text-align: center; color: #999; margin-top: 20px; font-style: italic;">
                  Showing 20 of ${reviews.length} reviews. For complete reviews, visit LitLens online.
                </p>
              ` : ''}
            </div>
          ` : `
            <div class="reviews-section">
              <h3>User Reviews</h3>
              <p style="text-align: center; color: #999; padding: 40px 0;">No reviews available for this book yet.</p>
            </div>
          `}
          
          <!-- Footer -->
          <div class="footer">
            <p>Generated by LitLens Admin Panel on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p style="margin-top: 5px;">© ${new Date().getFullYear()} LitLens - Personalized Book Discovery Platform</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for images to load before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        onPrint?.();
      }, 500);
    };
    
    toast.success('Opening print dialog...');
  };

  return (
    <Button
      onClick={handlePrint}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Printer className="w-4 h-4" />
      Print Report
    </Button>
  );
}
