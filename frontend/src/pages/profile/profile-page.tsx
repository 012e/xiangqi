import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfileMe } from '@/stores/profile-me.ts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UserPen } from 'lucide-react';
import { GameHistories } from '@/pages/profile/game-histories.tsx';

const ProfilePage: React.FC = () => {
  const [shortBio, setShortBio] = useState('');

  const { data: myProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileMe,
  });
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

  return (
    <div className="settings-profile w-full">
      <main className="p-8 m-4 min-w-[600px] bg-card text-card-foreground rounded-lg border border-border">
        {/* Header */}
        <header>
          <div className='flex items-center jsutify-start gap-1'>
            <span>
              <UserPen className='w-7 h-auto'></UserPen>
            </span>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
        </header>

        {/* Avatar & Bio */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex-1 max-w-[150px] text-center p-4 rounded-lg pt-13">
              <div
                className="relative cursor-pointer inline-block border border-muted "
                onClick={() => document.getElementById('avatarInput')?.click()}
              >
                <Avatar className="size-full">
                  <AvatarImage src={myProfile?.picture} alt="image not found" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
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
                placeholder="Short bio about yourself."
                className="w-full h-20 p-2 border text-foreground rounded resize-none"
              />
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
                  value={myProfile?.username ?? 'None'}
                  readOnly
                  className="w-full bg-muted text-foreground"
                ></Input>
              </div>

              <div>Name</div>
              <div>
                <Input
                  value={myProfile?.displayName ?? 'None'}
                  readOnly
                  className="w-full bg-muted text-foreground"
                ></Input>
              </div>

              <div>Email</div>
              <div className="w-auto">
                <Input
                  value={myProfile?.email ?? 'None'}
                  readOnly
                  className="w-full bg-muted text-foreground"
                ></Input>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">History</h3>
            { myProfile && <GameHistories userId={myProfile.id} />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
