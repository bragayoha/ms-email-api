## Objetivo: Criar um Microsserviços (projeto) em Express para ler todas as novas apostas da prova de Adonis (feita anteriormente) e disparar um e-mail para todos administradores do sistema. Para observar as novas apostas, iremos utilizar o serviço de mensageria chamada Kafka.

- Producer: Loteria
- Consumer: MS_EMAILS

> Iremos chamar a prova de Adonis (feita anteriormente) de Loteria e o Microsserviços em Express iremos apelidar de MS_EMAILS (OK)

> Mapear todos os disparos de e-mails que são feitos na própria API do Adonis e enviar todas para a responsabilidade do MS_EMAILS

> É obrigatório a utilização do Kafka como comunicação entre os dois sistema (MS_EMAILS e LOTERIA).

> É obrigatório a utilização do Docker (Arquivo Docker-Compose em Anexo )

**Atenção: O MS_EMAILS deverá escutar Kafka sempre que ele for iniciado (node App.js).**
