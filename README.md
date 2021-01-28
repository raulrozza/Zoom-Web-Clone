# Zoom Web Clone

Este é um clone web do Zoom feito com Javascript, utilizando conceitos de Peer-to-Peer e WebRTC, feito sob tutela do @ErickWendel no seu treinamento Semana JS Expert.

No desenvolvimento da aplicação, são vistos conceitos de comunicação em tempo real, com a implementação de salas de conferência de vídeo/audio, geração de arquivos e download de binários. Os códigos também são criados utilizando patterns de camadas e divisão de responsabilidades, com algumas boas práticas de organização.

Existem três serviços no projeto:
- **Public:** Frontend da aplicação, onde estão as salas e onde é possível conversar com seus amiguinhos pela aplicação.
- **Server:** Este é o servidor de sockets, onde os usuários se conectam através do frontend para poder se comunicar e compartilhar eventos na rede.
- **Peer-Server:** Este é o servidor peer-to-peer, que possibilita chamadas diretas entre dois usuários, para a transmissão de áudio e vídeo.

# Créditos
- Layout da home foi baseada no codepen do [Nelson Adonis Hernandez](https://codepen.io/nelsonher019/pen/eYZBqOm)
- Layout da room foi adaptado a partir do repo do canal [CleverProgrammers](https://github.com/CleverProgrammers/nodejs-zoom-clone/blob/master/views/room.ejs)
