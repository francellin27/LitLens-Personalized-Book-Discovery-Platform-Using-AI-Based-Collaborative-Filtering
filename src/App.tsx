import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./lib/auth-supabase";
import { Login } from "./components/Login";
import { Navigation, PageType } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { SearchPage } from "./components/SearchPage";
import { UserProfile } from "./components/UserProfile";
import { UserProfileView } from "./components/UserProfileView";
import { AdminPanel } from "./components/AdminPanel";
import { BookModal } from "./components/BookModal";
import { Footer } from "./components/Footer";
import { BrowseBooksPage } from "./components/BrowseBooksPage";
import { RecommendationsPage } from "./components/RecommendationsPage";
import { ReadingListsPage } from "./components/ReadingListsPage";
import { CommunityPage } from "./components/CommunityPage";
import { HelpCenterPage } from "./components/HelpCenterPage";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { TermsOfServicePage } from "./components/TermsOfServicePage";
import { ContactUsPage } from "./components/ContactUsPage";
import { DiscussionDetailsPage } from "./components/DiscussionDetailsPage";
import { HelpGettingStartedAccount } from "./components/HelpGettingStartedAccount";
import { HelpGettingStartedProfile } from "./components/HelpGettingStartedProfile";
import { HelpGettingStartedLibrary } from "./components/HelpGettingStartedLibrary";
import { HelpGettingStartedRecommendations } from "./components/HelpGettingStartedRecommendations";
import { HelpReadingListsCreating } from "./components/HelpReadingListsCreating";
import { HelpReadingListsOrganizing } from "./components/HelpReadingListsOrganizing";
import { HelpReadingListsSharing } from "./components/HelpReadingListsSharing";
import { HelpReadingListsTags } from "./components/HelpReadingListsTags";

import { HelpCommunityDiscussions } from "./components/HelpCommunityDiscussions";
import { HelpCommunityReviews } from "./components/HelpCommunityReviews";
import { HelpCommunityFollowing } from "./components/HelpCommunityFollowing";
import { HelpAccountManagingProfile } from "./components/HelpAccountManagingProfile";
import { HelpAccountPrivacySettings } from "./components/HelpAccountPrivacySettings";
import { HelpAccountNotifications } from "./components/HelpAccountNotifications";
import { HelpAccountDeletion } from "./components/HelpAccountDeletion";
import { HelpPrivacyDataPolicy } from "./components/HelpPrivacyDataPolicy";
import { HelpPrivacyAccountSecurity } from "./components/HelpPrivacyAccountSecurity";
import { HelpPrivacyDataSharing } from "./components/HelpPrivacyDataSharing";
import { HelpPrivacyReporting } from "./components/HelpPrivacyReporting";
import { MigrationAlert } from "./components/MigrationAlert";
import { Toaster } from "./components/ui/sonner";
import { Book } from "./lib/bookData";

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] =
    useState<PageType>(user?.role === 'admin' ? "admin" : "home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(
    null,
  );
  const [viewingUserId, setViewingUserId] = useState<
    string | null
  >(null);
  const [viewingDiscussionId, setViewingDiscussionId] = useState<
    string | null
  >(null);
  const [previousPage, setPreviousPage] = useState<PageType>("help");

  // Ensure scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage, viewingUserId, viewingDiscussionId]);

  // Set default page for admin users to admin panel
  useEffect(() => {
    if (user?.role === 'admin' && currentPage === 'home') {
      setCurrentPage('admin');
    }
  }, [user?.role, currentPage]);

  if (!user) {
    return <Login />;
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage("search");
    window.scrollTo(0, 0);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseBookModal = () => {
    setSelectedBook(null);
  };

  const handleViewUser = (userId: string) => {
    setSelectedBook(null); // Close book modal if open
    setViewingUserId(userId);
    window.scrollTo(0, 0);
  };

  const handleBackToMain = () => {
    setViewingUserId(null);
    window.scrollTo(0, 0);
  };

  const handleViewDiscussion = (discussionId: string) => {
    setViewingDiscussionId(discussionId);
    window.scrollTo(0, 0);
  };

  const handleBackToCommunity = () => {
    setViewingDiscussionId(null);
    window.scrollTo(0, 0);
  };

  const renderCurrentPage = () => {
    // If viewing another user's profile, show UserProfileView
    if (viewingUserId) {
      return (
        <UserProfileView
          userId={viewingUserId}
          onBack={handleBackToMain}
        />
      );
    }

    // If viewing a discussion, show DiscussionDetailsPage
    if (viewingDiscussionId) {
      return (
        <DiscussionDetailsPage
          discussionId={viewingDiscussionId}
          onBack={handleBackToCommunity}
          onBookSelect={handleBookSelect}
          onViewUser={handleViewUser}
        />
      );
    }

    switch (currentPage) {
      case "admin":
        return <AdminPanel />;
      case "home":
        return (
          <HomePage
            onSearch={handleSearch}
            onBookSelect={handleBookSelect}
            onViewUser={handleViewUser}
          />
        );
      case "search":
        return (
          <SearchPage
            initialQuery={searchQuery}
            onBookSelect={handleBookSelect}
            onViewUser={handleViewUser}
          />
        );
      case "profile":
        return (
          <UserProfile onViewUser={handleViewUser} onPageChange={handlePageChange} />
        );
      case "browse":
        return (
          <BrowseBooksPage
            onBookSelect={handleBookSelect}
            onViewUser={handleViewUser}
          />
        );
      case "recommendations":
        return (
          <RecommendationsPage
            onBookSelect={handleBookSelect}
            onViewUser={handleViewUser}
          />
        );
      case "reading-lists":
        return (
          <ReadingListsPage
            onBookSelect={handleBookSelect}
            onViewUser={handleViewUser}
          />
        );
      case "community":
        return (
          <CommunityPage
            onBookSelect={handleBookSelect}
            onViewUser={handleViewUser}
            onViewDiscussion={handleViewDiscussion}
          />
        );
      case "help":
        return <HelpCenterPage onPageChange={handlePageChange} />;
      case "privacy":
        return <PrivacyPolicyPage />;
      case "terms":
        return <TermsOfServicePage />;
      case "contact":
        return <ContactUsPage onPageChange={handlePageChange} />;
      case "help-getting-started-account":
        return <HelpGettingStartedAccount onBack={() => handlePageChange(previousPage)} />;
      case "help-getting-started-profile":
        return <HelpGettingStartedProfile onBack={() => handlePageChange(previousPage)} onPageChange={handlePageChange} />;
      case "help-getting-started-library":
        return <HelpGettingStartedLibrary onBack={() => handlePageChange(previousPage)} />;
      case "help-getting-started-recommendations":
        return <HelpGettingStartedRecommendations onBack={() => handlePageChange(previousPage)} />;
      case "help-reading-lists-creating":
        return <HelpReadingListsCreating onBack={() => handlePageChange(previousPage)} />;
      case "help-reading-lists-organizing":
        return <HelpReadingListsOrganizing onBack={() => handlePageChange(previousPage)} />;
      case "help-reading-lists-sharing":
        return <HelpReadingListsSharing onBack={() => handlePageChange(previousPage)} />;
      case "help-reading-lists-tags":
        return <HelpReadingListsTags onBack={() => handlePageChange(previousPage)} />;

      case "help-community-discussions":
        return <HelpCommunityDiscussions onBack={() => handlePageChange(previousPage)} />;
      case "help-community-reviews":
        return <HelpCommunityReviews onBack={() => handlePageChange(previousPage)} />;
      case "help-community-following":
        return <HelpCommunityFollowing onBack={() => handlePageChange(previousPage)} />;
      case "help-account-managing-profile":
        return <HelpAccountManagingProfile onBack={() => handlePageChange(previousPage)} />;
      case "help-account-privacy-settings":
        return <HelpAccountPrivacySettings onBack={() => handlePageChange(previousPage)} />;
      case "help-account-notifications":
        return <HelpAccountNotifications onBack={() => handlePageChange(previousPage)} />;
      case "help-account-deletion":
        return <HelpAccountDeletion onBack={() => handlePageChange(previousPage)} />;
      case "help-privacy-data-policy":
        return <HelpPrivacyDataPolicy onBack={() => handlePageChange(previousPage)} />;
      case "help-privacy-account-security":
        return <HelpPrivacyAccountSecurity onBack={() => handlePageChange(previousPage)} />;
      case "help-privacy-data-sharing":
        return <HelpPrivacyDataSharing onBack={() => handlePageChange(previousPage)} />;
      case "help-privacy-reporting":
        return <HelpPrivacyReporting onBack={() => handlePageChange(previousPage)} />;
      default:
        return (
          <HomePage
            onSearch={handleSearch}
            onBookSelect={handleBookSelect}
            onViewUser={handleViewUser}
          />
        );
    }
  };

  const handlePageChange = (page: PageType) => {
    // Track previous page for help topics navigation
    const helpPages: PageType[] = [
      "help-getting-started-account",
      "help-getting-started-profile",
      "help-getting-started-library",
      "help-getting-started-recommendations",
      "help-reading-lists-creating",
      "help-reading-lists-organizing",
      "help-reading-lists-sharing",
      "help-reading-lists-tags",
      "help-community-discussions",
      "help-community-reviews",
      "help-community-following",
      "help-account-managing-profile",
      "help-account-privacy-settings",
      "help-account-notifications",
      "help-account-deletion",
      "help-privacy-data-policy",
      "help-privacy-account-security",
      "help-privacy-data-sharing",
      "help-privacy-reporting"
    ];
    
    // If navigating to a help page, remember where we came from
    if (helpPages.includes(page)) {
      setPreviousPage(currentPage);
    }
    
    setCurrentPage(page);
    // Clear any active views when navigating
    setViewingUserId(null);
    setViewingDiscussionId(null);
    
    // Scroll to top of page - use setTimeout to ensure it happens after React re-renders
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Migration Alert - Shows if database needs migration */}
      <MigrationAlert />
      
      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        user={user}
      />

      <main className={`flex-1 ${viewingDiscussionId ? 'w-full' : 'mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-4 sm:py-6 lg:py-8 max-w-[1600px]'}`}>
        {renderCurrentPage()}
      </main>

      <Footer onPageChange={handlePageChange} />

      {/* Book Details Modal */}
      <BookModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={handleCloseBookModal}
        onViewUser={handleViewUser}
        onBookSelect={handleBookSelect}
      />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}