package com.grafka.entities.topics

import org.junit.Assert
import org.junit.Test

class KafkaNewTopicRequestTest {

    @Test
    fun `using factory method for partition and replication factor, no configs`() {
        val request = KafkaNewTopicRequest.create("Testing", 11, 14)
        val result = request.toNewTopic()

        Assert.assertEquals("Testing", result.name())
        Assert.assertEquals(11, result.numPartitions())
        Assert.assertEquals(14.toShort(), result.replicationFactor())
        Assert.assertEquals(null, result.configs())
    }

    @Test
    fun `using factory method for partition and replication factor, with configs`() {
        val configs = listOf(KafkaTopicConfig("k","value"))
        val request = KafkaNewTopicRequest.create("Testing Partition and Replication", 11, 14, configs)
        val result = request.toNewTopic()

        Assert.assertEquals("Testing Partition and Replication", result.name())
        Assert.assertEquals(11, result.numPartitions())
        Assert.assertEquals(14.toShort(), result.replicationFactor())
        Assert.assertEquals(1, result.configs().size)
        Assert.assertEquals("value", result.configs().get("k"))
    }

    @Test
    fun `using factory method for replication assignments, no configs`() {
        val replicationAssignments = listOf(KafkaReplicationAssignment(1, listOf(2,3)))
        val request = KafkaNewTopicRequest.create("Testing Replication Assignments", replicationAssignments)

        val result = request.toNewTopic()

        Assert.assertEquals("Testing Replication Assignments", result.name())
        Assert.assertEquals(1, result.replicasAssignments().size)
        Assert.assertTrue(result.replicasAssignments()[1]!!.contains(2))
        Assert.assertTrue(result.replicasAssignments()[1]!!.contains(3))
    }

    @Test
    fun `using factory method for replication assignments, with configs`() {
        val configs = listOf(KafkaTopicConfig("test name","value"))
        val replicationAssignments = listOf(KafkaReplicationAssignment(1, listOf(2,3)))
        val request = KafkaNewTopicRequest.create("Testing Replication Assignments", replicationAssignments, configs)

        val result = request.toNewTopic()

        Assert.assertEquals("Testing Replication Assignments", result.name())
        Assert.assertEquals(1, result.replicasAssignments().size)
        Assert.assertTrue(result.replicasAssignments()[1]!!.contains(2))
        Assert.assertTrue(result.replicasAssignments()[1]!!.contains(3))
        Assert.assertEquals(1, result.configs().size)
        Assert.assertEquals("value", result.configs().get("test name"))
    }

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