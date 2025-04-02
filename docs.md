# Tài liệu API WebSocket Cờ vua

## Tổng quan
API WebSocket Cờ vua cho phép người dùng chơi cờ với máy tính bằng cách gửi và nhận nước đi theo thời gian thực. API giao tiếp bằng tin nhắn JSON, với một `enum` đại diện cho các trạng thái của ván đấu.


## Hành động
### Gửi nước đi
Để gửi nước đi, client phải gửi tin nhắn vào hàng đợi riêng của người chơi.

**Route:** `/user/{user_id}/game/{id}`

#### Ví dụ:
```json
{
  "from": "e2",
  "to": "e4"
}
```

### Nhận nước đi
Máy chủ sẽ phản hồi với trạng thái cập nhật của ván đấu thông qua STOMP topic:

---


## Trạng thái ván đấu (`State`)

**Route:** `/topic/game/{id}`


### Cấu trúc tin nhắn
Mỗi tin nhắn bao gồm hai trường chính:
```json
{
  "type": "State.EnumValue",
  "data": { ... }
}
```
- `type` (string): Đại diện cho trạng thái của ván đấu.
- `data` (object): Chứa dữ liệu liên quan đến trạng thái đó.

### `State.WhitePlay`
- Chỉ ra rằng đến lượt Trắng đi.

### `State.BlackPlay`
- Chỉ ra rằng đến lượt Đen đi.

#### Ví dụ:
```json
{
   "type": "State.BlackPlay",
   "data": {
     "from": "a4",
     "to": "a5"
   }
}
```

### `State.Error` Xử lý lỗi
Nếu một nước đi không hợp lệ được gửi, máy chủ sẽ trả về thông báo lỗi:
```json
{
  "type": "State.Error",
  "data": {
    "message": "Nước đi không hợp lệ"
  }
}
```

### `State.GameEnd`
- Chỉ ra rằng ván đấu đã kết thúc.
- Đối tượng `data` bao gồm:
  - `status` (string): Kết quả của ván đấu. Các giá trị có thể có:
    - `white_win`
    - `black_win`
    - `draw`
  - `reason` (string): Giải thích lý do kết thúc ván đấu.

#### Ví dụ:
##### Đen thắng
```json
{
   "type": "State.GameEnd",
   "data": {
     "status": "black_win",
     "reason": "Trắng hết thời gian"
   }
}
```

##### Hòa do hết nước đi (Stalemate)
```json
{
   "type": "State.GameEnd",
   "data": {
     "status": "draw",
     "reason": "Đen bị cờ bí (stalemate)"
   }
}
```

---


