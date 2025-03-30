# XIANGQI

-   Bàn cờ: <a href="https://github.com/012e/react-xiangqiboard">React-xiangqiboard</a>
-   Logic bàn cờ: <a href="https://github.com/012e/chess.js">Chess.js</a>
-   Frontend + Backend: <a href="https://github.com/012e/xiangqi">Xiangqi</a>

# Chi tiết cách chạy Frontend và Backend

## Frontend

-   Clone git về: <a href="https://github.com/012e/xiangqi">xiangqi</a>
-   Mở terminal tại thư mục **xiangqi/frontend**
-   \*Nếu chưa tải **_pnpm_** (đã tải rồi bỏ qua bước này):
    **_npm install -g pnpm@latest_**
-   Tải các thư viện cần thiết: **_pnpm i_**
-   Run frontend: **_pnpm run dev_**

## Backend

-   Clone git về: <a href="https://github.com/012e/xiangqi">xiangqi</a>
-   Dùng IntelliJ (có thể dùng bất kỳ IDE nào ở đây chúng tôi dùng IntelliJ)
-   Mở terminal tại thư mục **_xiangqi/backend_**
-   Download **_Docker_** tại flugin (đã tải docker thì bỏ qua)
-   Download **_docker desktop_**
-   Click vào nút ">>" ngang với service trong xiangqi/backend/compose.yaml (hoặc chạy lệnh trong terminal: **_docker-compose run_**)
-   Vào website và xem thành quả: <a href="http://localhost:8080/swagger-ui/index.html">Swagger UI</a>
