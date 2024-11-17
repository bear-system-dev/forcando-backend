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

type TJogador = {
  name: string | string[];
};

@WebSocketGateway({ namespace: 'game', cors: corsOptions })
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private jogadores = new Map<string, TJogador>();

  @WebSocketServer()
  io: Namespace;
  afterInit() {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const clientId = String(client.id);
    const clientName = String(client.handshake.query?.name);
    console.log(`ENTROU --> name: ${clientName} || socketId: ${clientId}`);
    this.jogadores.set(`${clientId}`, { name: clientName });
    console.log(this.jogadores);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const clientId = String(client.id);
    const clientName = String(client.handshake.query?.name);
    console.log(`SAIU --> name: ${clientName} || socketId: ${clientId}`);
    const playerRemoved = this.jogadores.delete(clientId);
    console.log(
      `Removido: ${playerRemoved} || Existe: ${this.jogadores.has(clientId)}`,
    );
    console.log(this.jogadores);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: object) {
    console.log(`Client: ${client.id} || Payload: ${payload}`);
    return client.emit('message', 'Hello World');
  }
}
