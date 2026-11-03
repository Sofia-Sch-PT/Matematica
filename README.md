# Duelo de Teoremas 📐

Jogo web de perguntas para **2 jogadores no mesmo telemóvel**, sobre teoremas da matemática do ensino secundário.

- O ecrã divide-se em dois: cada jogador joga na sua ponta (a metade de cima está rodada 180°).
- **10 rondas**, cada uma com uma pergunta e 4 respostas (escolhidas ao acaso de um banco de perguntas).
- Só depois de ambos responderem (ou o tempo acabar — 20 s) é revelada a resposta certa.
- Resposta certa vale entre **500 e 1000 pontos**: quanto mais rápida, mais pontos. Resposta errada vale 0.
- Cada jogador personaliza o seu **avatar** (pele, cabelo, cor do cabelo, olhos, boca, acessório, camisola, fundo) e o nome — fica guardado no dispositivo.
- Ganha quem tiver mais pontos no fim.

## Jogar localmente

É um site estático (sem build). Basta servir a pasta `web/`:

```bash
python3 -m http.server -d web 8000
```

e abrir <http://localhost:8000>. No computador também dá para jogar com o teclado: Jogador 1 usa `1`–`4`, Jogador 2 usa `7`–`0`.

## Deploy

O workflow `.github/workflows/pages.yml` publica a pasta `web/` no GitHub Pages sempre que há um push para `main` (ou manualmente em *Actions → Deploy para GitHub Pages → Run workflow*).

Em *Settings → Pages*, a fonte (*Source*) deve estar definida como **GitHub Actions**.

## Acrescentar perguntas

Edita `web/questions.js`. Cada pergunta tem `t` (teorema), `q` (pergunta), `a` (4 respostas, **a primeira é a correta**) e `e` (explicação mostrada depois).
