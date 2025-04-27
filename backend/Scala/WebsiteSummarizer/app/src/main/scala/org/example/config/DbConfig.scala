package org.example.config

import com.typesafe.config.ConfigFactory
import slick.jdbc.PostgresProfile.api._

object DbConfig {
  private val config = ConfigFactory.load().getConfig("db")
  val db = Database.forURL(
    url = config.getString("url"),
    user = config.getString("user"),
    password = config.getString("password"),
    driver = config.getString("driver")
  )
}
