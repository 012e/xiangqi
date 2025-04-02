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
Máy chủ sẽ phản hồi với trạng thái cập nhật của ván đấu thông qua STOMP topic `/topic/game/{id}` (xem bên dưới)

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
    - Trắng thắng (`white_win`)
      - `black_resign` - Đen đầu hàng.
      - `black_timeout` - Đen hết thời gian.
      - `black_checkmate` - Đen bị chiếu hết.
    - Đen thắng (`black_win`)
      - `white_resign` - Trắng đầu hàng.
      - `white_timeout` - Trắng hết thời gian.
      - `white_checkmate` - Trắng bị chiếu hết.
    - Hòa (`draw`)
      - `stalemate` - Hết nước đi hợp lệ, nhưng không bị chiếu (hòa do hết nước đi).
      - `insufficient_material` - Không đủ quân để chiếu hết (hòa do thiếu quân).
      - `fifty_move_rule` - Không có nước bắt quân hoặc đi tốt trong 50 nước liên tiếp (hòa do luật 50 nước).
      - `mutual_agreement` - Hai bên đồng ý hòa.

#### Ví dụ:
##### Đen thắng
```json
{
   "type": "State.GameEnd",
   "data": {
     "status": "black_win",
     "reason": "white_timeout"
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


