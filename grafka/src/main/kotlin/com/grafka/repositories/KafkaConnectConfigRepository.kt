package com.grafka.repositories

import com.grafka.entities.KafkaConnectConfig
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface KafkaConnectConfigRepository : JpaRepository<KafkaConnectConfig, UUID>