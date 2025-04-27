package org.example.models

import java.time.LocalDateTime

case class RequestRecord(
                          id: Option[Int] = None,
                          url: String,
                          summary: String,
                          timestamp: LocalDateTime ,
                          userId: String
                        )
