# Users

**Este arquivo contém exemplos para a coleção `users`, que armazena os dados de perfil e role de cada usuário, conforme definido nos ADRs `0011` e `0012`. Os IDs correspondem aos do arquivo `resumes.json`, e foram adicionados um recrutador e um administrador.**

``` JSON
[
  {
    "userId": "firebase_user_id_1",
    "email": "carlos.santana@email.com",
    "displayName": "Carlos Santana",
    "photoURL": "https://example.com/photo/carlos.jpg",
    "role": "candidate"
  },
  {
    "userId": "firebase_user_id_2",
    "email": "beatriz.oliveira@email.com",
    "displayName": "Beatriz Oliveira",
    "photoURL": "https://example.com/photo/beatriz.jpg",
    "role": "candidate"
  },
  {
    "userId": "firebase_user_id_3",
    "email": "lucas.martins@email.com",
    "displayName": "Lucas Martins",
    "photoURL": "https://example.com/photo/lucas.jpg",
    "role": "candidate"
  },
  {
    "userId": "firebase_user_id_4",
    "email": "fernanda.costa@email.com",
    "displayName": "Fernanda Costa",
    "photoURL": "https://example.com/photo/fernanda.jpg",
    "role": "candidate"
  },
  {
    "userId": "firebase_user_id_5",
    "email": "ricardo.lima@email.com",
    "displayName": "Ricardo Lima",
    "photoURL": "https://example.com/photo/ricardo.jpg",
    "role": "candidate"
  },
  {
    "userId": "recruiter_user_id_1",
    "email": "ana.silva.recruiter@email.com",
    "displayName": "Ana Silva",
    "photoURL": "https://example.com/photo/ana_recruiter.jpg",
    "role": "recruiter"
  },
  {
    "userId": "admin_user_id_1",
    "email": "admin.user@talentflow.com",
    "displayName": "Admin TalentFlow",
    "photoURL": "https://example.com/photo/admin.jpg",
    "role": "admin"
  }
]
```