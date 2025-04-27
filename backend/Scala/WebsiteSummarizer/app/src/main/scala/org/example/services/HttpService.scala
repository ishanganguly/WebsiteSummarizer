package org.example.services

import org.example.models._
import sttp.client3._
import sttp.model._
import com.typesafe.config.ConfigFactory
import slick.jdbc.PostgresProfile.api._
import io.circe.parser._
import io.circe.generic.auto._
import io.circe.syntax._

import java.time.ZoneId
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}
import scala.concurrent.duration._

class HttpService(db: Database)(implicit ec: ExecutionContext) {
  private val config = ConfigFactory.load()
  private val fastApiUrl = config.getString("fastapi.url")
  private val backend = HttpURLConnectionBackend()
  private val requestService = new RequestService(db)
  private val timeoutDuration = 40.seconds

  def getSummary(url: String, userId: String): Future[RequestRecord] = {
    val payload = Map("url" -> url).asJson.noSpaces
    val request = basicRequest
      .body(payload)
      .post(uri"$fastApiUrl")
      .contentType(MediaType.ApplicationJson)
      .response(asString)
      .readTimeout(timeoutDuration)

    Future {
      val response = request.send(backend)

      response.body match {
        case Right(body) =>
          decode[FastApiResponse](body) match {
            case Right(apiResponse) =>
              val record = RequestRecord(
                None,
                apiResponse.url,
                apiResponse.summary,
                java.time.ZonedDateTime.now(ZoneId.systemDefault()).toLocalDateTime.withNano(0),
                userId
              )
              requestService.logRequest(apiResponse.url, apiResponse.summary, userId)
                .onComplete {
                  case Success(_) => println(s"Logged: ${apiResponse.url} for user: $userId")
                  case Failure(e) => println(s"Log failed: ${e.getMessage}")
                }
              record
            case Left(err) =>
              throw new Exception(s"JSON decode error: $err")
          }
        case Left(err) =>
          throw new Exception(s"FastAPI error: $err")
      }
    }
  }
}

