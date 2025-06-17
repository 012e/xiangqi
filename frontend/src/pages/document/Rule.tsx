const Rule: React.FC = () => {
  return (
    <div className="w-full text-foreground">
      <main className="p-8 m-4 bg-card text-card-foreground rounded-lg border border-border">
        <h1 className="text-2xl font-bold mb-4">Luật chơi cờ tướng</h1>
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Giới thiệu */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Giới thiệu</h2>
            <p>
              Cờ tướng là trò chơi chiến thuật giữa hai người chơi, sử dụng bàn
              cờ 9x10 và các quân cờ có ký hiệu riêng. Mỗi bên có 16 quân với
              mục tiêu chiếu tướng (bắt tướng) đối phương.
            </p>
          </section>

          {/* Bố trí bàn cờ */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Bố trí bàn cờ</h2>
            <p>
              Bàn cờ gồm 9 cột (từ a đến i) và 10 hàng (từ 0 đến 9), chia thành
              hai phần bởi "sông". Mỗi bên có "cung" 3x3 nơi Tướng và Sĩ hoạt
              động.
            </p>
            <img
              src="/images/xiangqi-board.png"
              alt="Bàn cờ tướng"
              width={600}
              height={400}
              className="rounded shadow"
            />
          </section>

          {/* Các quân cờ và cách di chuyển */}
          <section>
            <h2 className="text-xl font-semibold mb-2">
              Các quân cờ và cách di chuyển
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Tướng (將/帥)</strong>: Di chuyển một ô trong cung,
                không được đối mặt trực tiếp với Tướng đối phương.
              </li>
              <li>
                <strong>Sĩ (仕/士)</strong>: Di chuyển chéo một ô trong cung.
              </li>
              <li>
                <strong>Tượng (相/象)</strong>: Di chuyển chéo hai ô, không qua
                sông, không bị cản.
              </li>
              <li>
                <strong>Xe (車)</strong>: Di chuyển ngang hoặc dọc không giới
                hạn, không bị cản.
              </li>
              <li>
                <strong>Mã (馬)</strong>: Di chuyển một ô ngang/dọc rồi một ô
                chéo, không bị cản ở chân.
              </li>
              <li>
                <strong>Pháo (炮)</strong>: Di chuyển như Xe, nhưng khi ăn phải
                "nhảy" qua đúng một quân.
              </li>
              <li>
                <strong>Tốt (兵/卒)</strong>: Trước khi qua sông, chỉ đi thẳng
                một ô; sau khi qua sông, có thể đi ngang một ô.
              </li>
            </ul>
          </section>

          {/* Luật chơi cơ bản */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Luật chơi cơ bản</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Bên đỏ đi trước.</li>
              <li>
                Không được để hai Tướng đối mặt trực tiếp nếu không có quân nào
                chắn giữa.
              </li>
              <li>Không được lặp lại nước cờ quá 3 lần liên tiếp gây hòa.</li>
              <li>
                Không được chiếu tướng liên tục quá 3 lần nếu không thay đổi thế
                cờ.
              </li>
              <li>
                Ván cờ kết thúc khi một bên chiếu bí Tướng đối phương hoặc đối
                phương không còn nước đi hợp lệ.
              </li>
            </ul>
          </section>

          {/* Kết luận */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Kết luận</h2>
            <p>
              Nắm vững luật chơi cờ tướng là bước đầu tiên để trở thành kỳ thủ
              giỏi. Hãy luyện tập thường xuyên và khám phá các chiến thuật để
              nâng cao kỹ năng của bạn.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Rule;
