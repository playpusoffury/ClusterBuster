# ClusterBuster

ClusterBuster is an AI-powered analysis tool for Windows Failover Cluster logs. It helps users investigate and diagnose cluster issues by processing log files and providing intelligent analysis.

## Project Structure

```
ClusterBuster/
├── frontend/           # React + Tailwind UI
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── rag-db/        # Weaviate RAG Database
│   │   ├── docker-compose.yml
│   │   └── weaviate/
│   └── agents/        # AI Processing Agents
│       └── config.json
└── CHANGELOG.md
```

## Features

- Case-based investigation system
- AI-powered log analysis
- Interactive timeline visualization
- Root cause analysis generation
- Knowledge base integration
- Dark/Light mode support

## Requirements

- Node.js 18+
- Docker and Docker Compose
- Ollama or LMStudio for AI processing

## Local Development

1. Start the RAG Database:
```bash
cd backend/rag-db
docker-compose up -d
```

2. Start the Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Data Storage

- Case data: `C:\clusterbuster`
- Log files: `C:\clusterbuster\logs`

## Configuration

### AI Server
- Supports Ollama or LMStudio
- Configure server URL in Settings
- Select appropriate AI model

### Database
- Weaviate RAG database
- Individual case databases
- Permanent knowledge base storage

## Components

### Frontend
- Dashboard with system status
- Case management
- Analysis visualization
- Settings configuration

### Backend
- Weaviate RAG database
- AI processing agents
- Knowledge base management

### Agents
- Orchestrator
- Sorting
- Indexing
- Compiler
- Investigator
- Analyst
- Writer
- Redaction
- Researcher
- Consultant
- Presenter
- Archiver

## Status

See [CHANGELOG.md](CHANGELOG.md) for detailed progress and upcoming features.
