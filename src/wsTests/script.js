const name = 'Lestter';
const socket = io(`http://localhost:3000/game?name=${name}`);

socket.emit('message', 'asdw');
socket.on('message', (data) => {
  console.log(data);
});

const nome = 'Lucas';
const socket2 = io(`http://localhost:3000/game?name=${nome}`);

socket2.emit('message', 'asdw');
socket2.on('message', (data) => {
  console.log(data);
});
