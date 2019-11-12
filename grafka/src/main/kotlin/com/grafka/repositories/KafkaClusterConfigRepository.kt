package com.grafka.repositories

import com.grafka.entities.KafkaClusterConfig
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface KafkaClusterConfigRepository : JpaRepository<KafkaClusterConfig, UUID>