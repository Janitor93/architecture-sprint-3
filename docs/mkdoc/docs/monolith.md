# AsIs-архитектура

Данная страница содержит информацию о текущем состоянии системы.

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

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
System_Boundary(device_management_domain, "Управление устройствами", "Domain") {
  System(device_state_context, "Context: Управление состоянием", "- включение устройства \n - выключение устройства")
  System(device_temperature_context, "Context: Установка температуры", "- поддержание заданной температуры")
}
System_Boundary(monitoring_domain, "Мониторинг", "Domain") {
  System(current_temperature_context, "Context: Отображение состояния", "- получение текущей температуры \n - получение текущего состояния и настроек датчика")
}
@enduml
```

### Контекст системы:

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

Person(user, "User", "Uses the SmartHome")
System_Boundary(smart_home, "Smart Home") {
  System(heating_service, "Heating Service", "Управление системой отопления")
}
System_Ext(sensors, "Sensors", "Physical sensors")

Rel(user, heating_service, "Uses")
BiRel(heating_service, sensors, "Data exchange")
@enduml
```