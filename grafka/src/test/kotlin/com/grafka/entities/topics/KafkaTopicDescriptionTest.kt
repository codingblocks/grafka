package com.grafka.entities.topics

import com.grafka.entities.KafkaNode
import org.apache.kafka.clients.admin.TopicDescription
import org.apache.kafka.common.Node
import org.apache.kafka.common.TopicPartitionInfo
import org.junit.Assert
import org.junit.Test

class KafkaTopicDescriptionTest {
    @Test
    fun `wrapper sets all appropriate properties`() {
        val leader = Node(11, "localhost", 80, "rack")
        val replicas = listOf(
                Node(12, "www", 2, "123"),
                Node(942, "www2", 33, "rack")
        )
        val isr = listOf(
                Node(42, "www3", 1011, "rack"),
                Node(541, "www4", 212, "rack2")
        )
        val partitions = arrayListOf(TopicPartitionInfo(2, leader, replicas, isr))
        val description = TopicDescription("name", true, partitions)

        val wrapper = KafkaTopicDescription.create(description)
        Assert.assertEquals(description.name(), wrapper.name)
        Assert.assertEquals(description.isInternal, wrapper.internal)
        Assert.assertEquals(description.partitions().first().partition(), wrapper.partitions.first().partition)

        assertNode(description.partitions().first().leader(), wrapper.partitions.first().leader)
        description.partitions().first().replicas().forEachIndexed { index, node ->
            assertNode(node, wrapper.partitions.first().replicas[index])
        }
        description.partitions().first().isr().forEachIndexed { index, node ->
            assertNode(node, wrapper.partitions.first().isr[index])
        }
    }

    private fun assertNode(i: Node, o: KafkaNode) {
        Assert.assertEquals(i.host(), o.host)
        Assert.assertEquals(i.port(), o.port)
        Assert.assertEquals(i.id(), o.id)
    }
}