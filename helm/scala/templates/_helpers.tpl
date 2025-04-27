{{- define "scala.name" -}}
scala
{{- end }}

{{- define "scala.fullname" -}}
{{ .Release.Name }}-scala
{{- end }}

{{- define "scala.labels" -}}
app.kubernetes.io/name: {{ include "scala.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "scala.serviceAccountName" -}}
{{ if .Values.serviceAccount.create }}
{{ include "scala.fullname" . }}
{{ else }}
default
{{ end }}
{{- end }}