Desafios do módulo de Docker - Fullcycle

A imagem do desafio Go está em alexcorr/dockergochallange:

https://hub.docker.com/repository/docker/alexcorr/dockergochallange


A aplicação node está no diretório node que está organizado da seguinte forma:
app -> aplicação node.js 
mysql -> banco de dados mysql
nginx -> configuração e dockerfile do nginx

A aplicação verifica se o banco nodedb existe. Se não existir ele é criado e a tabela people é criada.
Além disso, se a tabela people estiver vazia, a aplicação insere quatro registros. 
