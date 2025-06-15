# Curation

**Este arquivo centraliza todos os dados de curadoria que alimentam os selects e campos de tags dos formulários, conforme a estória `TFLOW-011`.**

``` JSON
{
  "professionalAreas": [
    { "id": "area_1", "name": "Desenvolvimento de Software", "status": "active" },
    { "id": "area_2", "name": "Design de Produto (UX/UI)", "status": "active" },
    { "id": "area_3", "name": "Ciência de Dados", "status": "active" },
    { "id": "area_4", "name": "Gestão de Produtos", "status": "active" },
    { "id": "area_5", "name": "DevOps / SRE", "status": "active" },
    { "id": "area_6", "name": "Qualidade de Software (QA)", "status": "active" }
  ],
  "experienceLevels": [
    { "id": "level_1", "name": "Estágio", "order": 1, "status": "active" },
    { "id": "level_2", "name": "Júnior", "order": 2, "status": "active" },
    { "id": "level_3", "name": "Pleno", "order": 3, "status": "active" },
    { "id": "level_4", "name": "Sênior", "order": 4, "status": "active" },
    { "id": "level_5", "name": "Especialista / Principal", "order": 5, "status": "active" }
  ],
  "languageList": [
    { "id": "lang_1", "name": "Português", "status": "active" },
    { "id": "lang_2", "name": "Inglês", "status": "active" },
    { "id": "lang_3", "name": "Espanhol", "status": "active" },
    { "id": "lang_4", "name": "Francês", "status": "active" },
    { "id": "lang_5", "name": "Alemão", "status": "active" }
  ],
  "proficiencyLevels": [
    { "id": "prof_1", "name": "Básico (A1/A2)", "order": 1, "status": "active" },
    { "id": "prof_2", "name": "Intermediário (B1)", "order": 2, "status": "active" },
    { "id": "prof_3", "name": "Avançado (B2)", "order": 3, "status": "active" },
    { "id": "prof_4", "name": "Fluente (C1/C2)", "order": 4, "status": "active" },
    { "id": "prof_5", "name": "Nativo ou Bilíngue", "order": 5, "status": "active" }
  ],
  "softSkills": [
    { "id": "ss_1", "name": "Liderança Técnica", "description": "Capacidade de guiar tecnicamente a equipe.", "status": "active" },
    { "id": "ss_2", "name": "Resolução de Problemas Complexos", "description": "Habilidade para analisar e resolver problemas multifacetados.", "status": "active" },
    { "id": "ss_3", "name": "Comunicação", "description": "Habilidade de transmitir ideias de forma clara e eficaz.", "status": "active" },
    { "id": "ss_4", "name": "Pensamento Crítico", "description": "Capacidade de analisar informações de forma objetiva e fazer um julgamento fundamentado.", "status": "active" },
    { "id": "ss_5", "name": "Visão Estratégica", "description": "Capacidade de alinhar decisões técnicas com os objetivos do negócio.", "status": "active" },
    { "id": "ss_6", "name": "Negociação", "description": "Habilidade para chegar a acordos e alinhar stakeholders.", "status": "active" }
  ],
  "technologies": [
    { "id": "tech_1", "name": "Kotlin", "type": "Linguagem de Programação", "status": "active" },
    { "id": "tech_2", "name": "Java", "type": "Linguagem de Programação", "status": "active" },
    { "id": "tech_3", "name": "Python", "type": "Linguagem de Programação", "status": "active" },
    { "id": "tech_4", "name": "TypeScript", "type": "Linguagem de Programação", "status": "active" },
    { "id": "tech_5", "name": "Angular", "type": "Framework Frontend", "status": "active" },
    { "id": "tech_6", "name": "Spring Boot", "type": "Framework Backend", "status": "active" },
    { "id": "tech_7", "name": "Kafka", "type": "Mensageria", "status": "active" },
    { "id": "tech_8", "name": "AWS", "type": "Plataforma de Cloud", "status": "active" },
    { "id": "tech_9", "name": "Docker", "type": "Conteinerização", "status": "active" },
    { "id": "tech_10", "name": "Figma", "type": "Ferramenta de Design", "status": "active" },
    { "id": "tech_11", "name": "Jira", "type": "Ferramenta de Gestão", "status": "active" },
    { "id": "tech_12", "name": "Terraform", "type": "Infraestrutura como Código", "status": "active" },
    { "id": "tech_13", "name": "PostgreSQL", "type": "Banco de Dados", "status": "active" }
  ]
}
```