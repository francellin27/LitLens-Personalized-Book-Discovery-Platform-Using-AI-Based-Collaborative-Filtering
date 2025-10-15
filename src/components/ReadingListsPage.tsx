import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { BookGrid } from "./BookGrid";
import { bookData, Book } from "../lib/bookData";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Heart, 
  Clock, 
  Star, 
  Users, 
  Lock, 
  Trash2,
  Edit,
  Share,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface ReadingList {
  id: string;
  name: string;
  description: string;
  books: Book[];
  isPrivate: boolean;
  createdDate: string;
  updatedDate: string;
  color?: string;
}

interface ReadingListsPageProps {
  onBookSelect: (book: Book) => void;
  onViewUser: (userId: string) => void;
}

export function ReadingListsPage({ onBookSelect, onViewUser }: ReadingListsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<ReadingList | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newListPrivate, setNewListPrivate] = useState(false);

  // Mock reading lists data
  const [readingLists, setReadingLists] = useState<ReadingList[]>([
    {
      id: "1",
      name: "Currently Reading",
      description: "Books I'm actively reading right now",
      books: bookData.slice(0, 3),
      isPrivate: false,
      createdDate: "2024-01-15",
      updatedDate: "2024-01-20",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    },
    {
      id: "2", 
      name: "Want to Read",
      description: "My wishlist of books to read in the future",
      books: bookData.slice(3, 8),
      isPrivate: false,
      createdDate: "2024-01-10",
      updatedDate: "2024-01-18",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    },
    {
      id: "3",
      name: "Favorites",
      description: "My all-time favorite books",
      books: bookData.slice(8, 12),
      isPrivate: false,
      createdDate: "2024-01-05",
      updatedDate: "2024-01-16",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    },
    {
      id: "4",
      name: "Book Club Selections",
      description: "Books chosen for our monthly book club",
      books: bookData.slice(12, 15),
      isPrivate: true,
      createdDate: "2024-01-01",
      updatedDate: "2024-01-14",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    }
  ]);

  const filteredLists = useMemo(() => {
    if (!searchQuery) return readingLists;
    return readingLists.filter(list =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [readingLists, searchQuery]);

  const createNewList = () => {
    if (!newListName.trim()) return;

    const newList: ReadingList = {
      id: Date.now().toString(),
      name: newListName,
      description: newListDescription,
      books: [],
      isPrivate: newListPrivate,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    };

    setReadingLists(prev => [...prev, newList]);
    setNewListName("");
    setNewListDescription("");
    setNewListPrivate(false);
    setIsCreateDialogOpen(false);
  };

  const deleteList = (listId: string) => {
    setReadingLists(prev => prev.filter(list => list.id !== listId));
  };

  const removeBookFromList = (listId: string, book: Book) => {
    setReadingLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, books: list.books.filter(b => b.id !== book.id) }
        : list
    ));
  };

  const totalBooks = readingLists.reduce((sum, list) => sum + list.books.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Reading Lists</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Organize your reading journey with custom lists. Track your progress and discover new books.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{readingLists.length}</div>
            <div className="text-sm text-muted-foreground">Lists</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalBooks}</div>
            <div className="text-sm text-muted-foreground">Total Books</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {readingLists.find(l => l.name === "Currently Reading")?.books.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Reading Now</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {readingLists.filter(l => !l.isPrivate).length}
            </div>
            <div className="text-sm text-muted-foreground">Public Lists</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search reading lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Reading List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="list-name">List Name</Label>
                <Input
                  id="list-name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name..."
                />
              </div>
              <div>
                <Label htmlFor="list-description">Description</Label>
                <Textarea
                  id="list-description"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Describe your reading list..."
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="private-list"
                  checked={newListPrivate}
                  onCheckedChange={setNewListPrivate}
                />
                <Label htmlFor="private-list">Make this list private</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={createNewList} className="flex-1">
                  Create List
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reading Lists */}
      {selectedList ? (
        // Individual List View
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedList(null)}>
              ← Back to Lists
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit List
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share List
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => deleteList(selectedList.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">{selectedList.name}</CardTitle>
                    {selectedList.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="text-muted-foreground">{selectedList.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{selectedList.books.length} books</span>
                    <span>Updated {selectedList.updatedDate}</span>
                  </div>
                </div>
                <Badge className={selectedList.color} variant="secondary">
                  {selectedList.isPrivate ? "Private" : "Public"}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <BookGrid
            books={selectedList.books}
            onBookSelect={onBookSelect}
            onViewUser={onViewUser}
            showRemoveButton={true}
            onRemoveBook={(book) => removeBookFromList(selectedList.id, book)}
          />

          {selectedList.books.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">This list is empty</h3>
              <p className="text-muted-foreground mb-4">Start adding books to build your reading list</p>
              <Button>Browse Books</Button>
            </div>
          )}
        </div>
      ) : (
        // Lists Overview
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map((list) => (
            <Card 
              key={list.id} 
              className="cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setSelectedList(list)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                      {list.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {list.description}
                    </p>
                  </div>
                  <Badge className={list.color} variant="secondary">
                    {list.books.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Book Preview */}
                  <div className="flex -space-x-2">
                    {list.books.slice(0, 4).map((book) => (
                      <div
                        key={book.id}
                        className="w-8 h-12 rounded border-2 border-background overflow-hidden"
                      >
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {list.books.length > 4 && (
                      <div className="w-8 h-12 rounded border-2 border-background bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">+{list.books.length - 4}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Updated {list.updatedDate}</span>
                    <div className="flex items-center gap-1">
                      {list.isPrivate ? <Lock className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                      <span>{list.isPrivate ? "Private" : "Public"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredLists.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No lists found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or create a new reading list
          </p>
          <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
        </div>
      )}

      {readingLists.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No reading lists yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first reading list to start organizing your books
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First List
          </Button>
        </div>
      )}
    </div>
  );
}