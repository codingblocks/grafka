package com.grafka.entities.topics

import org.junit.Assert
import org.junit.Test

class KafkaNewTopicRequestTest {
    @Test
    fun `creating new topic with partition, replicationFactor is sufficient`() {
        val name = "Test name"
        val partitions = 10
        val replicationFactor = 13.toShort()
        val request = KafkaNewTopicRequest(name, partitions, replicationFactor)

        val result = request.toNewTopic()

        Assert.assertEquals(partitions, result.numPartitions())
        Assert.assertEquals(replicationFactor, result.replicationFactor())
        Assert.assertEquals(name, result.name())
    }

    @Test
    fun `creating new topic with replicationAssignment is sufficient`() {
        val name = "Test name 2"
        val replicationAssignments = listOf(KafkaReplicationAssignment(1, listOf(2,3)))
        val request = KafkaNewTopicRequest(name, replicationAssignments = replicationAssignments)

        val result = request.toNewTopic()

        Assert.assertEquals(name, result.name())
        Assert.assertEquals(1, result.replicasAssignments().size)
        Assert.assertTrue(result.replicasAssignments()[1]!!.contains(2))
        Assert.assertTrue(result.replicasAssignments()[1]!!.contains(3))
    }

    @Test(expected = IllegalArgumentException::class)
    fun `creating topic with partions, replication and assignment is invalid`() {
        val name = "Another test"
        val partitions = 2
        val replicationFactor = 4.toShort()
        val replicationAssignments = listOf(KafkaReplicationAssignment(1, listOf(2,3)))
        KafkaNewTopicRequest(name, partitions, replicationFactor, replicationAssignments = replicationAssignments)
    }

    @Test
    fun `creating topic with configs`() {
        val name = "Another test"
        val partitions = 2
        val replicationFactor = 4.toShort()
        val configs = listOf(KafkaTopicConfig("name","value"))
        val request = KafkaNewTopicRequest(name, partitions, replicationFactor, configs)

        val result = request.toNewTopic()

        Assert.assertEquals(1, result.configs().size)
        Assert.assertEquals("value", result.configs().get("name"))
    }
}