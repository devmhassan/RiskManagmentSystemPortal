# JSON Samples for Bowtie Component DTO Integration

## 📋 Current Component Expected Structure (CreateRiskDto format)

This is what the current bowtie component expects and works with:

```json
{
  "riskId": "RISK-001",
  "status": 1,
  "description": "Sample risk description",
  "businessDomain": "IT",
  "riskOwner": "john.doe@company.com",
  "reviewDate": "2025-12-31",
  "triggerEvents": ["System failure", "Data breach"],
  "initialLikelihood": 3,
  "initialSeverity": 3,
  "residualLikelihood": 2,
  "residualSeverity": 2,
  "causes": [
    {
      "description": "Outdated software systems",
      "likelihood": 3,
      "severity": 4,
      "preventionActions": [
        {
          "description": "Regular software updates and patches",
          "cost": 5000.00,
          "priority": 2
        },
        {
          "description": "Implement automated update system",
          "cost": 15000.00,
          "priority": 1
        }
      ]
    },
    {
      "description": "Insufficient backup procedures",
      "likelihood": 2,
      "severity": 5,
      "preventionActions": [
        {
          "description": "Implement daily backup routine",
          "cost": 2500.00,
          "priority": 1
        }
      ]
    }
  ],
  "consequences": [
    {
      "description": "System downtime affecting business operations",
      "severity": 4,
      "potentialCost": 50000.00,
      "mitigationActions": [
        {
          "description": "Establish disaster recovery procedures",
          "priority": 1,
          "dueDate": "2025-09-30"
        },
        {
          "description": "Create redundant system architecture",
          "priority": 2,
          "dueDate": "2025-10-15"
        }
      ]
    },
    {
      "description": "Data loss resulting in compliance violations",
      "severity": 5,
      "potentialCost": 100000.00,
      "mitigationActions": [
        {
          "description": "Implement real-time data replication",
          "priority": 1,
          "dueDate": "2025-08-31"
        }
      ]
    }
  ]
}
```

## 🔄 Backend API Response (Current GetByRiskIdAsync)

This is what the backend currently returns:

```json
{
  "id": 1,
  "riskId": "RISK-001",
  "status": 1,
  "description": "Sample risk description",
  "businessDomain": "IT",
  "riskOwner": "john.doe@company.com",
  "reviewDate": "2025-12-31T00:00:00.000Z",
  "triggerEvents": ["System failure", "Data breach"],
  "initialLikelihood": 3,
  "initialSeverity": 4,
  "initialRiskLevel": 12,
  "residualLikelihood": 2,
  "residualSeverity": 2,
  "residualRiskLevel": 4,
  "requiresImmediateAction": true,
  "requiresReview": false,
  "creationTime": "2025-08-01T10:30:00.000Z",
  "lastModificationTime": "2025-08-09T09:00:00.000Z",
  "causes": [
    {
      "id": 1,
      "description": "Outdated software systems",
      "probability": 0.6,
      "preventionActions": [
        {
          "id": 1,
          "description": "Regular software updates and patches",
          "cost": 5000.00,
          "priority": 2,
          "status": 0
        },
        {
          "id": 2,
          "description": "Implement automated update system",
          "cost": 15000.00,
          "priority": 1,
          "status": 1
        }
      ]
    }
  ],
  "consequences": [
    {
      "id": 1,
      "potentialCost": 50000.00,
      "mitigationActions": [
        {
          "id": 1,
          "consequenceId": 1,
          "description": "Establish disaster recovery procedures",
          "priority": 1,
          "status": 0,
          "estimatedCost": 25000.00,
          "assignedTo": "jane.smith@company.com",
          "dueDate": "2025-09-30T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

## 🎯 Ideal Backend Response for Component Compatibility

To make the backend fully compatible with the current component, modify the backend to return this structure:

```json
{
  "id": 1,
  "riskId": "RISK-001",
  "status": 1,
  "description": "Sample risk description",
  "businessDomain": "IT",
  "riskOwner": "john.doe@company.com",
  "reviewDate": "2025-12-31",
  "triggerEvents": ["System failure", "Data breach"],
  "initialLikelihood": 3,
  "initialSeverity": 4,
  "initialRiskLevel": 12,
  "residualLikelihood": 2,
  "residualSeverity": 2,
  "residualRiskLevel": 4,
  "requiresImmediateAction": true,
  "requiresReview": false,
  "creationTime": "2025-08-01T10:30:00.000Z",
  "lastModificationTime": "2025-08-09T09:00:00.000Z",
  "causes": [
    {
      "id": 1,
      "description": "Outdated software systems",
      "likelihood": 3,
      "severity": 4,
      "probability": 0.6,
      "preventionActions": [
        {
          "id": 1,
          "description": "Regular software updates and patches",
          "cost": 5000.00,
          "priority": 2,
          "status": 0,
          "assignedTo": "john.doe@company.com",
          "dueDate": "2025-09-15"
        },
        {
          "id": 2,
          "description": "Implement automated update system",
          "cost": 15000.00,
          "priority": 1,
          "status": 1,
          "assignedTo": "tech.team@company.com",
          "dueDate": "2025-10-01"
        }
      ]
    },
    {
      "id": 2,
      "description": "Insufficient backup procedures",
      "likelihood": 2,
      "severity": 5,
      "probability": 0.4,
      "preventionActions": [
        {
          "id": 3,
          "description": "Implement daily backup routine",
          "cost": 2500.00,
          "priority": 1,
          "status": 0,
          "assignedTo": "backup.admin@company.com",
          "dueDate": "2025-08-20"
        }
      ]
    }
  ],
  "consequences": [
    {
      "id": 1,
      "description": "System downtime affecting business operations",
      "severity": 4,
      "potentialCost": 50000.00,
      "mitigationActions": [
        {
          "id": 1,
          "consequenceId": 1,
          "description": "Establish disaster recovery procedures",
          "priority": 1,
          "status": 0,
          "estimatedCost": 25000.00,
          "assignedTo": "disaster.recovery@company.com",
          "dueDate": "2025-09-30"
        },
        {
          "id": 2,
          "consequenceId": 1,
          "description": "Create redundant system architecture",
          "priority": 2,
          "status": 0,
          "estimatedCost": 35000.00,
          "assignedTo": "infrastructure@company.com",
          "dueDate": "2025-10-15"
        }
      ]
    },
    {
      "id": 2,
      "description": "Data loss resulting in compliance violations",
      "severity": 5,
      "potentialCost": 100000.00,
      "mitigationActions": [
        {
          "id": 3,
          "consequenceId": 2,
          "description": "Implement real-time data replication",
          "priority": 1,
          "status": 1,
          "estimatedCost": 45000.00,
          "assignedTo": "data.team@company.com",
          "dueDate": "2025-08-31"
        }
      ]
    }
  ]
}
```

## 📝 Enum Value References

For the backend implementation, here are the enum values:

### RiskStatus Enum:
```json
{
  "Identified": 0,
  "Assessed": 1,
  "Mitigated": 2,
  "Accepted": 3,
  "Transferred": 4,
  "Avoided": 5,
  "Reviewed": 6
}
```

### Likelihood Enum:
```json
{
  "Rare": 1,
  "Unlikely": 2,
  "Possible": 3,
  "Likely": 4,
  "AlmostCertain": 5
}
```

### Severity Enum:
```json
{
  "Insignificant": 1,
  "Minor": 2,
  "Moderate": 3,
  "Major": 4,
  "Catastrophic": 5
}
```

### ActionPriority Enum:
```json
{
  "Low": 1,
  "Medium": 2,
  "High": 3,
  "Critical": 4
}
```

### ActionStatus Enum:
```json
{
  "Open": 0,
  "InProgress": 1,
  "Completed": 2,
  "OnHold": 3,
  "Cancelled": 4
}
```

## 🔧 Backend Implementation Suggestions

### Option 1: Modify Existing DTOs
Add the missing fields to your existing DTOs:

```csharp
public class CauseDto : EntityDto<int>
{
    public string Description { get; set; }
    public double Probability { get; set; }
    public Likelihood Likelihood { get; set; }  // Add this
    public Severity Severity { get; set; }      // Add this
    public List<PreventionActionDto> PreventionActions { get; set; }
}

public class ConsequenceDto : EntityDto<int>
{
    public string Description { get; set; }     // Add this
    public Severity Severity { get; set; }      // Add this
    public decimal PotentialCost { get; set; }
    public List<MitigationActionDto> MitigationActions { get; set; }
}

public class PreventionActionDto : EntityDto<int>
{
    public string Description { get; set; }
    public decimal Cost { get; set; }
    public ActionPriority Priority { get; set; }
    public ActionStatus Status { get; set; }
    public string AssignedTo { get; set; }      // Add this
    public DateTime? DueDate { get; set; }      // Add this
}
```

### Option 2: Create Component-Specific DTOs
Create new DTOs specifically for the component:

```csharp
public class BowtieComponentDto
{
    public List<BowtieComponentCauseDto> Causes { get; set; }
    public List<BowtieComponentConsequenceDto> Consequences { get; set; }
}

public class BowtieComponentCauseDto
{
    public int Id { get; set; }
    public string Description { get; set; }
    public Likelihood Likelihood { get; set; }
    public Severity Severity { get; set; }
    public List<BowtieComponentPreventionActionDto> PreventionActions { get; set; }
}
```

## 🎯 Recommended Approach

I recommend **Option 1** - extending existing DTOs with the missing fields. This ensures:
- ✅ Backward compatibility
- ✅ Single source of truth
- ✅ Direct component compatibility
- ✅ Future-proof design
