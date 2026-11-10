# Registro do lab de CI/CD

## Etapa 1 — Docker local

O primeiro pedido foi empacotar o frontend e a API em um único Dockerfile e testar a página inicial e a API antes de passar à CI. A primeira validação usou por engano uma cópia na pasta `Exercício`. Após a indicação do caminho correto, o Dockerfile foi criado na raiz deste repositório e o build e os testes foram repetidos aqui.

O Node 24 compila o React com `VITE_API_URL=/`, para a API responder no mesmo endereço do site. O Maven inclui os arquivos do site no JAR do Spring Boot. A imagem final usa Java 21 JRE e atende na porta 8080.

A tela e a API usavam `/employees`. A compilação Docker ativa `VITE_USE_HASH_ROUTER=true`, então a tela fica em `/#/employees` e a API mantém `/employees`. O modo de desenvolvimento com Vite mantém as URLs originais.

O build de `fintech-hr-lab:repo-correto` passou. No container, `GET /`, `GET /styles/global.css` e `GET /employees` retornaram HTTP 200. A API retornou `application/json` com `[]`. No Chrome, a tela Overview carregou, a chamada do próprio React à API recebeu HTTP 200 e recarregar `/#/employees` abriu a tela Employees.

A suíte do backend e o lint do frontend ficam para a etapa de CI. O Maven empacotou o JAR com `-DskipTests`.

Para repetir, abra o Docker Desktop e execute na raiz do repositório.

```powershell
docker build -t fintech-hr-lab:repo-correto .
docker run --rm -p 127.0.0.1:8080:8080 fintech-hr-lab:repo-correto
```

Abra `http://localhost:8080/` e recarregue `http://localhost:8080/#/employees` no navegador. Em outro terminal, execute `curl.exe -fsS -i http://localhost:8080/employees`. Encerre o container com Ctrl+C.
