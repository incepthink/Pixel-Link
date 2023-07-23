# Phygital-Tokens
A project built at ETH Global Paris 2023

##### commands to configure backend and sequelize setup
```cd backend```
Sequelize Setup: 
1. Migrate all -> npx sequelize-cli db:migrate
2. Undo last migration -> sequelize-cli db:migrate:undo 
3. Undo specific migration -> sequelize-cli db:migrate:undo --name migration_file_name
4. Undo all migration -> npx sequelize-cli db:migrate:undo:all  --name migration_file_name
5. Make migration skeleton -> npx sequelize-cli migration:generate --name migration-skeleton    
6. make migration -> sequelize migration:create --name
All migration logs at migrationlog.txt

