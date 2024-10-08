<!-- no toc -->
# Domains <!-- no toc -->
<!-- /no toc -->

Предметной областью является система умного дома. Которая позволяет пользователю автономно подключать необходимые датчики, подключать их и настраивать сценарии работы как ему будет удобно.

В результате имеем следующие поддоменные области:

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

## <a name="owner"></a>User

Пользователь - любой пользователь внутренней и внешней системы, который может с ней взаимодействовать.

### <a name="admin"></a>Admin

Администратор занимается поддержкой внутренней работы, следит за актуальным списком поддерживаемых датчиков. Может добавлять новые датчики, прикреплять описание, изображение, инструкции по эксплуатации, а так же удалять неподдерживаемые датчики.

### <a name="user"></a>User

Пользователь приложения, который может описать сценарии работы умного дома и видеть актуальные значения датчиков.

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
System_Boundary(user_domain, "Domain: User") {
  Container(admin_subdomain, "Admin", "Subdomain", "* обновляют список датчиков партнеров")
  Container(user_subdomain, "User", "Subdomain", "* пользователи системы")
}
@enduml
```

## <a name="Home"></a>Home

Модель дома владельца, с описанием комнат, датчиков назначенными в этой комнате и их значениями.

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

System_Boundary(home_domain, "Domain: Home") {
  Container(home_subdomain, "Home", "Subdomain", "* регистрация дома\n * создание комнат\n * приглашение членов семьи")
}

@enduml
```

## <a name="device"></a>Device

Устройства предоставляющие дополнительную информацию о месте в котором они находятся, либо воплняющие определенные комманды которые в них заложены.

### <a name="device_management"></a>Device Management

Позволяет выполнять операции с датчиками которые установлены пользователем, посылать им комманды, считывать данные.

### <a name="partner_device"></a>Partner Device

Не для пользовательского использоания. Позволяет сделать подготовительные работы с датчиками, чтобы в итоге пользователю можно было его подключить. По итогу содержит список всех датчиков которые поддерживаются системой умного дома и в последствии могут быть подключены пользователем самостоятельно без как либо проблем.

### <a name="scenarios"></a>Scenarios

Представляет собой набор правил благодаря которым можно строить полноценные сценарии, в результате которых обеспечивается взаимодействие различных датчиков между собой.

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

System_Boundary(device_domain, "Domain: Device", "Domain") {
  Container(device_management_subdomain, "Device Management", "Subdomain", "* список актуальных датчиков \n * управление датчиками")
  Container(partner_device_subdomain, "Partner Device", "Subdomain", "* поддерживаемые датчики \n * добавление новых датчиков партнеров")
  Container(scenarios_subdomain, "Scenarios", "Subdomain", "* сценарии взаимодействия датчиков между собой")
}
Lay_R(device_management_subdomain, partner_device_subdomain)
Lay_R(partner_device_subdomain, scenarios_subdomain)
@enduml
```

## <a name="telemetry"></a>Telemetry

Телеметрия занимается сбором и анализом данных с датчиков.

### <a name="telemetry"></a>Telemetry

Отвечает за отслеживание данных с датчиков.

### <a name="telemetry_analysis"></a>Telemetry Analysis

Занимается анализом данных с устройств.

```puml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

System_Boundary(telemetry_domain, "Domain: Telemetry") {
  Container(telemetry_subdomain, "Telemetry", "Subdomain", "* отслеживание данных устройств")
  Container(telemetry_analysis, "Telemetry Analysis", "Subdomain", "* анализ данных")
}

@enduml
```
