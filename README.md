# Задание 1: Анализ и проектирование

## Подзадание 1.1: Анализ и планирование

### Функциональность приложения:

**Управление отоплением:**

- Пользователи могут удалённо включать/выключать отопление в своих домах.
- Пользователи могут устанавливать желаемую температуру.
- Система автоматически поддерживает заданную температуру, регулируя подачу тепла.

**Мониторинг температуры:**

- Система получает данные о температуре с датчиков, установленных в домах.
- Пользователи могут просматривать текущую температуру в своих домах через веб-интерфейс.

### Архитектура приложения:

- **Язык программирования:** Java
- **База данных:** PostgreSQL
- **Архитектура:** Монолитная, все компоненты системы (обработка запросов, бизнес-логика, работа с данными) находятся в рамках одного приложения.
- **Взаимодействие:** Синхронное, запросы обрабатываются последовательно.
- **Масштабируемость:** Ограничена, так как монолит сложно масштабировать по частям.
- **Развертывание:** Требует остановки всего приложения.

### Домены и границы контекстов:

![image](docs/images/current_domains.png)

### Контекст системы:

![image](docs/images/current_context.png)

## Подзадание 1.2: Архитектура микросервисов

### Доменные области

- [User](#owner)
    - [Admin](#admin)
    - [User](#user)
- [Home](#home)
- [Device](#device)
    - [Device Management](#device_management)
    - [Partner Device](#partner_device)
    - [Scenarios](#scenarios)
- [Telemetry](#telemetry)
    - [Telemetry](#telemetry)
    - [Telemetry Analysis](#telemetry_analysis)


**<a name="owner"></a>User**: любой пользователь внутренней и внешней системы, который может с ней взаимодействовать.

- **<a name="admin"></a>Admin**: администратор занимается поддержкой внутренней работы, следит за актуальным списком поддерживаемых датчиков. Может добавлять новые датчики, прикреплять описание, изображение, инструкции по эксплуатации, а так же удалять неподдерживаемые датчики.

- **<a name="user"></a>User**: пользователь приложения, который может описать сценарии работы умного дома и видеть актуальные значения датчиков.

**<a name="Home"></a>Home**: модель дома владельца, с описанием комнат, датчиков назначенными в этой комнате и их значениями.

**<a name="device"></a>Device**: устройства предоставляющие дополнительную информацию о месте в котором они находятся, либо воплняющие определенные комманды которые в них заложены.

- **<a name="device_management"></a>Device Management**: позволяет выполнять операции с датчиками которые установлены пользователем, посылать им комманды, считывать данные.

- **<a name="partner_device"></a>Partner Device**: не для пользовательского использоания. Позволяет сделать подготовительные работы с датчиками, чтобы в итоге пользователю можно было его подключить. По итогу содержит список всех датчиков которые поддерживаются системой умного дома и в последствии могут быть подключены пользователем самостоятельно без как либо проблем.

- **<a name="scenarios"></a>Scenarios**: представляет собой набор правил благодаря которым можно строить полноценные сценарии, в результате которых обеспечивается взаимодействие различных датчиков между собой.

**<a name="telemetry"></a>Telemetry**: телеметрия занимается сбором и анализом данных с датчиков.

- **<a name="telemetry"></a>Telemetry**: отвечает за отслеживание данных с датчиков.

- **<a name="telemetry_analysis"></a>Telemetry Analysis**: занимается анализом данных с устройств.


![image](docs/images/ms_domains.png)
[Domains](docs/domains/domains.puml)


## Подзадание 1.2: Архитектура микросервисов

Ниже представлена схема с микросервисной архитектурой.

**Микросервисы:** User Service, Device Service, Smart Home Service, Telemetry Service, Scenarios Service

**Взаимодействие:** асинхронное при помощи Kafka

**Базы данных:** PostgreSQL, MongoDB

### C4-диаграмма

#### Context

Основное приложение - Smart Home. Им пользуются внешние пользователи. Оно обменивается данными и командами с внешними датчиками.

![уровень контекста](docs/images/c4_context.png)
[C4 - Context](docs/c4/context/context.puml)

#### Container

Каждый сервис является отдельными микросервисом.
Все запросы к микросервисам проходят через общий API Gateway. С датчиками обмен данными происходит через *Device Gateway* и *Kafka*.
*Device Gateway* знает какие типы датчиков имеются и может перенаправлять комманды только тем датчикам, которые смогут эту команду выполнить. Так же знает какие топики есть в Kafka и перенаправляет данные в нужный топик.
*Kafka* содержит топики для различного типа данных, а так же команд.

![уровень контейнера](docs/images/c4_container.png)
[C4 - Container](docs/c4/container/container.puml)

#### Component

<details close>
  <summary>
    User Service
  </summary>

  ![user service](docs/images/c4_component_user_service.png)
  [C4 - Component - User Service](docs/c4/component/user_service.puml)
</details>
<details close>
  <summary>
    Smart Home Service
  </summary>

  ![smart home service](docs/images/c4_component_smart_home_service.png)
  [C4 - Component - Smart Home Service](docs/c4/component/smart_home_service.puml)
</details>
<details close>
  <summary>
    Telemetry Service
  </summary>

  ![Telemetry Service](docs/images/c4_component_telemetry_service.png)
  [C4 - Component - Telemetry Service](docs/c4/component/telemetry_service.puml)
</details>
<details close>
  <summary>
    Scenarios Service
  </summary>

  ![Scenarios Service](docs/images/c4_component_scenarios_service.png)
  [C4 - Component - Scenarios Service](docs/c4/component/scenarios_service.puml)
</details>
<details close>
  <summary>
    Device Service
  </summary>

  ![Device Service](docs/images/c4_component_device_service.png)
  [C4 - Component - Device Service](docs/c4/component/device_service.puml)
</details>
<details close>
  <summary>
    Device Gateway
  </summary>

  ![Device Gateway](docs/images/c4_component_device_gateway.png)
  [C4 - Component - Device Gateway](docs/c4/component/device_gateway.puml)
</details>
<details close>
  <summary>
    Kafka
  </summary>

  ![Kafka](docs/images/c4_component_Kafka.png)
  [C4 - Component - Kafka Service](docs/c4/component/kafka_service.puml)
</details>

### Подзадание 1.3: ER-диаграмма

![ER-диаграмма](docs/images/er-diagram.png)
[ER-диаграмма](docs/relations//er_diagram.puml)

### Подзадание 1.4: Создание и документирование API

#### API микросервиса для девайсов

<details close>
  <summary>
    Добавить девайс
  </summary>

  <table>
    <tr>
      <th>Запрос</th>
      <th>Метод</th>
      <th>Тело запроса</th>
      <th>Пример ответа<th>
    </tr>
    <tr>
      <td>/device</td>
      <td>POST</td>
      <td>
        <pre>
        {
          "serial_number": "string",
          "type": "HEATING",
          "partner_device_id": "string"
        }
        </pre>
      </td>
      <td>
        <pre>
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "serial_number": "string",
          "type": "HEATING",
          "name": "string",
          "status": "ON",
          "device_info": {
            "description": "string",
            "image": "string",
            "supported": true,
            "manual": "string"
          }
        }
        </pre>
      </td>
    </tr>
  </table>
</details>

<details close>
  <summary>
    Получить девайс
  </summary>

  <table>
    <tr>
      <th>Запрос</th>
      <th>Метод</th>
      <th>Тело запроса</th>
      <th>Пример ответа<th>
    </tr>
    <tr>
      <td>/device/:id</td>
      <td>Get</td>
      <td>-</td>
      <td>
        <pre>
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "serial_number": "string",
          "type": "HEATING",
          "name": "string",
          "status": "ON",
          "device_info": {
            "description": "string",
            "image": "string",
            "supported": true,
            "manual": "string"
          }
        }
        </pre>
      </td>
    </tr>
  </table>
</details>

<details close>
  <summary>
    Обновить статус
  </summary>

  <table>
    <tr>
      <th>Запрос</th>
      <th>Метод</th>
      <th>Тело запроса</th>
      <th>Пример ответа<th>
    </tr>
    <tr>
      <td>/device/:id/status</td>
      <td>PUT</td>
      <td>
        <pre>
        {
          "status": "ON"
        }
        </pre>
      </td>
      <td>
        <pre>
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "serial_number": "string",
          "type": "HEATING",
          "name": "string",
          "status": "ON",
          "device_info": {
            "description": "string",
            "image": "string",
            "supported": true,
            "manual": "string"
          }
        }
        </pre>
      </td>
    </tr>
  </table>
</details>

<details close>
  <summary>
    Отправить команду
  </summary>

  <table>
    <tr>
      <th>Запрос</th>
      <th>Метод</th>
      <th>Тело запроса</th>
      <th>Пример ответа<th>
    </tr>
    <tr>
      <td>/device/:id/command</td>
      <td>POST</td>
      <td>
        <pre>
        {
          "temperature": 0,
          "open": true,
          "turn_on": true
        }
        </pre>
      </td>
      <td>
        <pre>
        {
          "result": true
        }
        </pre>
      </td>
    </tr>
  </table>
</details>

#### API микросервиса телеметрии

<details close>
  <summary>
    Получить последние данные
  </summary>

  <table>
    <tr>
      <th>Запрос</th>
      <th>Метод</th>
      <th>Параметры</th>
      <th>Пример ответа<th>
    </tr>
    <tr>
      <td>/telemetry/latest</td>
      <td>GET</td>
      <td>
        ?deviceId=123
      </td>
      <td>
        <pre>
        {
          "id": "string",
          "device_id": "string",
          "timestamp": "2024-10-02T19:20:24.768Z",
          "data": {}
        }
        </pre>
      </td>
    </tr>
  </table>
</details>

<details close>
  <summary>
    Получить данные за период
  </summary>

  <table>
    <tr>
      <th>Запрос</th>
      <th>Метод</th>
      <th>Параметры</th>
      <th>Пример ответа<th>
    </tr>
    <tr>
      <td>/telemetry</td>
      <td>GET</td>
      <td>
        ?deviceId=123
        ?startDate={datetime}
        ?endDate={datetime}
      </td>
      <td>
        <pre>
        [
          {
            "id": "string",
            "device_id": "string",
            "timestamp": "2024-10-02T19:23:03.224Z",
            "data": {}
          },
          {
            "id": "string",
            "device_id": "string",
            "timestamp": "2024-10-02T19:23:03.224Z",
            "data": {}
          }
        ]
        </pre>
      </td>
    </tr>
  </table>
</details>

#### API взаимодействия с физическими датчиками

<details close>
  <summary>
    Отправить команду
  </summary>

  <table>
    <tr>
      <th>Топик</th>
      <th>Метод</th>
      <th>Payload</th>
    </tr>
    <tr>
      <td>command</td>
      <td>Subscribe</td>
      <td>
        <pre>
        {
          "command": "temperature",
          "serial_number": "string"
        }
        </pre>
      </td>
    </tr>
  </table>
</details>

[OpenAPI - Device](docs/api/device.yaml)
[OpenAPI - Telemetry](docs/api/telemetry.yaml)
[AsyncAPI - Kafka](docs/api/kafka.yaml)

# Задание 2: Разработка MVP

### Новые сервисы

Добавлено 2 микросервиса - `devices`(localhost:3000) и `telemetry`(localhost:3001).
Для коммуникация между сервисами добавлена Kafka. У которой есть 2 топика - `device_command` и `sensor_data`.
Добавлен API Gateway, доступен по адресу localhost:80

### Запуск

Команда `docker compose up -d`. Важно дождаться завершения контейнера `init_kafka`.


### Запросы

Что бы добавить девайс и телеметрию для него, можно выполнить скрипо `sh scripts/mock.sh`. В логах будут id добавленного девайса и телеметрия которая была добавлена.

Запрос для добавления датчика
```
curl --location 'http://localhost:80/devices' \
--header 'Content-Type: application/json' \
--data '{
    "serial": "123",
    "type": "heating",
    "status": "on"
}'
```

Запос получения списка датчиков
```
curl --location 'http://localhost:80/devices'
```

Проверка статуса датчика
```
curl --location 'http://localhost:80/devices/:deviceId/status'
```

Получение данных телеметрии
```
curl --location 'http://localhost:80/telemetry'
```

Добавление телеметрии
```
curl --location 'http://localhost:80/telemetry/:deviceId' \
--header 'Content-Type: application/json' \
--data '{"data": { "heating": "27.3" }}'
```

### Отправлка сообщения в Kafka-топик

Выполняем команду `docker exec -it <kafka-container-name> sh`
Для того, чтобы отправить команду в топик `device_command` выполняем команду:
`kafka-console-producer --bootstrap-server localhost:9092 --topic device_command`
После чего, можно отправить сообщение в следующем формате:
`{"action":"turn_off"/"turn_on","id":":deviceId"}`
Что спровоцирует изменения статуса девайса.

Для телеметрии нужно отправить команту в топик `sensor_data`, вызываем команду:
`kafka-console-producer --bootstrap-server localhost:9092 --topic sensor_data`
Сообщение должно выглядеть следующим образом:
`{"deviceId": ":deviceId", ":dataName": ":dataValue"}`

=====================

# Базовая настройка

## Запуск minikube

[Инструкция по установке](https://minikube.sigs.k8s.io/docs/start/)

```bash
minikube start
```


## Добавление токена авторизации GitHub

[Получение токена](https://github.com/settings/tokens/new)

```bash
kubectl create secret docker-registry ghcr --docker-server=https://ghcr.io --docker-username=<github_username> --docker-password=<github_token> -n default
```


## Установка API GW kusk

[Install Kusk CLI](https://docs.kusk.io/getting-started/install-kusk-cli)

```bash
kusk cluster install
```


## Настройка terraform

[Установите Terraform](https://yandex.cloud/ru/docs/tutorials/infrastructure-management/terraform-quickstart#install-terraform)


Создайте файл ~/.terraformrc

```hcl
provider_installation {
  network_mirror {
    url = "https://terraform-mirror.yandexcloud.net/"
    include = ["registry.terraform.io/*/*"]
  }
  direct {
    exclude = ["registry.terraform.io/*/*"]
  }
}
```

## Применяем terraform конфигурацию 

```bash
cd terraform
terraform apply
```

## Настройка API GW

```bash
kusk deploy -i api.yaml
```

## Проверяем работоспособность

```bash
kubectl port-forward svc/kusk-gateway-envoy-fleet -n kusk-system 8080:80
curl localhost:8080/hello
```


## Delete minikube

```bash
minikube delete
```
