{{- define "example-rbac.name" -}}
{{- default .Chart.Name .Values.nameOverride | lower | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "example-rbac.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | lower | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "example-rbac.name" .) | lower | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "example-rbac.backend.name" -}}
{{- printf "%s-backend" (include "example-rbac.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "example-rbac.frontend.name" -}}
{{- printf "%s-frontend" (include "example-rbac.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "example-rbac.appVersion" -}}
{{- default .Chart.AppVersion .Values.app.version -}}
{{- end -}}

{{- define "example-rbac.labels" -}}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
app.kubernetes.io/name: {{ .Values.app.name | quote }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ include "example-rbac.appVersion" . | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "example-rbac.backend.selectorLabels" -}}
app.kubernetes.io/name: {{ .Values.app.name | quote }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: backend
{{- end -}}

{{- define "example-rbac.frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ .Values.app.name | quote }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: frontend
{{- end -}}

{{- define "example-rbac.backend.image" -}}
{{- printf "%s:%s" .Values.backend.image.repository (default (include "example-rbac.appVersion" .) .Values.backend.image.tag) -}}
{{- end -}}

{{- define "example-rbac.frontend.image" -}}
{{- printf "%s:%s" .Values.frontend.image.repository (default (include "example-rbac.appVersion" .) .Values.frontend.image.tag) -}}
{{- end -}}

{{- define "example-rbac.secretName" -}}
{{- if .Values.secrets.existingSecret -}}
{{- .Values.secrets.existingSecret -}}
{{- else -}}
{{- printf "%s-secrets" (include "example-rbac.fullname" .) -}}
{{- end -}}
{{- end -}}

{{/* Effective hostname: localhost when not set (portfolio/dev clusters). */}}
{{- define "example-rbac.hostname" -}}
{{- default "localhost" .Values.hostname -}}
{{- end -}}

{{/* Use a chart-managed SelfSigned Issuer when hostname is empty. */}}
{{- define "example-rbac.useSelfSigned" -}}
{{- if and .Values.certManager.enabled (not .Values.hostname) -}}true{{- end -}}
{{- end -}}

{{- define "example-rbac.issuerName" -}}
{{- if eq (include "example-rbac.useSelfSigned" .) "true" -}}
{{- printf "%s-selfsigned" (include "example-rbac.fullname" .) -}}
{{- else -}}
{{- .Values.certManager.issuer.name -}}
{{- end -}}
{{- end -}}

{{- define "example-rbac.issuerKind" -}}
{{- if eq (include "example-rbac.useSelfSigned" .) "true" -}}Issuer{{- else -}}ClusterIssuer{{- end -}}
{{- end -}}

{{- define "example-rbac.tlsSecretName" -}}
{{- printf "%s-tls" (include "example-rbac.fullname" .) -}}
{{- end -}}

{{/*
Hardened pod and container securityContext, baked into the chart so operators
can't accidentally weaken them. Both images are built to run as a non-root
user with a read-only filesystem and no extra capabilities.
*/}}
{{- define "example-rbac.podSecurityContext" -}}
runAsNonRoot: true
runAsUser: 1000
runAsGroup: 1000
fsGroup: 1000
seccompProfile:
  type: RuntimeDefault
{{- end -}}

{{- define "example-rbac.containerSecurityContext" -}}
allowPrivilegeEscalation: false
readOnlyRootFilesystem: true
capabilities:
  drop:
    - ALL
{{- end -}}
