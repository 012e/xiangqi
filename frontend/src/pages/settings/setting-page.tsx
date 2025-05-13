import React, { useState } from 'react';
import { useTheme } from '@/styles/ThemeContext';

import { SuccessPopup, ErrorPopup } from '@/components/popups';
import ModernButton from '@/components/ui/modern-button';
import SettingForm from './setting-form.tsx';
import { Separator } from '@/components/ui/separator';

const SettingProfile: React.FC = () => {
  const { setThemeByName } = useTheme();
  const [showPopupSaveSuccess, setShowPopupSaveSuccess] = useState(false);
  const [showPopupCancelSuccess, setShowPopupCancelSuccess] = useState(false);
  const [shortBio, setShortBio] = useState('');

  const maxBioLength = 50;

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxBioLength) {
      setShortBio(e.target.value);
    }
  };

  const handleSave = () => {
    setShowPopupSaveSuccess(true);
  };

  const handleCancel = () => {
    setShowPopupCancelSuccess(true);
  };

  const handleClosePopup = () => {
    setShowPopupSaveSuccess(false);
    setShowPopupCancelSuccess(false);
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
            <h1 className="text-2xl font-bold mb-2">Chỉnh sửa hồ sơ</h1>
            <p className="text-gray-600">
              Thay đổi ảnh đại diện và chọn chủ đề giao diện của bạn. Mọi thứ ở
              đây sẽ hiển thị trên hồ sơ công khai của bạn.
            </p>
          </div>
        </header>

        {/* Avatar & Bio */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex-1 max-w-[150px] text-center p-4 border border-gray-300 rounded-lg">
              <div
                className="relative cursor-pointer inline-block"
                onClick={() => document.getElementById('avatarInput')?.click()}
              >
                <img
                  src="https://placehold.co/150x150"
                  alt="Ảnh đại diện"
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

            <div className="flex-1 p-4 border border-gray-300 rounded-lg">
              <label
                htmlFor="shortBio"
                className="block mb-2 font-bold text-gray-700"
              >
                Giới thiệu ngắn ({shortBio.length}/{maxBioLength})
              </label>
              <textarea
                id="shortBio"
                value={shortBio}
                onChange={handleBioChange}
                placeholder="Giới thiệu ngắn sẽ hiển thị bên cạnh ảnh đại diện"
                className="w-full h-20 p-2 border border-gray-300 rounded resize-none"
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
            <button
              onClick={() => setThemeByName('light')}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-primary/90"
            >
              Light Theme
            </button>
            <button
              onClick={() => setThemeByName('dark')}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-secondary/90"
            >
              Dark Theme
            </button>
            <button
              onClick={() => setThemeByName('blueChill')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-secondary/90"
            >
              Blue Theme
            </button>
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
          <ModernButton onClick={handleCancel} variant="ghost">
            Hủy bỏ
          </ModernButton>
          <ModernButton onClick={handleSave} variant="CTA">
            Lưu
          </ModernButton>
        </div>
      </main>

      {/* Hiển thị pop-up thành công */}
      {showPopupSaveSuccess && (
        <SuccessPopup
          title="Lưu thành công!"
          message="Thay đổi của bạn đã được lưu thành công!"
          onClose={handleClosePopup}
        />
      )}
      {showPopupCancelSuccess && (
        <ErrorPopup
          title="Hủy thành công!"
          message="Thay đổi của bạn đã được hủy bỏ!"
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default SettingProfile;
