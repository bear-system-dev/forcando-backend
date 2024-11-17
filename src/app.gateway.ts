import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import corsOptions from './CorsOptions';
import { Namespace, Socket } from 'socket.io';

type TPlayer = {
  name: string | string[];
};

type TRoom = {
  roomID: string;
  players: TPlayer[];
};

@WebSocketGateway({ namespace: 'game', cors: corsOptions })
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private players = new Map<string, TPlayer>();
  private rooms = new Map<string, TRoom>();

  @WebSocketServer()
  io: Namespace;
  afterInit() {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const clientId = String(client.id);
    const clientName = String(client.handshake.query?.name);
    if (!clientName || clientName.length <= 0)
      return client.emit('error', 'Você deve fornecer um nome de jogador');

    const playerNames = [];
    this.players.forEach((player) => {
      playerNames.push(player.name);
    });
    console.log(`ENTROU --> name: ${clientName} || socketId: ${clientId}`);
    this.players.set(`${clientId}`, { name: clientName });

    client.join('game');
    this.io.in('game').emit('join', clientName);

    console.log(this.players);
    return client.emit('player names', playerNames);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const clientId = String(client.id);
    const clientName = String(client.handshake.query?.name);
    console.log(`SAIU --> name: ${clientName} || socketId: ${clientId}`);
    const playerRemoved = this.players.delete(clientId);
    client.leave('game');
    this.io.in('game').emit('leave', clientName);
    console.log(
      `Removido: ${playerRemoved} || Existe: ${this.players.has(clientId)}`,
    );
    console.log(this.players);
  }
}
