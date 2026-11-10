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

## Etapa 2 — Integração contínua

> Dê continuidade para a próxima etapa, desenvolvimento do pipeline de CI.

O workflow `.github/workflows/ci.yml` roda em pull requests com destino à `main` e em pushes na `main`. O job usa Ubuntu 24.04, Java 21 e Node 24. O Maven roda a suíte existente, `npm ci` instala as dependências do frontend e o ESLint verifica o código. O Dockerfile compila o frontend com TypeScript e Vite e monta a imagem final. O último passo inicia um container, verifica o título da página, o CSS e o array JSON da API, e remove o container ao terminar.

Na máquina local, o `actionlint` aprovou o YAML. Em Linux via Docker, a suíte Maven passou com 24 testes, 0 falhas, 0 erros e 0 ignorados. O ESLint terminou com código 0. O build Docker passou e o próprio script do workflow confirmou o título `Fintech HR`, o CSS e o retorno de `/employees` como um array JSON.

Durante o teste, o `curl` recebeu `Empty reply from server` enquanto o Spring iniciava. O script tentou de novo automaticamente e passou quando a aplicação ficou pronta.

A execução no runner do GitHub e os gatilhos reais serão confirmados na validação do fluxo. Esta etapa foi registrada em um commit local.

## Etapa 3 — Gatilho de deploy no Render

> Subi tudo para a main no repositório e vou configurar o Render agora

O GitHub Actions confirmou a CI do push `ea0f2e3` na `main`. Os testes do backend, a validação do frontend, o build Docker e o teste do container passaram na [execução 42743276136](https://github.com/NicolasIsepe/fintech-hr-cicd/actions/runs/42743276136).

O workflow ganhou um job `deploy` que depende do sucesso de `ci` e roda em `push` na `refs/heads/main`. Ele usa o segredo `RENDER_DEPLOY_HOOK` para enviar um POST com `ref=$GITHUB_SHA`. O log mostra o SHA e o status aceito pelo Render. HTTP 200 ou 202 confirma a solicitação de deploy. A publicação é verificada separadamente no painel do Render.

O `actionlint` passou. Um teste local do script com um hook simulado confirmou que o POST manteve a chave na query e enviou o SHA completo em `ref`. O script aceitou HTTP 200 e 202 e falhou com HTTP 302, HTTP 404 e com o segredo ausente. Nenhum hook real foi usado no teste.

No Render, conecte o repositório pelo GitHub e selecione a branch `main`, runtime Docker, contexto na raiz, `./Dockerfile`, `PORT=8080` e health check em `/`. Deixe o Auto-Deploy em **Off**. Copie a URL completa do Deploy Hook para o segredo de repositório `RENDER_DEPLOY_HOOK` no GitHub. O deploy inicial criado pelo Render serve para verificar a configuração do serviço. A confirmação do deploy acionado pelo workflow e do SHA publicado fica para a etapa 4.
