import React, { useState } from 'react';
import { useTheme } from '@/styles/ThemeContext';

import ModernButton from '@/components/ui/modern-button';
import SettingForm from './setting-form.tsx';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.tsx';

const SettingProfile: React.FC = () => {
  const { setThemeByName } = useTheme();
  const [shortBio, setShortBio] = useState('');

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
    <div className="settings-profile w-screen">
      <main className="p-8 m-4 min-w-[600px] bg-card text-card-foreground rounded-lg border border-border">
        {/* Header */}
        <header>
          <div>
            <h1 className="text-2xl font-bold mb-2">Setting</h1>
            <p className="text-foreground">
              Thay đổi ảnh đại diện và chọn chủ đề giao diện của bạn. Mọi thứ ở
              đây sẽ hiển thị trên hồ sơ công khai của bạn.
            </p>
          </div>
        </header>

        {/* Avatar & Bio */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex-1 max-w-[150px] text-center p-4 border border-muted-foreground rounded-lg">
              <div
                className="relative cursor-pointer inline-block"
                onClick={() => document.getElementById('avatarInput')?.click()}
              >
                <img
                  src="https://placehold.co/150x150"
                  alt="image not found"
                  className="w-full h-auto rounded-full shadow-md transition-opacity hover:opacity-70"
                />
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
                Giới thiệu ngắn ({shortBio.length}/{maxBioLength})
              </label>
              <textarea
                id="shortBio"
                value={shortBio}
                onChange={handleBioChange}
                placeholder="Giới thiệu ngắn sẽ hiển thị bên cạnh ảnh đại diện"
                className="w-full h-20 p-2 border text-foreground rounded resize-none"
              />
            </div>
          </div>
        </section>

        {/* Detail info */}
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">Thông tin chi tiết</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Ngày tham gia:</strong>
            </div>
            <div>14 thg 12, 2018</div>

            <div>
              <strong>Tên tài khoản:</strong>
            </div>
            <div>kiddora</div>
          </div>
        </section>

        {/* Theme */}
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">Chủ đề giao diện</h3>
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
            {/*<Button*/}
            {/*  onClick={() => setThemeByName('blueChill')}*/}
            {/*  className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-secondary/90"*/}
            {/*>*/}
            {/*  Blue Theme*/}
            {/*</Button>*/}
          </div>
        </section>

        <section>
          <Separator></Separator>
          <div className="flex py-5">
            <SettingForm />
          </div>
        </section>
        {/* Button Save & Cancel */}
        <div className="flex justify-end gap-4">
          <ModernButton onClick={handleSave} variant="CTA">
            Lưu
          </ModernButton>
        </div>
      </main>
    </div>
  );
};

export default SettingProfile;
