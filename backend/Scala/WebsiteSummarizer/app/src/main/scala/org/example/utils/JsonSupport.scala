package org.example.utils

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json._
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import org.example.models._

trait JsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit object LocalDateTimeFormat extends JsonFormat[LocalDateTime] {
    private val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")
    def write(x: LocalDateTime) = JsString(x.format(formatter))
    def read(value: JsValue): LocalDateTime = value match {
      case JsString(s) => LocalDateTime.parse(s, formatter)
      case _ => deserializationError("Expected ISO_DATE_TIME format")
    }
  }

  implicit val requestRecordFormat = jsonFormat5(RequestRecord)
  implicit val fastApiResponseFormat = jsonFormat2(FastApiResponse)
}
