package org.example.services

import org.example.dao.RequestDao
import org.example.models.RequestRecord
import slick.jdbc.PostgresProfile.api._

import java.time.{LocalDateTime, ZoneId, ZonedDateTime}
import scala.concurrent.{ExecutionContext, Future}

class RequestService(db: Database)(implicit ec: ExecutionContext) {
  val dao = new RequestDao(db)

  dao.createTable().onComplete {
    case scala.util.Success(_) => println("Request table initialized successfully")
    case scala.util.Failure(ex) => println(s"Failed to initialize request table: ${ex.getMessage}")
  }

  def fetchHistoryByUser(userId: String): Future[Seq[RequestRecord]] =
    dao.getByUser(userId)


  def logRequest(url: String, summary: String, userId: String): Future[RequestRecord] = {
    val record = RequestRecord(None, url, summary, ZonedDateTime.now(ZoneId.systemDefault()).toLocalDateTime.withNano(0), userId)
    dao.insert(record).map(_ => record)
  }


  def fetchHistory(): Future[Seq[RequestRecord]] = dao.getAll()
}


