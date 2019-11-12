package com.grafka.configs

import com.grafka.repositories.KafkaClusterConfigRepository
import org.apache.kafka.clients.admin.AdminClient
import org.springframework.stereotype.Service
import java.io.StringReader
import java.util.*

@Service
class AdminClientFactory(private val clusterRepository: KafkaClusterConfigRepository) {
    fun getAdminClient(clusterId: String): AdminClient {
        val cluster = clusterRepository.findById(UUID.fromString(clusterId))
        val p = Properties()
        p.load(StringReader(cluster.get().config))

        return AdminClient.create(p)
    }
}