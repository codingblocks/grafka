package com.grafka.entities

import org.junit.Assert.*
import org.apache.kafka.common.acl.AclOperation
import org.junit.Test

class KafkaAclOperationTest {
    @Test
    fun `unrecognized acl operation sets to unknown`() {
        val aclOperation = AclOperation.fromString("This is an invalid operation")
        assertTrue(KafkaAclOperation(aclOperation).unknown)
        assertEquals("UNKNOWN", KafkaAclOperation(aclOperation).code)
    }

    @Test
    fun `code 0 acl operation sets to unknown`() {
        val aclOperation = AclOperation.fromCode(0.toByte())
        assertTrue(KafkaAclOperation(aclOperation).unknown)
        assertEquals("UNKNOWN", KafkaAclOperation(aclOperation).code)
    }

    // TODO parameterized tests for all types? https://www.baeldung.com/junit-5-kotlin
    @Test
    fun `acl operation numeric code gets set to known code`() {
        // TODO should be able to do this with ParameterizedTest/CsvSource but IntelliJ isn't seeing it?
        val args = listOf("1,ANY","2,ALL","3,READ","4,WRITE","5,CREATE","6,DELETE","7,ALTER","8,DESCRIBE","9,CLUSTER_ACTION","10,DESCRIBE_CONFIGS","11,ALTER_CONFIGS","12,IDEMPOTENT_WRITE")

        args.forEach{
            val parts = it.split(",")
            val aclOperation = AclOperation.fromCode(parts[0].toByte())
            assertFalse(KafkaAclOperation(aclOperation).unknown)
            assertEquals(parts[1], KafkaAclOperation(aclOperation).code)
        }

    }
}