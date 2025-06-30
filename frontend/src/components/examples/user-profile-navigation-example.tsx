import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Example component showing different ways to navigate to user profiles
 */
export function UserProfileNavigationExample() {
  const navigate = useNavigate();

  // Example user data
  const currentUserId = 123;
  const otherUserId = 456;
  const exampleUser = {
    id: 789,
    username: 'chess_master',
    displayName: 'Chess Master',
    picture: 'https://example.com/avatar.jpg'
  };

  const handleProfileNavigation = (userId: number | 'me') => {
    if (userId === 'me') {
      navigate('/user/profile/me');
    } else {
      navigate(`/user/profile/${userId}`);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">User Profile Navigation Examples</h2>
      
      {/* Example 1: Navigate to own profile */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">1. Navigate to Own Profile</h3>
        <Button onClick={() => handleProfileNavigation('me')}>
          View My Profile
        </Button>
      </div>

      {/* Example 2: Navigate to specific user's profile */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">2. Navigate to Specific User's Profile</h3>
        <Button onClick={() => handleProfileNavigation(currentUserId)}>
          View User {currentUserId}'s Profile
        </Button>
      </div>

      {/* Example 3: Clickable username (like in game history) */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">3. Clickable Username</h3>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={exampleUser.picture} />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
          <span 
            className="font-semibold cursor-pointer text-primary hover:text-primary/80"
            onClick={() => handleProfileNavigation(exampleUser.id)}
          >
            {exampleUser.username}
          </span>
        </div>
      </div>

      {/* Example 4: Programmatic navigation with event handling */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">4. With Event Handling (like in game history)</h3>
        <div 
          className="p-2 bg-muted rounded cursor-pointer"
          onClick={() => console.log('Container clicked')}
        >
          <p>This is a clickable container</p>
          <span 
            className="font-semibold cursor-pointer text-primary hover:text-primary/80"
            onClick={(e) => {
              e.stopPropagation(); // Prevent container click
              handleProfileNavigation(otherUserId);
            }}
          >
            Click this username to navigate (prevents container click)
          </span>
        </div>
      </div>

      {/* Example 5: Dynamic user list */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">5. Dynamic User List</h3>
        {[
          { id: 100, username: 'player1' },
          { id: 200, username: 'player2' },
          { id: 300, username: 'player3' }
        ].map(user => (
          <div key={user.id} className="flex items-center justify-between p-2 border-b">
            <span>{user.username}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleProfileNavigation(user.id)}
            >
              View Profile
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Usage example in other components:
export const useUserProfileNavigation = () => {
  const navigate = useNavigate();

  const navigateToProfile = (userId: number | 'me') => {
    if (userId === 'me') {
      navigate('/user/profile/me');
    } else {
      navigate(`/user/profile/${userId}`);
    }
  };

  return { navigateToProfile };
};
