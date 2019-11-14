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
    fun `code 1 acl operation sets to known ANY code`() {
        val aclOperation = AclOperation.fromCode(1.toByte())
        assertFalse(KafkaAclOperation(aclOperation).unknown)
        assertEquals("ANY", KafkaAclOperation(aclOperation).code)
    }
}