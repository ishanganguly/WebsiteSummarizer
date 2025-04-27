{{- define "springboot.name" -}}
springboot
{{- end }}

{{- define "springboot.fullname" -}}
{{ .Release.Name }}-springboot
{{- end }}

{{- define "springboot.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{ default (include "springboot.fullname" .) .Values.serviceAccount.name }}
{{- else }}
default
{{- end }}
{{- end }}

{{- define "springboot.labels" -}}
app.kubernetes.io/name: {{ include "springboot.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
