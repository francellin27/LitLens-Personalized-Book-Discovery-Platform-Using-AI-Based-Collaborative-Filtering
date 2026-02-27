# Print Book Report Feature

## Overview
Added a comprehensive print feature that allows administrators to generate and print detailed book reports from the Admin Panel.

## What's New

### 1. PrintBookReport Component (`/components/PrintBookReport.tsx`)
A new component that generates professional, print-ready book reports with:

#### Report Sections:
- **Header**: LitLens branding with report title
- **Book Information**: 
  - Cover image
  - Title, author, and publication details
  - Genre, ISBN, publisher, language
  - Page count and reading length
- **Description**: Full book synopsis
- **Statistics**:
  - Average rating
  - Total review count  
  - View count
  - Rating distribution (visual bar chart showing 1-5 star breakdown)
- **User Reviews**: 
  - Up to 20 most recent reviews
  - Each review shows user name, date, rating, title, and content
  - Note if more reviews exist
- **Footer**: Generated timestamp and copyright

#### Features:
- **Print-optimized styling** with proper page breaks
- **Professional typography** using Georgia/Times serif fonts
- **Color scheme** using your custom LitLens palette (#879656)
- **Responsive layout** adapting to A4 paper size
- **Image handling** with fallback for missing book covers
- **Toast notifications** for user feedback
- **Auto-print dialog** opens in new window

### 2. Integration in Admin Panel
The print button appears in the **Edit Book** dialog:
- Located in the top-right corner of the dialog header
- Only visible when editing an existing book
- Shows book-specific data including all reviews for that book
- Non-intrusive, outline button style with printer icon

## How to Use

### For Administrators:

1. **Navigate to Admin Panel** → Manage Books tab
2. **Click on any book** in the library to open the edit dialog
3. **Click the "Print Report" button** in the top-right corner
4. A new window will open with the formatted report
5. The print dialog will automatically appear
6. **Choose your printer** and print settings
7. Click "Print" to generate the physical or PDF copy

### Print Settings Recommendations:
- **Paper size**: A4 or Letter
- **Orientation**: Portrait
- **Margins**: Default (15mm)
- **Color**: Enabled for best results
- **Headers/Footers**: Disabled (report has its own)

## Technical Details

### Styling:
- Uses inline CSS in the generated HTML for print compatibility
- @page rules for proper page sizing and margins
- @media print queries for print-specific optimizations
- `page-break-inside: avoid` for keeping sections together
- Color-accurate printing with `print-color-adjust: exact`

### Data Flow:
1. Component receives selected book + all reviews
2. Filters reviews for the specific book
3. Calculates statistics (average rating, distribution)
4. Generates complete HTML document
5. Opens in new window
6. Waits for images to load
7. Triggers browser print dialog

### Dependencies:
- Uses existing `Book` and `Review` interfaces
- Imports from `./ui/button` and `lucide-react`
- Uses `sonner` for toast notifications
- No external print libraries needed

## File Locations

```
/components/PrintBookReport.tsx     (New component)
/components/AdminPanel.tsx          (Updated with print button)
```

## Future Enhancements

Potential improvements for future versions:
- [ ] Batch printing for multiple books
- [ ] Custom report templates
- [ ] Export to PDF without printing
- [ ] Email report functionality
- [ ] Customizable date ranges for reviews
- [ ] Include analytics charts in print version
- [ ] Add cover letter or summary page options
- [ ] Multi-language support for reports

## Notes

- **Browser compatibility**: Works in all modern browsers
- **Popup blockers**: Users must allow popups for the print feature
- **Performance**: Large books with 100+ reviews may take a few seconds to render
- **Print preview**: Users can always use browser's print preview before printing
- **Cost-effective**: Generates reports on-demand, no storage needed

---

**Created**: December 2024  
**Author**: LitLens Development Team  
**Version**: 1.0
