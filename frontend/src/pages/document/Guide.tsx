const Guide: React.FC = () => {
  return (
    <div className="min-w-[900px] text-foreground">
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Hướng dẫn chơi cờ tướng cho người mới</h1>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <p>
            Cờ tướng là trò chơi chiến thuật giữa hai người chơi, sử dụng bàn cờ 9x10 và các quân cờ có ký hiệu riêng. Mỗi bên có 16 quân với mục tiêu chiếu tướng (bắt tướng) đối phương.
          </p>
          <p>
            Bước đầu tiên, bạn cần nắm vị trí quân cơ bản: Tướng đặt giữa cung (3 ô giữa hàng cuối), hai bên là Sĩ – Tượng – Xe – Mã – Pháo và Tốt.
          </p>
          <p>
            Cách di chuyển mỗi quân đều có quy tắc riêng. Ví dụ, Xe đi ngang/dọc không giới hạn, Mã đi theo hình chữ L, Pháo cần “nhảy” qua quân để ăn.
          </p>
          <p>
            Người chơi đi trước là bên đỏ. Lượt đi luân phiên, mục tiêu là chiếu bí Tướng đối phương để thắng.
          </p>
          <p>
            Hãy luyện tập với người mới chơi hoặc chơi với máy để nắm bắt nhịp độ và chiến thuật cơ bản.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Guide;
