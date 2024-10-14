# ToBe-архитектура

Ниже представлена схема с микросервисной архитектурой переход к которой предстоит сделать.

**Микросервисы:**
- User Service
- Device Service
- Smart Home Service
- Telemetry Service
- Scenarios Service

**Взаимодействие:** асинхронное при помощи *Kafka*

**Базы данных:** PostgreSQL, MongoDB

## C4-диаграмма

- [Context](#context)
- [Container](#container)
- [Component](#component)
    - [User Service](#user_service)
    - [Smart Home Service](#smart_home_service)
    - [Telemetry Service](#telemetry_service)
    - [Device Service](#device_service)
    - [Scenarios Service](#scenarios_service)
    - [Kafka](#kafka_component)
    - [Device Gateway](#device_gateway)
- [Code](#code)

### <a name="context"></a>Context

Основное приложение - Smart Home. Им пользуются внешние пользователи. Оно обменивается данными и командами с внешними датчиками.

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

Person(user, "User", "Uses the SmartHome")
System_Boundary(smart_home, "Smart Home") {
  System(smart_home_app, "Smart Home App", "Contains all logic to interact with users and devices")
}
System_Ext(devices, "Devices", "Physical devices")

Rel(user, smart_home_app, "Uses")
BiRel(smart_home_app, devices, "Data exchange")
@enduml
```
### <a name="container"></a>Container
Каждый сервис является отдельными микросервисом.
Все запросы к микросервисам проходят через общий API Gateway. С датчиками обмен данными происходит через *Device Gateway* и *Kafka*.
*Device Gateway* знает какие типы датчиков имеются и может перенаправлять комманды только тем датчикам, которые смогут эту команду выполнить. Так же знает какие топики есть в Kafka и перенаправляет данные в нужный топик.
*Kafka* содержит топики для различного типа данных, а так же команд.
```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(user, "User", "Пользователь системы")

Container(api_gateway, "API Gateway", "Kong")

Container_Boundary(user_container, "User Service") {
  Container(user_service, "User Service", "Nest.js", "Логика по работе с пользователями с пользователями")
  ContainerDb(user_db, "UserDB", "PostgreSQL", "Хранит информацию о пользователях")
  Lay_D(user_service, user_db)
}

Container_Boundary(smart_home_container, "Smart Home Service") {
  Container(smart_home_service, "Smart Home Service", "Nest.js", "Логика связанная с конфигурацией дома")
  ContainerDb(smart_home_db, "SmartHomeDB", "PostgreSQL", "Хранит информацию о доме, такую как комнаты, датчики  комнате и другие настройки")
  Lay_D(smart_home_service, smart_home_db)
}

Container_Boundary(device_container, "Device Service") {
  Container(device_service, "Device Service", "Nest.js", "Позволяет работать с датчиками")
  ContainerDb(device_db, "DeviceDB", "PostgreSQL", "Данные по датчикам")
  Lay_D(device_service, device_db)
}

Container_Boundary(telemetry_container, "Telemetry Service") {
  Container(telemetry_service, "Telemetry Service", "Nest.js", "Логика по работе с телеметрией")
  ContainerDb(telemetry_db, "TelemetryDB", "MongoDB", "Данные телеметрии")
  Lay_D(telemetry_service, telemetry_db)
}

Container_Boundary(scenarios_container, "Scenarios Service") {
  Container(scenarios_service, "Scenarios Service", "Nest.js", "Позволяет создавать сценарии взаимодействия между различными датчиками")
  ContainerDb(scenarios_db, "ScenariosDB", "PostgreSQL", "Хранит наборы допустимых команд и создаддые сценарии")
}

ContainerQueue(kafka, "Kafka")

Container_Ext(device, "Device", "Физический датчик")

Container(device_gateway, "Device Gateway")

' External relations
Rel(user, api_gateway, "Запросы с Web/Mobile-приложения", "https")

' DB relations
Rel_R(user_service, user_db, "Чтение/запись")
Rel_R(smart_home_service, smart_home_db, "Чтение/запись")
Rel_R(device_service, device_db, "Чтение/запись")
Rel_R(telemetry_service, telemetry_db, "Чтение/запись")
Rel_R(scenarios_service, scenarios_db, "Чтение/запись")

' GW relations
Rel(api_gateway, user_service, "API-запрос", "https")
Rel(api_gateway, smart_home_service, "API-запрос", "https")
Rel(api_gateway, device_service, "API-запрос", "https")
Rel(api_gateway, telemetry_service, "API-запрос", "https")
Rel(api_gateway, scenarios_service, "API-запрос", "https")

' Kafka
Rel_U(kafka, telemetry_container, "Sub")
Rel(device_container, kafka, "Pub")
BiRel(scenarios_container, kafka, "Pub/Sub")
BiRel_U(device_gateway, kafka, "Pub/Sub")
Rel_D(device_gateway, device, "Отправка команд", "MQTT")
Rel_D(device, device_gateway, "Отправка данных", "MQTT")
Lay_D(device_gateway, device)

Rel_R(scenarios_container, device_container, "Сценарий делегирует датчикам команды", "gRPC")

@enduml
```
### Component

#### User Service

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

Component_Ext(api_gateway, "API Gateway")

Container_Boundary(user_service_component, "User Service") {
  Component(user_controller, "UserController", "", "Обрабатывает пришедшие запросы, связанные с пользователями")
  Component(user_service, "UserService", "", "Содержит бизнес-логику")
  Component(user_repository, "UserRepository", "", "Содержит логику по работе с базой данных")
}

ComponentDb_Ext(user_db, "UserDB", "PostgreSQL", "Хранит информацию о пользователях")

Rel(api_gateway, user_controller, "")
Rel(user_controller, user_service, "")
Rel(user_service, user_repository, "")
Rel(user_repository, user_db, "")

@enduml
```

#### Smart Home Service

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

Component_Ext(api_gateway, "API Gateway")

Container_Boundary(smart_home_service_component, "Smart Home Service") {
  Component(smart_home_controller, "SmartHomeController", "", "Обрабатывает пришедшие запросы, связанные с умным домом")
  Component(smart_home_service, "SmartHomeService", "", "Содержит бизнес-логику")
  Component(smart_home_repository, "SmartHomeRepository", "", "Содержит логику по работе с базой данных")
}
ComponentDb_Ext(smart_home_db, "SmartHomeDB", "PostgreSQL", "Хранит конфигуации и информацию по умному дому")

Rel(api_gateway, smart_home_controller, "")
Rel(smart_home_controller, smart_home_service, "")
Rel(smart_home_service, smart_home_repository, "")
Rel(smart_home_repository, smart_home_db, "")

@enduml
```

#### Telemetry Service

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

Component_Ext(api_gateway, "API Gateway")

Container_Boundary(telemetry_service_component, "Telemetry Service") {
  Component(telemetry_service, "TelemetryService", "", "Содержит бизнес-логику")
  Component(telemetry_repository, "TelemetryRepository", "", "Содержит логику по работе с базой данных")
}
ComponentDb_Ext(telemetry_db, "TelemetryDB", "", "Хранит информацию предоставленную датчиками")
ComponentQueue_Ext(kafka, "Kafka")

Rel(api_gateway, telemetry_service, "")
Rel(telemetry_service, telemetry_repository, "")
Rel(telemetry_repository, telemetry_db, "")
Rel(telemetry_service, kafka, "- heatin\n - light\n - gate\n - camera", "Sub")

@enduml
```

#### Scenarios Service

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml
Component_Ext(api_gateway, "API Gateway")
Component_Ext(device_service, "Device Service")
Component_Ext(kafka, "Kafka")

Container_Boundary(scenarios_component, "Sceanrios") {
  Component(scenarios_controller, "ScenariosController", "", "Обрабатывает пришедшие запросы")
  Component(scenarios_service, "ScenariosService", "", "Содержит бизнес-логику")
  Component(scenarios_repository, "ScenariosRepository", "", "Содержит логику по работе с базой данных")
}
ComponentDb_Ext(scenarios_db, "ScenariosDB", "", "Хранит сценарии")

Rel(api_gateway, scenarios_controller, "")
Rel(scenarios_controller, scenarios_service, "")
Rel(scenarios_service, scenarios_repository, "")
Rel(scenarios_repository, scenarios_db, "")

Rel(scenarios_service, kafka, "- heatin\n - light\n - gate\n - camera", "Sub")
Rel(kafka, scenarios_service, "- command", "Pub")

Rel(scenarios_service, device_service, "Делегирует команду датчику", "gRPC")

@enduml
```

#### Device Service

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

Component_Ext(api_gateway, "API Gateway")

Container_Boundary(device_component, "Device Service") {
  Component(device_controller, "DeviceController", "", "Обрабатывает пришедшие запросы, связанные с датчиками")
  Component(device_service, "DeviceService", "", "Содержит бизнес-логику")
  Component(device_repository, "DeviceRepository", "", "Содержит логику по работе с базой данных")
}
ComponentDb_Ext(device_db, "DeviceDB", "", "Хранит конфигуации и информацию по датчикам")
ComponentQueue_Ext(kafka, "Kafka")

Rel(api_gateway, device_controller, "")
Rel(device_controller, device_service, "")
Rel(device_service, device_repository, "")
Rel(device_repository, device_db, "")

Rel(device_service, kafka, "- heatin\n - light\n - gate\n - camera", "Sub")
Rel(kafka, device_service, "- command", "Pub")

@enduml
```

#### Device Gateway

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

Component_Ext(device, "Device", "Физическое устройство")
Component_Ext(kafka, "Kafka")

Container_Boundary(device_gateway_component, "Device Gateway") {
  Component(device_gateway_controller, "DeviceGatewayController", "", "Обрабатывает пришедшие запросы от датчика")
  Component(device_gateway_service, "DeviceGatewayService", "", "Преобразует данные и передает их в нужный топик")
}

Rel(device, device_gateway_controller, "", "MQTT")
Rel(device_gateway_controller, device_gateway_service, "")
Rel(device_gateway_service, kafka, "Pub/Sub")

@enduml
```

#### Kafka

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

Component_Ext(device_gateway, "Device Gateway", "Custom Gateway")
Component_Ext(device_service, "Device Service")
Component_Ext(telemetry_service, "Telemetry Service")
Component_Ext(scenarios_service, "Scenarios Service")
Component_Ext(smart_home_service, "Smart Home Service")

Container_Boundary(kafka_component, "Kafka") {
  Component(broker, "Broker", "", "Обрабатывает пришедшие запросы от сенсора")
  Component(heating_topic, "Heating Topic", "", "")
  Component(light_topic, "Light Topic", "", "")
  Component(gate_topic, "Gate Topic", "", "")
  Component(camera_topic, "Camera Topic", "", "")
  Component(command_topic, "Command Topic", "", "")
}

Rel(device_gateway, broker, "- Heatin\n - Light\n - Gate\n - Camera", "Pub")
Rel(broker, device_gateway, "Command", "Sub")

Rel(broker, heating_topic, "")
Rel(broker, light_topic, "")
Rel(broker, gate_topic, "")
Rel(broker, camera_topic, "")
Rel_U(command_topic, broker, "")

Rel(heating_topic, telemetry_service, "Sub")
Rel(light_topic, telemetry_service, "Sub")
Rel(gate_topic, telemetry_service, "Sub")
Rel(camera_topic, telemetry_service, "Sub")

Rel(heating_topic, scenarios_service, "Sub")
Rel(light_topic, scenarios_service, "Sub")
Rel(gate_topic, scenarios_service, "Sub")
Rel(camera_topic, scenarios_service, "Sub")

Rel_U(smart_home_service, command_topic, "Pub")
Rel_U(scenarios_service, command_topic, "Pub")
Rel_U(device_service, command_topic, "Pub")

@enduml
```

