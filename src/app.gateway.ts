import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
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
    console.log(`ENTROU --> name: ${clientName} || socketId: ${clientId}`);
    this.players.set(`${clientId}`, { name: clientName });
    console.log(this.players);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const clientId = String(client.id);
    const clientName = String(client.handshake.query?.name);
    console.log(`SAIU --> name: ${clientName} || socketId: ${clientId}`);
    const playerRemoved = this.players.delete(clientId);
    console.log(
      `Removido: ${playerRemoved} || Existe: ${this.players.has(clientId)}`,
    );
    console.log(this.players);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: object) {
    console.log(`Client: ${client.id} || Payload: ${payload}`);
    return client.emit('message', 'Hello World');
  }
}
