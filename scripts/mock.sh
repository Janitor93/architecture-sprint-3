#!/bin/bash

printf "\nУстановка девайса\n"
device_result=$(curl -s POST 'http://localhost:3000/devices' -d '{"serial": "123","type": "heating","status": "on" }' -H 'Content-Type: application/json')
device_id=$(node -pe 'JSON.parse(process.argv[1]).id' $device_result)
printf "Девайс додбавлен: $device_id\n"

printf "\nПроверка текущего статуса\n"
status_result=$(curl -s GET "http://localhost:3000/devices/$device_id/status")
printf "Статус девайса: $status_result\n"

printf "\nДобавление телеметрии\n"
telemetry_result=$(curl -s POST "http://localhost:3001/telemetry/$device_id" -d '{"data": { "heating": "27.3" }}' -H 'Content-Type: application/json')
printf "\nТелеметрия добавлена\n: $telemetry_result\n"

