package com.grafka.entities.topics

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
//AclOperation.UNKNOWN.code() -> "UNKNOWN"
//AclOperation.ANY.code() -> "ANY"
//AclOperation.ALL.code() -> "ALL"
//AclOperation.READ.code() -> "READ"
//AclOperation.WRITE.code() -> "WRITE"
//AclOperation.CREATE.code() -> "CREATE"
//AclOperation.DELETE.code() -> "DELETE"
//AclOperation.ALTER.code() -> "ALTER"
//AclOperation.DESCRIBE.code() -> "DESCRIBE"
//AclOperation.CLUSTER_ACTION.code() -> "CLUSTER_ACTION"
//AclOperation.DESCRIBE_CONFIGS.code() -> "DESCRIBE_CONFIGS"
//AclOperation.DESCRIBE_CONFIGS.code() -> "DESCRIBE_CONFIGS"
//AclOperation.ALTER_CONFIGS.code() -> "ALTER_CONFIGS"
//AclOperation.IDEMPOTENT_WRITE.code() -> "IDEMPOTENT_WRITE"
//else -> null
@RunWith(SpringRunner.class)
@SpringBootTest
class KafkaAclOperation {
    @Test
    fun `test`() {

    }
}