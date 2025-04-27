package org.example

import org.example.server.HttpServer

object App {
  def main(args: Array[String]): Unit = {
    println("Starting Website Summarizer backend...")
    HttpServer.start()
  }
}