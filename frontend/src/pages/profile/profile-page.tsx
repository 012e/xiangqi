import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfileMe } from '@/stores/profile-me.ts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UserPen } from 'lucide-react';
import { GameHistories } from '@/pages/profile/game-histories.tsx';
import { useParams } from 'react-router';
import { getProfileById } from '@/lib/profile/profile-games.ts';

/**
 * ProfilePage component handles both:
 * - Current user's profile: /user/profile/me
 * - Other users' profiles: /user/profile/:id (where :id is a numeric user ID)
 * 
 * Examples:
 * - /user/profile/me -> Shows current user's profile
 * - /user/profile/123 -> Shows user with ID 123's profile
 */

const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const [shortBio, setShortBio] = useState('');

  // Determine if we're viewing "me" or another user's profile
  const isViewingOwnProfile = id === 'me' || id === undefined;
  const numericId = !isViewingOwnProfile && id ? Number(id) : undefined;

  // Create dynamic query key and function based on the profile being viewed
  const { data: profile, isLoading, error } = useQuery({
    queryKey: isViewingOwnProfile ? ['profile', 'me'] : ['profile', numericId],
    queryFn: () => (isViewingOwnProfile ? getProfileMe() : getProfileById(numericId!)),
    enabled: isViewingOwnProfile || !!numericId, // Only run query if we have valid conditions
  });

  // Initialize shortBio from profile data when available (placeholder for future bio feature)
  React.useEffect(() => {
    // TODO: Initialize bio when API supports it
    // if (profile?.bio) {
    //   setShortBio(profile.bio);
    // }
  }, [profile]);
  const maxBioLength = 50;

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxBioLength) {
      setShortBio(e.target.value);
    }
  };


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      alert(`Bạn đã chọn ảnh: ${file.name}`);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="settings-profile w-full">
        <main className="p-8 m-4 min-w-[600px] bg-card text-card-foreground rounded-lg border border-border">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="settings-profile w-full">
        <main className="p-8 m-4 min-w-[600px] bg-card text-card-foreground rounded-lg border border-border">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-lg text-destructive mb-2">Error loading profile</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show message for invalid numeric ID
  if (!isViewingOwnProfile && numericId && isNaN(numericId)) {
    return (
      <div className="settings-profile w-full">
        <main className="p-8 m-4 min-w-[600px] bg-card text-card-foreground rounded-lg border border-border">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-destructive">Invalid user ID</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="settings-profile w-full">
      <main className="p-8 m-4 min-w-[600px] bg-card text-card-foreground rounded-lg border border-border">
        {/* Header */}
        <header>
          <div className='flex items-center jsutify-start gap-1'>
            <span>
              <UserPen className='w-7 h-auto'></UserPen>
            </span>
            <h1 className="text-2xl font-bold">
              {isViewingOwnProfile ? 'My Profile' : `${profile?.displayName || profile?.username || 'User'}'s Profile`}
            </h1>
          </div>
        </header>

        {/* Avatar & Bio */}
        <section >
          <div className="flex flex-wrap items-center justify-start">
            <div className="flex p-3 rounded-lg ">
              <div
                className={`relative inline-block border border-muted ${isViewingOwnProfile ? 'cursor-pointer' : ''}`}
                onClick={isViewingOwnProfile ? () => document.getElementById('avatarInput')?.click() : undefined}
              >
                <Avatar className="w-30 h-auto">
                  <AvatarImage src={profile?.picture} alt="image not found" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              {isViewingOwnProfile && (
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              )}
            </div>

            <div className="flex-1 p-4 border-muted rounded-lg">
              <label
                htmlFor="shortBio"
                className="block mb-2 font-bold text-foreground"
              >
                Introduction ({shortBio.length}/{maxBioLength})
              </label>
              <Textarea
                id="shortBio"
                value={shortBio}
                onChange={handleBioChange}
                placeholder={isViewingOwnProfile ? "Short bio about yourself." : "No bio available."}
                className="w-full h-20 p-2 border text-foreground rounded resize-none"
                readOnly={!isViewingOwnProfile}
              />
              {!isViewingOwnProfile && (
                <p className="text-xs text-muted-foreground mt-1">
                  This user hasn't added a bio yet.
                </p>
              )}
            </div>
          </div>
        </section>
        {/* Detail info */}
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">Information</h3>
          <div className="w-1/2">
            {/*content*/}
            <div className="grid grid-cols-2 gap-2">
              <div>Username</div>
              <div>
                <Input
                  value={profile?.username ?? 'None'}
                  readOnly
                  className="w-auto bg-muted text-foreground"
                ></Input>
              </div>

              <div>Name</div>
              <div>
                <Input
                  value={profile?.displayName ?? 'None'}
                  readOnly
                  className="w-auto bg-muted text-foreground"
                ></Input>
              </div>

              <div>Email</div>
              <div className="w-auto">
                <Input
                  value={profile?.email ?? 'None'}
                  readOnly
                  className="w-auto bg-muted text-foreground"
                ></Input>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">History</h3>
            { profile && <GameHistories userId={profile.id} />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
