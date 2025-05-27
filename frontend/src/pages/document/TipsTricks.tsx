const TipsTricks: React.FC = () => {
  return (
    <div className="min-w-[900px] text-foreground">
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Mẹo và thủ thuật chơi cờ tướng</h1>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <p>
            ✅ **Giữ chặt Xe**: Xe là quân mạnh nhất, nên ưu tiên giữ và sử dụng để khống chế bàn cờ.
          </p>
          <p>
            ✅ **Không vội dùng Tốt**: Giữ Tốt đúng vị trí sẽ cản bước tấn công và mở thế tấn công sau.
          </p>
          <p>
            ✅ **Khai cuộc hợp lý**: Mở Xe hoặc Pháo sớm giúp kiểm soát trung tâm.
          </p>
          <p>
            ✅ **Dụ đối phương phạm sai lầm**: Bẫy bằng cách nhử quân hoặc tạo thế mời ăn để phản đòn.
          </p>
          <p>
            ✅ **Quan sát toàn cục**: Đừng chỉ tập trung một bên – luôn để mắt cả hai cánh và thế phòng thủ.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TipsTricks;
