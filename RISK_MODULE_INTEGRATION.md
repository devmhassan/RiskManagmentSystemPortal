# Risk Management System - New Risk Module Integration

## Overview
This document outlines the integration of the new risk module with the backend proxy services for creating risks in the Risk Management System Portal.

## Integration Components

### 1. Risk Form Service (`risk-form.service.ts`)
**Purpose**: Manages the risk form data across all components and handles conversion to DTOs.

**Key Features**:
- Reactive form state management using RxJS BehaviorSubject
- Data validation and conversion to `CreateRiskDto`
- Form reset functionality
- Cross-component data sharing

**Methods**:
- `updateBasicInformation()`: Updates basic risk information
- `updateRiskAssessment()`: Updates risk likelihood and severity
- `updateBowtieComponents()`: Updates causes and consequences
- `convertToCreateRiskDto()`: Converts form data to API-compatible DTO
- `resetForm()`: Resets all form data

### 2. Basic Information Component (`basic-information.component.ts`)
**Purpose**: Captures core risk details with validation.

**Fields**:
- **Risk ID**: Pattern validated (XX-YYYY format)
- **Status**: Uses `RiskStatus` enum from proxy
- **Description**: Minimum 10 characters required
- **Business Domain**: Dropdown selection
- **Risk Owner**: Email validation required
- **Review Date**: Date picker
- **Trigger Events**: Dynamic array management

**Validation**:
- Real-time form validation with error messages
- Pattern validation for Risk ID
- Email validation for Risk Owner
- Required field indicators with red asterisks

### 3. Risk Assessment Component (`risk-assessment.component.ts`)
**Purpose**: Captures risk likelihood and severity ratings.

**Fields**:
- **Initial Likelihood**: Uses `Likelihood` enum (Rare, Unlikely, Possible, Likely, AlmostCertain)
- **Initial Severity**: Uses `Severity` enum (Negligible, Minor, Moderate, Major, Critical)
- **Residual Likelihood**: Post-control likelihood
- **Residual Severity**: Post-control severity

**Features**:
- Real-time risk level calculation (likelihood × severity)
- Risk level color coding and text labels
- Automatic form data synchronization

### 4. Bowtie Components (`bowtie-components.component.ts`)
**Purpose**: Manages causes, consequences, and associated actions.

**Causes Section**:
- Dynamic FormArray for multiple causes
- Each cause has description, likelihood, and severity
- Prevention actions with cost and priority
- Add/remove functionality

**Consequences Section**:
- Dynamic FormArray for multiple consequences
- Each consequence has description, severity, and potential cost
- Mitigation actions with priority and due dates
- Add/remove functionality

**Validation**:
- Minimum one cause and one consequence required
- All fields properly validated
- Action priority using `ActionPriority` enum

### 5. New Risk Container Component (`new-risk.component.ts`)
**Purpose**: Orchestrates the multi-step form process.

**Features**:
- Step-based navigation with progress tracking
- Form validation before allowing progression
- Save functionality with loading states
- Cancel with form reset
- Integration with `RiskService` for API calls
- Toast notifications for success/error feedback

## API Integration

### Proxy Services Used
- **RiskService**: Main service for risk operations
  - `create(CreateRiskDto)`: Creates new risk
- **Enums**: Type-safe enum values
  - `RiskStatus`: Risk status options
  - `Likelihood`: Likelihood levels (1-5)
  - `Severity`: Severity levels (1-5)
  - `ActionPriority`: Action priority levels

### DTO Mapping
The `RiskFormService.convertToCreateRiskDto()` method maps form data to:

```typescript
CreateRiskDto {
  riskId: string;
  status: RiskStatus;
  description: string;
  businessDomain: string;
  riskOwner: string;
  reviewDate?: string;
  triggerEvents: string[];
  initialLikelihood: Likelihood;
  initialSeverity: Severity;
  residualLikelihood: Likelihood;
  residualSeverity: Severity;
  causes: CreateCauseDto[];
  consequences: CreateConsequenceDto[];
}
```

## Styling and UX

### Shared Styles (`shared-risk-styles.scss`)
- Consistent form validation styling
- Required field indicators
- Button styling with hover effects
- Loading spinner animations
- Responsive design patterns

### Form Validation
- Real-time validation feedback
- Error message styling
- Field highlighting for invalid states
- Form summary notifications

### Navigation
- Step-based progress indicator
- Disabled/enabled state management
- Breadcrumb-style navigation
- Save/Cancel action buttons

## Error Handling

### Validation Errors
- Client-side validation with immediate feedback
- Pattern validation for Risk ID format
- Email validation for Risk Owner
- Required field validation
- Minimum length validations

### API Errors
- Network error handling
- Server validation error display
- Loading state management
- User-friendly error messages via toasts

## Usage Flow

1. **Basic Information**: User enters core risk details
2. **Risk Assessment**: User assesses initial and residual risk levels
3. **Bowtie Components**: User defines causes, consequences, and actions
4. **Save**: Form data is validated and submitted to API
5. **Success**: User receives confirmation and is redirected

## Validation Rules

### Required Fields
- Risk ID (pattern: XX-YYYY)
- Risk Status
- Description (min 10 characters)
- Business Domain
- Risk Owner (valid email)
- Review Date
- Initial Likelihood & Severity
- Residual Likelihood & Severity
- At least one cause with prevention action
- At least one consequence with mitigation action

### Optional Fields
- Trigger events
- Action costs
- Action due dates

## Testing

### Build Status
✅ Project builds successfully
✅ All TypeScript compilation passes
✅ Template binding validation passes
⚠️ CSS budget warnings (non-critical)

### Integration Points Verified
- ✅ Proxy service integration
- ✅ Enum usage and mapping
- ✅ DTO conversion
- ✅ Form state management
- ✅ Validation rules
- ✅ Navigation flow

## Future Enhancements

1. **File Attachments**: Add support for risk documentation
2. **Risk Templates**: Pre-defined risk templates for common scenarios
3. **Workflow Integration**: Integration with approval workflows
4. **Risk Matrix Visualization**: Visual risk matrix display
5. **Risk Relationships**: Link related risks
6. **Advanced Validation**: Business rule validation
7. **Draft Saving**: Auto-save draft functionality

## Configuration

### Environment Setup
- Backend API URL configured in `environment.ts`
- Proxy configuration in `proxy.conf.json`
- ABP Framework integration for authentication/authorization

### Module Dependencies
- `@abp/ng.core`: Core ABP functionality
- `@abp/ng.theme.shared`: UI components and themes
- `@angular/reactive-forms`: Form management
- Risk management proxy services

This integration provides a comprehensive, user-friendly interface for creating new risks with full validation, error handling, and seamless API integration.
