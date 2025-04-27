package org.example.dao

import org.example.models.RequestRecord
import slick.jdbc.PostgresProfile.api._
import java.time.LocalDateTime
import scala.concurrent.{ExecutionContext, Future}

class RequestTable(tag: Tag) extends Table[RequestRecord](tag, "request_history") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def url = column[String]("url")
  def summary = column[String]("summary")
  def timestamp = column[LocalDateTime]("timestamp")
  def userId = column[String]("user_id")

  def * = (id.?, url, summary, timestamp, userId) <> (RequestRecord.tupled, RequestRecord.unapply)
}

class RequestDao(db: Database)(implicit ec: ExecutionContext) {
  val table = TableQuery[RequestTable]

  def createTable(): Future[Unit] = {
    val checkTableExists =
      sql"""
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'request_history'
        )
      """.as[Boolean].head

    db.run(checkTableExists).flatMap {
      case true =>
        println("Table already exists. Skipping creation.")
        Future.successful(())
      case false =>
        println("Creating table request_history...")
        db.run(table.schema.create)
    }
  }

  def insert(record: RequestRecord): Future[Int] = db.run(table += record)
  def getAll(): Future[Seq[RequestRecord]] = db.run(table.sortBy(_.timestamp.desc).result)
  def getByUser(userId: String): Future[Seq[RequestRecord]] =
    db.run(table.filter(_.userId === userId).sortBy(_.timestamp.desc).result)
}
