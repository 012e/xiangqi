import React, { useState } from 'react';
import { useTheme } from '@/styles/ThemeContext';

import ModernButton from '@/components/ui/modern-button';
import SettingForm from './setting-form.tsx';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.tsx';
import { useQuery } from '@tanstack/react-query';
import { getProfileMe } from '@/stores/profile-me.ts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';



const SettingProfile: React.FC = () => {
  const { setThemeByName } = useTheme();
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
        <Separator></Separator>

        <header>
          <div>
            <h1 className="text-2xl font-bold my-2">Settings</h1>
          </div>
        </header>

        <section>
          <div className="flex py-5">
            <SettingForm />
          </div>
        </section>

        {/* Theme */}
        <section className="mb-8">
          <h3 className="text-lg font-bold ">Theme</h3>
          <div className="flex gap-4">
            <Button
              onClick={() => setThemeByName('light')}
              className="px-4 py-2 border border-border rounded-lg text-background bg-foreground hover:bg-primary/90"
            >
              Light Theme
            </Button>
            <Button
              onClick={() => setThemeByName('dark')}
              className="px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-secondary/90"
            >
              Dark Theme
            </Button>
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

export default SettingProfile;
