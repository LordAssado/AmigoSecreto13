# 🎁 Amigo Secreto

Sorteio de amigo secreto feito só com HTML, CSS e JavaScript (sem servidor, sem dependências).

## Como funciona

- Você cadastra as **casas** e as pessoas de cada uma.
- No sorteio, **ninguém tira a si mesmo nem alguém da própria casa**.
- O organizador **não vê quem tirou quem**: a tela mostra só os nomes com um **link individual** para cada pessoa (WhatsApp ou copiar).
- Ao abrir o próprio link, a pessoa toca em "revelar" e vê quem tirou.

## Rodando localmente

Abra o `index.html` no navegador, ou use a extensão **Live Server** no VS Code
(clique direito em `index.html` → *Open with Live Server*).

> Os links individuais usam o endereço da página. Para os participantes conseguirem abri-los,
> a página precisa estar online (veja abaixo).

## Publicando no GitHub Pages

1. Crie um repositório no GitHub e envie estes arquivos:
   ```bash
   git init
   git add .
   git commit -m "Amigo secreto"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/amigo-secreto.git
   git push -u origin main
   ```
2. No GitHub: **Settings → Pages → Build and deployment**.
3. Em *Source* escolha **Deploy from a branch**, branch **main** e pasta **/ (root)**, e salve.
4. Em alguns minutos o site estará em `https://SEU-USUARIO.github.io/amigo-secreto/`.

## Sobre a privacidade

O resultado de cada pessoa vai codificado dentro do próprio link (depois do `#`), e esse trecho
**não é enviado a nenhum servidor**. A tela do organizador nunca exibe os resultados. Porém, a
codificação é apenas Base64, não criptografia: alguém muito curioso e com conhecimento técnico
poderia decodificar os links que gerou. Para uma brincadeira em família isso costuma bastar.

## Estrutura

```
amigo-secreto/
├── index.html
├── style.css
├── script.js
├── README.md
├── LICENSE
└── .gitignore
```

## Licença

MIT
