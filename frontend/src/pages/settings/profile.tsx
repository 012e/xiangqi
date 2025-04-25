import React, { useState } from 'react';
import { createSettingsStyles, createGlobalStyles } from '../../styles';
import { useTheme } from '@/themes/ThemeContext';
import { ThemeName, themes } from '@/themes/themes';
import { SuccessPopup, ErrorPopup } from '@/components/popups';
import ModernButton from '@/components/ui/modern-button';

const SettingProfile: React.FC = () => {
  const { theme, setThemeByName } = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const settingsStyles = createSettingsStyles(theme);

  const [showPopupSaveSuccess, setShowPopupSaveSuccess] = useState(false);
  const [showPopupCancelSuccess, setShowPopupCancelSuccess] = useState(false);
  const [shortBio, setShortBio] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('light');
  const maxBioLength = 50;

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxBioLength) {
      setShortBio(e.target.value);
    }
  };

  const handleChange = (theme: string) => {
    setSelectedTheme(theme);
    setThemeByName(theme as ThemeName);
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
      <main style={globalStyles.pageContainer}>
        {/* Header */}
        <header>
          <div>
            <h1 style={globalStyles.titlePage}>Chỉnh sửa hồ sơ</h1>
            <p style={{ fontSize: '1rem', color: theme.colors.text }}>
              Thay đổi ảnh đại diện và chọn chủ đề giao diện của bạn. Mọi thứ ở
              đây sẽ hiển thị trên hồ sơ công khai của bạn.
            </p>
          </div>
        </header>

        {/* Avatar & Bio */}
        <section style={globalStyles.section}>
          <div style={settingsStyles.profileEditContainer}>
            <div style={settingsStyles.avatar}>
              <div
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
                onClick={() => document.getElementById('avatarInput')?.click()}
              >
                <img
                  src="https://placehold.co/150x150"
                  alt="Ảnh đại diện"
                  style={{
                    ...settingsStyles.avatarImage,
                    transition: 'opacity 0.3s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    pointerEvents: 'none',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '0')}
                >
                  <i
                    className="fa fa-camera-retro fa-5x"
                    style={{
                      fontSize: '2rem',
                      color: '#000',
                    }}
                  ></i>
                </div>
              </div>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </div>

            <div style={settingsStyles.bio}>
              <label
                htmlFor="shortBio"
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Giới thiệu ngắn ({shortBio.length}/{maxBioLength})
              </label>
              <textarea
                id="shortBio"
                value={shortBio}
                onChange={handleBioChange}
                placeholder="Giới thiệu ngắn sẽ hiển thị bên cạnh ảnh đại diện"
                style={globalStyles.textArea}
              />
            </div>
          </div>
        </section>

        {/* Detail info */}
        <section style={globalStyles.section}>
          <h3 style={globalStyles.titleSection}>Thông tin chi tiết</h3>
          <div style={globalStyles.grid}>
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
        <section style={globalStyles.section}>
          <h3 style={globalStyles.titleSection}>Chủ đề giao diện</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px',
            }}
          >
            {Object.keys(themes).map((themeKey) => (
              <div
                key={themeKey}
                onClick={() => handleChange(themeKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 15px',
                  border: '2px solid',
                  borderColor:
                    selectedTheme === themeKey
                      ? theme.colors.background
                      : '#ddd',
                  borderRadius: '8px',
                  backgroundColor: themes[themeKey as ThemeName].colors.main,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow:
                    selectedTheme === themeKey
                      ? '0 4px 8px rgba(0, 0, 0, 0.2)'
                      : 'none',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.02)')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                <span
                  style={{
                    fontWeight: 'bold',
                    color: themes[themeKey as ThemeName].colors.text,
                  }}
                >
                  {themeKey}
                </span>
                {selectedTheme === themeKey && (
                  <span
                    style={{
                      color: theme.colors.text,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    ✔
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Button Save & Cancel */}
        <div
          style={{
            ...globalStyles.listButtonsContainer,
            marginTop: '20px',
          }}
        >
          <ModernButton
            onClick={handleCancel}
            variant="ghost"
            style={{ marginRight: '10px' }}
          >
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
