#### Установка NVM
 [NVM 1.2.2 для Windows](https://www.nvmnode.com/ru/guide/download.html)
```cmd
# Скачать установщик
# Установить nvm-setup.exe
# Проверить установку:
nvm -v
```
#### Установка Node.js
```cmd
# Установить Node.js версии 20.19.4
nvm install 20.19.4

# Использовать установленную версию
nvm use 20.19.4

# Проверить версии Node.js и npm
node -v
npm -v
```
#### Клонирование проекта
[Репозиторий](https://github.com/7cout/stkh-api.git)
```cmd
# Клонировать или скачать и распоковать репозиторий
git clone https://github.com/7cout/stkh-api.git
```
#### Установка зависимостей
```cmd
npm install
```
#### Настройка конфигурационных файлов
```cmd
# Перейти в папку config
cd config

# Создать файл окружения на основе примера
copy examples\.env.example .env

# Создать файл с данными аутентификации
copy examples\passwords.bin.example passwords.bin

# Отредактировать файлы с помощью любого текстового редактора
```
#### Настройка автозапуска с PM2
```cmd
# Установить PM2 глобально
npm install pm2 -g

# Запустить приложение через PM2
pm2 start src/app.js --name "stkh-api"

# Сохранить конфигурацию PM2
pm2 save

# Создать скрипт автозапуска для Windows
pm2 startup

# Следуйте инструкциям, которые появятся в терминале
# Обычно требуется выполнить дополнительную команду, которую предложит pm2 startup
```
#### Команды для управления
```cmd
# Просмотр списка приложений
pm2 list

# Просмотр статуса приложений
pm2 status

# Просмотр логов
pm2 logs stkh-api

# Перезапуск приложения
pm2 restart stkh-api

# Остановка приложения
pm2 stop stkh-api

# Удаление из списка PM2
pm2 delete stkh-api
```