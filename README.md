## Video Playlist App
Este é um aplicativo simples de lista de reprodução de vídeos que permite aos usuários adicionar vídeos a uma lista e reproduzi-los em sequência.
O aplicativo é construído usando JS (React) e Python (FastAPI) e usa um banco de dados SQLite para armazenar os dados da lista de reprodução.

### Notas de Lançamento [v1.0.0](release-notes.md)

### Requisitos
- Node.js
- Python 3.10+

### Instalação e uso

1. Clone o repositório
2. Instale as dependências
    ```bash
    npm install
    ```
3. Inicie o frontend
    ```bash
    npm start
    ```
4. Instale as dependências do Python
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
5. Inicialize o banco de dados
    ```bash
    alembic upgrade head
    ```
6. Inicie o backend
    ```bash
    fastapi run
    ```
7. Abra o aplicativo no seu navegador
    ```
    http://localhost:3000
    ```
8. Abra a documentação da API
    ```
    http://localhost:8000/docs
    ```
9. Aproveite!