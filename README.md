# XIANGQI

- Bàn cờ: <a href="https://github.com/012e/react-xiangqiboard">React-xiangqiboard</a>
- Logic bàn cờ: <a href="https://github.com/012e/chess.js">Chess.js</a>
- Frontend + Backend: <a href="https://github.com/012e/xiangqi">Xiangqi</a>

---

# Chi tiết cách chạy Frontend và Backend

## Frontend

- Clone git về: <a href="https://github.com/012e/xiangqi">xiangqi</a>
- Mở terminal tại thư mục `xiangqi/frontend`
- \*Nếu chưa tải **_pnpm_** (đã tải rồi bỏ qua bước này):
  `npm install -g pnpm@latest`
- Tải các thư viện cần thiết: `pnpm i`
- Run frontend: `pnpm dev`

## Backend

- Clone git về: <a href="https://github.com/012e/xiangqi">xiangqi</a>
- Dùng IntelliJ (có thể dùng bất kỳ IDE nào ở đây chúng tôi dùng IntelliJ)
- Mở terminal tại thư mục `xiangqi/backend`
- Download **_Docker_** tại plugin (đã tải docker thì bỏ qua)
- Download **_docker desktop_**
- Click vào nút ![image](https://github.com/user-attachments/assets/3884b122-3af4-405a-9db0-32d9967cd67e) ngang với service trong xiangqi/backend/compose.yaml (hoặc chạy lệnh trong terminal: `docker-compose run`)
- Vào website và xem thành quả: <a href="http://localhost:8080/swagger-ui/index.html">Swagger UI</a>

---

# Hướng dẫn sử dụng _test_ cho logic bàn cờ

- Tải các thư viện cần thiết: `pnpm i`
- Run test: `pnpm test`
  (Các test sử dụng để kiểm tra tính đúng đắn của các hàm logic)

---

# Documentation

- Có thể xem chi tiết hành động/topic khi sử dụng websocket ở [docs.md](./docs.md)
