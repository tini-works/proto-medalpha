# garrioCAL Appointment System

## Mermaid Diagram

```mermaid
graph LR
    %% Core Objects
    Doctor["DOCTOR<br/>---<br/>Name<br/>Email<br/>Specialization<br/>Phone<br/>License Number<br/>Clinic"]

    Patient["PATIENT<br/>---<br/>Name<br/>Email<br/>Date of Birth<br/>Patient ID<br/>Phone<br/>Medical History<br/>Genetic Profile"]

    WorkingHours["WORKING HOURS<br/>---<br/>Day of Week<br/>Start Time<br/>End Time<br/>Is Active<br/>Clinic<br/>Notes"]

    AppointmentType["APPOINTMENT TYPE<br/>---<br/>Type Name<br/>Description<br/>Est. Duration<br/>Priority Level<br/>Category<br/>Is Recurring"]

    Appointment["APPOINTMENT<br/>---<br/>Appointment ID<br/>Date<br/>Time<br/>Duration<br/>Status<br/>Reason<br/>Notes"]

    %% Relationships - Doctor
    Doctor -->|"treats (1:M)"| Patient
    Doctor -->|"follows (M:M)"| WorkingHours
    Doctor -->|"creates (1:M)"| AppointmentType
    Doctor -->|"conducts (1:M)"| Appointment

    %% Relationships - Patient
    Patient -->|"books during (M:M)"| WorkingHours
    Patient -->|"schedules (1:M)"| Appointment

    %% Relationships - Appointment
    Appointment -->|"scheduled during (M:1)"| WorkingHours

    %% Relationships - Working Hours
    WorkingHours -->|"applies to (M:1)"| Clinic["CLINIC"]

    %% Relationships - Appointment Type
    AppointmentType -->|"defines (1:M)"| Appointment

    %% Styling
    classDef doctorClass fill:#E6D5F5,stroke:#9B59B6,stroke-width:3px
    classDef patientClass fill:#D4E6F1,stroke:#3498DB,stroke-width:3px
    classDef hoursClass fill:#D5F4E6,stroke:#27AE60,stroke-width:3px
    classDef typeClass fill:#FFF4D4,stroke:#F39C12,stroke-width:3px
    classDef appointmentClass fill:#FFE4CC,stroke:#E67E22,stroke-width:3px
    classDef supportClass fill:#F0F0F0,stroke:#7F8C8D,stroke-width:2px

    class Doctor doctorClass
    class Patient patientClass
    class WorkingHours hoursClass
    class AppointmentType typeClass
    class Appointment appointmentClass
    class Clinic supportClass
```

## Object Descriptions

### Core Objects (5)

**DOCTOR** (Purple)
- Healthcare provider managing patients and appointments
- Attributes: Name, Email, Specialization, Phone, License Number, Clinic

**PATIENT** (Blue)
- Individual receiving medical care
- Attributes: Name, Email, Date of Birth, Patient ID, Phone, Medical History, Genetic Profile

**WORKING HOURS** (Green)
- Operational schedule defining service availability
- Attributes: Day of Week, Start Time, End Time, Is Active, Clinic, Notes

**APPOINTMENT TYPE** (Yellow)
- Template/category for appointment types
- Attributes: Type Name, Description, Est. Duration, Priority Level, Category, Is Recurring

**APPOINTMENT** (Orange)
- Scheduled meeting between doctor and patient
- Attributes: Appointment ID, Date, Time, Duration, Status, Reason, Notes

### Supporting Objects

**CLINIC** (Gray)
- Healthcare facility or organizational unit for doctors and trading hours

## Relationships

| From | Relationship | To | Cardinality |
|------|-------------|-----|-------------|
| Doctor | treats | Patient | 1:M |
| Doctor | follows | Working Hours | M:M |
| Doctor | creates | Appointment Type | 1:M |
| Doctor | conducts | Appointment | 1:M |
| Patient | books during | Working Hours | M:M |
| Patient | schedules | Appointment | 1:M |
| Appointment | scheduled during | Working Hours | M:1 |
| Working Hours | applies to | Clinic | M:1 |
| Appointment Type | defines | Appointment | 1:M |

## Color Legend

- **Purple (#E6D5F5)** - Doctor
- **Blue (#D4E6F1)** - Patient
- **Green (#D5F4E6)** - Working Hours
- **Yellow (#FFF4D4)** - Appointment Type
- **Orange (#FFE4CC)** - Appointment
- **Gray (#F0F0F0)** - Supporting objects (Clinic)