package com.grafka.entities

import java.util.*
import javax.persistence.*

@Entity
@Table(name = "cluster_config")
class KafkaClusterConfig(
        @Id
        @org.hibernate.annotations.Type(type = "org.hibernate.type.PostgresUUIDType")
        @Column(name = "cluster_id", nullable = false)
        var clusterId: UUID = UUID(0, 0),

        @Column(name = "name", nullable = false)
        var name: String = "",

        @Column(name = "config", length = 4096, nullable = false)
        var config: String = ""
)