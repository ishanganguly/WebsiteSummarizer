package org.example.server

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import org.example.services._
import org.example.config.DbConfig
import org.example.utils.JsonSupport
import scala.concurrent.ExecutionContextExecutor
import com.typesafe.config.ConfigFactory
import scala.util.{Failure, Success}

object HttpServer {
  def start(): Unit = {
    implicit val system: ActorSystem = ActorSystem("scala-summarizer")
    implicit val executionContext: ExecutionContextExecutor = system.dispatcher

    val db = DbConfig.db
    val requestService = new RequestService(db)
    requestService.dao.createTable().onComplete {
      case Success(_) =>
        println(" Table created successfully. Starting server...")

        val httpService = new HttpService(db)

        val jsonSupport = new JsonSupport {}
        import jsonSupport._

        val route =
          path("summarize") {
            post {
              entity(as[Map[String, String]]) { payload =>
                val url = payload.getOrElse("url", "")
                val userId = payload.getOrElse("userId", "anonymous")
                if (url.isEmpty) complete(400 -> "URL is required")
                else onSuccess(httpService.getSummary(url, userId))(complete(_))
              }
            }
          } ~
            path("history") {
              parameter("userId".?) { userIdOpt =>
                val userId = userIdOpt.getOrElse("anonymous")
                get {
                  onSuccess(requestService.fetchHistoryByUser(userId))(complete(_))
                }
              }
            }

        val config = ConfigFactory.load().getConfig("server")
        val host = config.getString("host")
        val port = config.getInt("port")

        Http().newServerAt(host, port).bind(route).onComplete {
          case Success(binding) =>
            val address = binding.localAddress
            println(s"Server online at http://${address.getHostString}:${address.getPort}/")
          case Failure(ex) =>
            println(s"Failed to bind HTTP server: ${ex.getMessage}")
            system.terminate()
        }

      case Failure(ex) =>
        println(s" Failed to create table: ${ex.getMessage}")
        system.terminate()
    }
  }
}
