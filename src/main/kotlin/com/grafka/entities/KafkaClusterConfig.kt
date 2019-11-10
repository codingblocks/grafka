package com.grafka.entities

import java.util.*
import javax.persistence.*

@Entity
@Table(name = "cluster_config")
class KafkaClusterConfig(
        @Id
        @org.hibernate.annotations.Type(type = "org.hibernate.type.PostgresUUIDType")
        @Column(name = "cluster_id")
        var clusterId: UUID = UUID(0, 0),

        @Column(name = "name")
        var name: String = "",

        @Column(name = "config", length = 4096)
        var config: String = ""
)