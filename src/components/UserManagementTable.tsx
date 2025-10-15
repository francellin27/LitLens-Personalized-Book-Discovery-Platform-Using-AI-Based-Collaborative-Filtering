import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Edit, Trash2, Users as UsersIcon, Shield } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  booksRead: number;
}

interface UserManagementTableProps {
  users: User[];
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
  type?: 'users' | 'admins';
}

export function UserManagementTable({ 
  users, 
  onEditUser, 
  onDeleteUser,
  type = 'users'
}: UserManagementTableProps) {
  
  const isAdmin = type === 'admins';

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {isAdmin ? (
          <Shield className="w-16 h-16 text-muted-foreground opacity-30 mb-4" />
        ) : (
          <UsersIcon className="w-16 h-16 text-muted-foreground opacity-30 mb-4" />
        )}
        <h3 className="text-lg text-muted-foreground mb-1">
          {isAdmin ? 'No Administrators Found' : 'No Users Found'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isAdmin ? 'Add administrators to manage the platform' : 'Start adding users to the platform'}
        </p>
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
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '20%' }}>
                Email
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '13%' }}>
                Role
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '13%' }}>
                Join Date
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '11%' }}>
                Books Read
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-[#535050]" style={{ width: '15%' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr 
                key={user.id}
                className="border-b border-gray-100 hover:bg-[#faf9f7] transition-colors duration-150"
              >
                {/* Name */}
                <td className="py-4 px-4 align-top">
                  <span className="text-sm font-medium text-[#535050] leading-tight">
                    {user.name}
                  </span>
                </td>

                {/* Email */}
                <td className="py-4 px-4 align-top">
                  <span className="text-sm text-[#535050]">
                    {user.email}
                  </span>
                </td>

                {/* Role Badge - Center Aligned */}
                <td className="py-4 px-4 text-center align-top">
                  {isAdmin ? (
                    <Badge 
                      className="text-xs px-2.5 py-1 rounded-md border font-medium"
                      style={{ backgroundColor: '#879656', color: 'white', borderColor: '#879656' }}
                    >
                      Admin
                    </Badge>
                  ) : (
                    <Badge 
                      variant="secondary"
                      className="text-xs px-2.5 py-1 rounded-md font-medium bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      User
                    </Badge>
                  )}
                </td>

                {/* Join Date */}
                <td className="py-4 px-4 align-top">
                  <span className="text-sm text-[#535050] whitespace-nowrap">
                    {new Date(user.joinDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </td>

                {/* Books Read - Center Aligned */}
                <td className="py-4 px-4 text-center align-top">
                  <span className="text-sm font-medium text-[#535050]">
                    {user.booksRead}
                  </span>
                </td>

                {/* Actions - Right Aligned */}
                <td className="py-4 px-4 text-right align-top">
                  <div className="flex items-center justify-end gap-2">
                    {onEditUser && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditUser(user)}
                        className="h-8 w-8 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDeleteUser && isAdmin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteUser(user)}
                        className="h-8 w-8 p-0 hover:bg-red-600 transition-all"
                        title="Remove Admin Privileges"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div 
            key={user.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
          >
            {/* Header: Name & Role */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#535050] leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user.email}
                </p>
              </div>
              {isAdmin ? (
                <Badge 
                  className="text-xs px-2.5 py-1 rounded-md border font-medium whitespace-nowrap"
                  style={{ backgroundColor: '#879656', color: 'white', borderColor: '#879656' }}
                >
                  Admin
                </Badge>
              ) : (
                <Badge 
                  variant="secondary"
                  className="text-xs px-2.5 py-1 rounded-md font-medium bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap"
                >
                  User
                </Badge>
              )}
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Join Date</p>
                <p className="text-sm text-[#535050]">
                  {new Date(user.joinDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Books Read</p>
                <p className="text-sm font-medium text-[#535050]">
                  {user.booksRead}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              {onEditUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditUser(user)}
                  className="flex-1 h-9 text-xs hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700"
                >
                  <Edit className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
              )}
              {onDeleteUser && isAdmin && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteUser(user)}
                  className="h-9 w-9 p-0"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
