import logo from './logo.svg';
import './App.css';
import socketio from 'socket.io-client'
import {useState, useEffect} from 'react'
import Axios from 'axios';

function App() {

  const [socket, setSocket] = useState();

  const [random, setRandom] = useState();

  const [online, setOnline] = useState();

  const [current, setCurrent] = useState();

  const [room, setRoom] = useState();

  const [inp, setInp] = useState("");

  const [newMess, setNewMess] = useState();

  const [arrayMessage, setArrayMessage] = useState([]);

  const [caro, setCaro] = useState('');

  const [boards, setBoards] = useState();

  // Effect này chỉ chạy 1 lần đầu tiên 
  useEffect(() => {

    async function fetchData() {
        try {
          const api = await Axios.get("http://localhost:8000/api/users");

          // Lấy danh sách Board hiện có
          const board = await Axios.get("http://localhost:8000/boards");
          const data = api.data.data;

          setRandom(data);

          // Set Boards là một mảng
          setBoards(board.data.data);

          const num = Math.floor(Math.random() * 6);

          // Kết nối socket truyền vào iduser : _id và displayname là displayname
          const io = socketio('http://localhost:8000',
          { query: `iduser=${data[num]._id}&displayname=${data[num].displayname}`} );

          // Gán state socket = io để gọi lại ở useEffect bên dưới
          setSocket(io);

          // Current là user hiện tại , có thể lưu ở sessionStorage or local
          setCurrent(data[num]);
        }
        catch (error) {
          console.log(error);
        }
      }
      // call func
      fetchData();
    }, [])

    // luôn lắng nghe khi có người khác đăng nhập
    // trả về 1 mảng đang online trong database
  useEffect(() => {
    if (socket) {
      socket.on('list-online', function(data) {
        console.log("Online: ", data);
        // gán state online là một mảng data
        setOnline(data);
      })
    }
    return () => {
      if (socket) {
        // nghe xong sự kiện list-online thì xóa
        socket.removeAllListeners('list-online', () => {
      })
    }
    }
    // chỉ kích hoạt lại khi socket thay đổi
  },[socket])

  // Lắng nge khi trong room có người chat
  useEffect(() => {
    if (socket) {
      // nghe tin nhắn từ room
      socket.on('message-room', function(data) {
        console.log("room message:", data);
        // data đang giữ tin nhắn trước đó
        // nếu tin nhắn mới giống tin nhắn cũ thì k update View
        // có thể xóa đi cũng được
        if(data !== newMess) {
          setNewMess(data);
          let newArr = [...arrayMessage];
          newArr.push(data);
          // cập nhật giao diện
          setArrayMessage(newArr);
        }

      })
    }
    return () => {
      if(socket){
        // nghe xong xóa
        socket.removeAllListeners('message-room', function(){
      })
    }
    }
    // chỉ kích hoạt khi socket thay đổi
  }, [socket])

  // lắng nghe khi có lỗi khi join
  // ở đây alert khi vào 1 room đầy
  useEffect( () => {
    if (socket) {
      socket.on('error-join', function(err) {
        // handle ở đây
        // err.message là 'Room full'
        alert(err.message);
      })
    }
    return () => {
      if(socket){
        // nghe xong xóa
        socket.removeAllListeners('error-join', function(){
      })
    }
  }}, [socket])

  // handle onclick Sign out
  // Gộ socket.disconnect() khi click đăng xuất
  function disconectSocket() {
    socket.disconnect();
    // Đăng xuất nên set list Online null
    setOnline(null);
  }

  // tạo một Room mới khi nhấn Create
  async function createRoom() {
    try {
      const create = await Axios.post("http://localhost:8000/boards", {
        // pay load
        user: current._id,
        width: 10,
        height: 10,
        title: "Nhào vô đây!",
        description: "Hei hei"
      });
      
      // Set Room hiện tại là room mới tạo
      // Khi user tạo thì user mặc định đã join vào room trong db
      // create.data.data là Object Room {...}
      setRoom(create.data.data);

      console.log(create.data.data._id," ", current._id);
      // khi create kèm theo join room để join vào room trong socket
      // truyền [ _id của board, _id của user join vào]
      socket.emit("join-room", [create.data.data._id, current._id]);
    } catch (error) {
      console.log(error);
    }
  }

  // Tương tự hàm này chạy khi bấm nút join
   // truyền [ _id của board, _id của user join vào]
  function joinRoom() {
    console.log("room:", room);
    console.log(room._id);
    socket.emit("join-room", [room._id, current._id]);
  }

  // Tương tự hàm này chạy khi bấm nút join
   // truyền [ _id của board, _id của user join vào]
  function handleJoin(data) {
    socket.emit("join-room", [data, current._id]);
  }

  // Change value input
  function handleChange(e) {
    setInp(e.target.value);
  }

  // Submit chat
  function handleSubmit(e) {
    e.preventDefault();

    //Gửi qua socket [ nội dung gửi, _id của người gửi]
    if (socket) {
      socket.emit("message", [inp, current._id]);
    }

    // Cập nhật giao diện chat
    let newArr = [...arrayMessage];
    newArr.push(inp);
    setArrayMessage(newArr);

    setInp('');
  }

  // Khi người dùng thoát khỏi 1 phòng thì gọi leave room 
  function leaveRoom () {
    if (socket) {
      socket.emit("leave-room");
    }
    
  }

  // ----------------------------------------------------------------

  function handleCaro (e) {
  }

  function handleChangeCaro (e) {
    setCaro(e.target.value);
  }

  

  return (
    <div className="App">
      <button onClick={disconectSocket}>Log out</button>
      <div>
        { online ? online.map((user, key) => {
          return (
            <div key={user._id}>
              {user.displayname}
            </div>
          )
        } 
        ) : "" } 
      </div>
      <button onClick={createRoom}>Create</button>
      <button onClick={joinRoom}>Join</button>
      <button onClick={leaveRoom}>Leave</button>

      <form onSubmit={handleSubmit}>      
        <input type="text" onChange={handleChange} value={inp} />
      </form>

      <form onSubmit={handleCaro}>
        <span>CARO: </span>
        <input text="text" onChange={handleChangeCaro} value={caro} />
      </form>

      <div>
        { boards ? boards.map((bd, key) => {
          return (
            <div className="board" onClick={() => handleJoin(bd._id)}> Board: {bd._id} </div>
          )
        }) : "" }
      </div>

      { arrayMessage ? arrayMessage.map((mes, key) => {
        return (
          <div key={mes} > { mes }</div>
        )
      }) : ""}
    </div>
  );
}

export default App;
