# Contabilidade Pessoal

Sistema completo de contabilidade pessoal desenvolvido em Python com Flask, permitindo gerenciar gastos e despesas de forma simples e eficiente.

## Funcionalidades

### Registro de Transações
- **Gastos**: Adicionar, visualizar, editar e excluir gastos
- **Despesas**: Adicionar, visualizar, editar e excluir despesas
- Campos: data, categoria, descrição e valor

### Relatórios e Análises
- Resumo financeiro (total de gastos, despesas e saldo)
- Relatórios por período (filtro por data)
- Relatórios por categoria
- Gráficos visuais:
  - Gráfico de pizza para gastos por categoria
  - Gráfico de barras para despesas por categoria

### Filtros
- Filtrar por data (início e fim)
- Filtrar por categoria
- Aplicar múltiplos filtros simultaneamente

## Stack Tecnológico

- **Backend**: Python 3.x com Flask
- **Banco de Dados**: SQLite (simples e portátil)
- **Frontend**: HTML5, CSS3 e JavaScript vanilla
- **Gráficos**: Chart.js
- **ORM**: SQLAlchemy

## Pré-requisitos

- Python 3.7 ou superior
- pip (gerenciador de pacotes Python)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/JuanPS999/accounting.git
cd accounting
```

2. Crie e ative um ambiente virtual (recomendado):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

## Como Executar

1. Execute a aplicação:
```bash
python app.py
```

2. Para habilitar o modo de debug (apenas para desenvolvimento):
```bash
export FLASK_DEBUG=true  # Linux/Mac
set FLASK_DEBUG=true     # Windows
python app.py
```

3. Abra seu navegador e acesse:
```
http://localhost:5000
```

## Estrutura do Projeto

```
accounting/
├── app.py                  # Aplicação Flask principal
├── models.py               # Modelos de banco de dados SQLAlchemy
├── requirements.txt        # Dependências Python
├── README.md              # Documentação
├── .gitignore             # Arquivos ignorados pelo Git
├── static/
│   ├── css/
│   │   └── style.css      # Estilos CSS
│   └── js/
│       └── app.js         # Lógica JavaScript
└── templates/
    └── index.html         # Template HTML principal
```

## Categorias Disponíveis

- Alimentação
- Transporte
- Moradia
- Saúde
- Educação
- Entretenimento
- Outros

## API Endpoints

### Gastos
- `GET /api/gastos` - Listar todos os gastos (com filtros opcionais)
- `POST /api/gastos` - Criar novo gasto
- `PUT /api/gastos/<id>` - Atualizar gasto
- `DELETE /api/gastos/<id>` - Excluir gasto

### Despesas
- `GET /api/despesas` - Listar todas as despesas (com filtros opcionais)
- `POST /api/despesas` - Criar nova despesa
- `PUT /api/despesas/<id>` - Atualizar despesa
- `DELETE /api/despesas/<id>` - Excluir despesa

### Relatórios
- `GET /api/relatorios/resumo` - Obter resumo financeiro
- `GET /api/relatorios/gastos-por-categoria` - Gastos agrupados por categoria
- `GET /api/relatorios/despesas-por-categoria` - Despesas agrupadas por categoria

### Utilitários
- `GET /api/categorias` - Listar categorias disponíveis

## Recursos da Interface

### Design Responsivo
- Interface adaptável para dispositivos móveis e desktop
- Cards informativos com totalizadores
- Tabelas organizadas com ações de edição e exclusão
- Formulários inline para adicionar/editar registros

### Validação de Dados
- Validação no frontend (HTML5)
- Validação no backend (Flask)
- Mensagens de erro claras
- Confirmação antes de excluir registros

### Experiência do Usuário
- Interface moderna com gradientes e cores vibrantes
- Feedback visual em ações (hover, active states)
- Organização por abas (Gastos, Despesas, Relatórios)
- Gráficos interativos com tooltips

## Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

### Tabela: gastos
- `id` (INTEGER, PRIMARY KEY)
- `data` (DATE, NOT NULL)
- `categoria` (VARCHAR(100), NOT NULL)
- `descricao` (VARCHAR(255), NOT NULL)
- `valor` (FLOAT, NOT NULL)
- `created_at` (DATETIME)

### Tabela: despesas
- `id` (INTEGER, PRIMARY KEY)
- `data` (DATE, NOT NULL)
- `categoria` (VARCHAR(100), NOT NULL)
- `descricao` (VARCHAR(255), NOT NULL)
- `valor` (FLOAT, NOT NULL)
- `created_at` (DATETIME)

## Segurança

- Validação de entrada de dados no frontend e backend
- Proteção contra valores negativos
- Sanitização de dados antes de armazenar no banco
- CORS habilitado para desenvolvimento
- Erro logging sem exposição de stack traces ao cliente
- Debug mode desabilitado por padrão (use FLASK_DEBUG=true para habilitar em desenvolvimento)

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## Autor

Desenvolvido por JuanPS999

## Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório do GitHub.

---

<p align="center">
  <sub><i>Per Aspera Ad Astra.</i></sub>
</p>

**Nota**: Este é um projeto educacional para gerenciamento de finanças pessoais. Para uso em produção, considere adicionar autenticação, criptografia e outras medidas de segurança adicionais.
