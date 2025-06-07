import React, { useState } from 'react';
import ModernButton from '@/components/ui/modern-button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getProfileMe } from '@/stores/profile-me.ts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';



const ProfilePage: React.FC = () => {
  const [shortBio, setShortBio] = useState('');

  const { data: myProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileMe,
  });
  console.log(myProfile)
  const maxBioLength = 50;

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxBioLength) {
      setShortBio(e.target.value);
    }
  };

  const handleSave = () => {
    toast.success("Saved successfully!" ,{})
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
          <div>
            <h1 className="text-2xl font-bold mb-2">Profile</h1>
          </div>
        </header>

        {/* Avatar & Bio */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex-1 max-w-[150px] text-center p-4 rounded-lg">
              <div
                className="relative cursor-pointer inline-block"
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
              <textarea
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
          <div className="w-1/4">
            {/*content*/}
            <div className="grid grid-cols-2 gap-2">
              <div>Username</div>
              <div>{myProfile?.username ?? "Null"}</div>

              <div>Name</div>
              <div>{myProfile?.displayName ?? "Null"}</div>

              <div>Email</div>
              <div>{myProfile?.email}</div>
            </div>
           </div>
        </section>
        {/* Button Save & Cancel */}
        <div className="flex justify-end gap-4">
          <ModernButton onClick={handleSave} variant="CTA">
            Save
          </ModernButton>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
