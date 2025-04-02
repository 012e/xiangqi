<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Tài liệu API WebSocket Cờ vua](#tài-liu-api-websocket-c-vua)
   * [Tổng quan](#tng-quan)
   * [Kết nối WebSocket](#kt-ni-websocket)
   * [Enum Trạng thái ván đấu (`State`)](#enum-trng-thái-ván-u-state)
      + [Cấu trúc tin nhắn](#cu-trúc-tin-nhn)
      + [`State.WhitePlay`](#statewhiteplay)
      + [`State.BlackPlay`](#stateblackplay)
         - [Ví dụ:](#ví-d)
      + [`State.GameEnd`](#stategameend)
         - [Ví dụ:](#ví-d-1)
            * [Đen thắng](#en-thng)
            * [Hòa do hết nước đi (Stalemate)](#hòa-do-ht-nc-i-stalemate)
   * [Hành động](#hành-ng)
      + [Gửi nước đi](#gi-nc-i)
         - [Ví dụ:](#ví-d-2)
      + [Nhận nước đi](#nhn-nc-i)
   * [Xử lý lỗi](#x-lý-li)

<!-- TOC end -->

<!-- TOC --><a name="tài-liu-api-websocket-c-vua"></a>
# Tài liệu API WebSocket Cờ vua

<!-- TOC --><a name="tng-quan"></a>
## Tổng quan
API WebSocket Cờ vua cho phép người dùng chơi cờ với máy tính bằng cách gửi và nhận nước đi theo thời gian thực. API giao tiếp bằng tin nhắn JSON, với một `enum` đại diện cho các trạng thái của ván đấu.

<!-- TOC --><a name="kt-ni-websocket"></a>
## Kết nối WebSocket
- **Endpoint:** `wss://yourserver.com/chess`
- **Giao thức:** Tin nhắn WebSocket định dạng JSON
- **Chủ đề STOMP:** `/topic/game/{id}`

---

<!-- TOC --><a name="enum-trng-thái-ván-u-state"></a>
## Enum Trạng thái ván đấu (`State`)

<!-- TOC --><a name="cu-trúc-tin-nhn"></a>
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

<!-- TOC --><a name="statewhiteplay"></a>
### `State.WhitePlay`
- Chỉ ra rằng đến lượt Trắng đi.

<!-- TOC --><a name="stateblackplay"></a>
### `State.BlackPlay`
- Chỉ ra rằng đến lượt Đen đi.

<!-- TOC --><a name="ví-d"></a>
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

<!-- TOC --><a name="stategameend"></a>
### `State.GameEnd`
- Chỉ ra rằng ván đấu đã kết thúc.
- Đối tượng `data` bao gồm:
  - `status` (string): Kết quả của ván đấu. Các giá trị có thể có:
    - `white_win`
    - `black_win`
    - `draw`
  - `reason` (string): Giải thích lý do kết thúc ván đấu.

<!-- TOC --><a name="ví-d-1"></a>
#### Ví dụ:
<!-- TOC --><a name="en-thng"></a>
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

<!-- TOC --><a name="hòa-do-ht-nc-i-stalemate"></a>
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

<!-- TOC --><a name="hành-ng"></a>
## Hành động
<!-- TOC --><a name="gi-nc-i"></a>
### Gửi nước đi
Để gửi nước đi, client phải gửi tin nhắn vào hàng đợi riêng của người chơi.

- **Route:** `/user/{user_id}/game/{id}`

<!-- TOC --><a name="ví-d-2"></a>
#### Ví dụ:
```json
{
  "from": "e2",
  "to": "e4"
}
```

<!-- TOC --><a name="nhn-nc-i"></a>
### Nhận nước đi
Máy chủ sẽ phản hồi với trạng thái cập nhật của ván đấu thông qua STOMP topic:

- **Route:** `/topic/game/{id}`

---

<!-- TOC --><a name="x-lý-li"></a>
## Xử lý lỗi
Nếu một nước đi không hợp lệ được gửi, máy chủ sẽ trả về thông báo lỗi:
```json
{
  "type": "State.Error",
  "data": {
    "message": "Nước đi không hợp lệ"
  }
}
```


